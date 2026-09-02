'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { Candle } from './Candle'
import { MemorialPortrait, type PortraitPlate } from './MemorialPortrait'
import { Button } from '@/components/primitives/Button'
import { cn } from '@/lib/utils/cn'

interface Status {
  count: number
  hasLitRecently: boolean
  nextAllowedAt: string | null
}

interface LitResult extends Status {
  accepted: boolean
  displayName: string | null
  publishName: boolean
}

/**
 * The memorial candle, and the act of lighting one.
 *
 * Two columns on a wide screen so the shelf and the action are on screen
 * together: on the leading side his photograph with the candle standing in
 * front of it and the count beneath — one object, not three — and on the
 * trailing side the words and the form. On a phone they stack in the same
 * order. Nobody should have to scroll to find out what this page asks of them.
 *
 * The count is read once on mount, so the page itself stays static. Lighting
 * posts once and takes the new count from the reply — there is no polling and
 * no second source of truth.
 *
 * A name is optional and consent to publish it is a separate, unticked
 * question. Neither is required to light a candle, and the box is never ticked
 * for the visitor. What the server actually decided comes back in the reply,
 * so the confirmation states what happened rather than what was asked for.
 *
 * A visitor who has already lit one inside the cooldown window sees their
 * candle burning and the form gone. That is the honest state: their candle is
 * lit. It is not framed as a refusal.
 *
 * `onBurningChange` is reported from the two places that actually learn the
 * answer — the status reply and the lighting reply — rather than from an
 * effect watching derived state, so the room brightens exactly when the server
 * says there is a flame.
 */
export function MemorialCandle({
  memorialTitle,
  siteName,
  portrait,
  onPublished,
  onBurningChange,
}: {
  memorialTitle: string
  siteName: string
  /** Resolved on the server; null until the print exists. */
  portrait: PortraitPlate | null
  onPublished?: () => void
  onBurningChange?: (burning: boolean) => void
}) {
  const nameId = useId()
  const consentId = useId()
  const helpId = useId()

  const [status, setStatus] = useState<Status | null>(null)
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [lit, setLit] = useState<LitResult | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/candles')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('unavailable'))))
      .then((s: Status) => {
        if (cancelled) return
        setStatus(s)
        if (s.hasLitRecently) onBurningChange?.(true)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
    // Reporting up must not re-run the fetch: the callback is a notification,
    // not an input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const light = useCallback(async () => {
    setBusy(true)
    setFailed(false)
    try {
      const res = await fetch('/api/candles', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ displayName: name.trim() || undefined, publishName: consent }),
      })
      if (!res.ok) throw new Error('unavailable')
      const next = (await res.json()) as LitResult
      setStatus(next)
      if (next.accepted) {
        setLit(next)
        onBurningChange?.(true)
        // Only a published name changes the list below.
        if (next.publishName) onPublished?.()
      }
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }, [name, consent, onPublished, onBurningChange])

  const justLit = lit?.accepted === true
  const burning = Boolean(status?.hasLitRecently) || justLit
  const canLight = status !== null && !status.hasLitRecently && !justLit
  const consentWithoutName = consent && name.trim() === ''

  return (
    <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ---- the shelf: his photograph, the candle in front of it, the count ---- */}
      <div className="relative flex flex-col items-center">
        {/* The light immediately around the candle. The room's own light is a
            layer above this one, in MemorialSection. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[6rem] left-1/2 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 transition-opacity duration-[1400ms]"
          style={{
            opacity: burning ? 1 : 0.3,
            background:
              'radial-gradient(circle at center, rgba(226,182,96,0.30) 0%, rgba(226,182,96,0.09) 40%, transparent 70%)',
          }}
        />

        {portrait && (
          <div className="w-[12.5rem] sm:w-[15rem]">
            <MemorialPortrait portrait={portrait} burning={burning} />
          </div>
        )}

        {/* With a photograph above it the candle is pulled up over the print's
            lower edge, so the flame rises in front of him, below his face. A
            negative margin rather than absolute positioning, so the count
            still sits correctly and the arrangement holds at every width.
            Without a photograph the candle simply stands on its own. */}
        <div
          className={cn(
            'relative z-10',
            portrait
              ? '-mt-[7.5rem] w-[7rem] sm:-mt-[9rem] sm:w-[8.5rem]'
              : 'w-[9.5rem] sm:w-[11rem]',
            justLit && 'candle-kindle',
          )}
        >
          <Candle lit={burning} />
        </div>

        <div aria-live="polite" className="mt-6 text-center">
          {status === null ? (
            <p className="label-caps text-paper/45">{failed ? '' : '…'}</p>
          ) : (
            <>
              <p className="label-caps text-brass-soft">עד היום הודלקו לזכרו</p>
              <p className="mt-2 flex items-baseline justify-center gap-3">
                <span
                  dir="ltr"
                  className="font-display text-paper numerals text-5xl leading-none font-light transition-colors duration-[1400ms] sm:text-6xl"
                  style={{ color: burning ? 'var(--color-brass-faint)' : undefined }}
                >
                  {status.count.toLocaleString('he-IL')}
                </span>
                <span className="label-caps text-paper/70">
                  {status.count === 1 ? 'נר' : 'נרות'}
                </span>
              </p>
            </>
          )}

          {justLit && (
            <div className="border-brass-line/40 mt-6 border-t pt-5">
              <p className="font-display text-paper text-xl">
                {lit?.displayName ? `${lit.displayName}, הנר הודלק לזכרו.` : 'נר נוסף הודלק לזכרו'}
              </p>
              {lit?.publishName && (
                <p className="text-paper/70 mt-2 text-[0.95rem]">שמך יוצג בין מדליקי הנרות.</p>
              )}
            </div>
          )}

          {!justLit && status?.hasLitRecently && (
            <p className="text-paper/70 border-brass-line/40 mt-6 border-t pt-5 text-[0.95rem]">
              הנר שהדלקת דולק.
            </p>
          )}
        </div>
      </div>

      {/* ---- the words and the form ---- */}
      <div>
        <div className="mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="bg-wine-line/60 h-px w-8" />
          <p className="label-caps text-brass-soft tracking-[var(--tracking-wide-label)]">
            {memorialTitle}
          </p>
        </div>

        <h1 className="font-display text-paper text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
          {siteName}
        </h1>

        {canLight ? (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault()
              void light()
            }}
          >
            <div className="bg-navy-soft/70 border-brass-line/30 focus-within:border-brass-line border px-6 py-5 transition-colors">
              <label htmlFor={nameId} className="label-caps text-brass-soft block">
                שם (לא חובה)
              </label>
              <input
                id={nameId}
                name="displayName"
                type="text"
                value={name}
                maxLength={60}
                autoComplete="name"
                aria-describedby={helpId}
                onChange={(e) => setName(e.target.value)}
                placeholder="השם שלך"
                className="font-display text-paper placeholder:text-paper/35 border-brass-line/35 focus:border-brass-soft mt-2 w-full border-0 border-b bg-transparent px-0 pb-2 text-xl leading-snug transition-colors outline-none"
              />
              <p id={helpId} className="label-caps text-paper/50 mt-3">
                אפשר להדליק נר גם ללא הזנת שם
              </p>

              <div className="border-rule-navy mt-7 border-t pt-5">
                <div className="flex items-start gap-3">
                  <input
                    id={consentId}
                    name="publishName"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="accent-brass-soft mt-0.5 h-4 w-4 shrink-0"
                  />
                  <label htmlFor={consentId} className="text-paper/80 text-[0.95rem] leading-snug">
                    אני מסכים ששמי יוצג באתר בין מדליקי הנרות
                  </label>
                </div>

                {consentWithoutName && (
                  <p className="label-caps text-brass-soft mt-2.5 ps-7">
                    יש להזין שם כדי שיוצג ברשימה
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="memorialDeep"
              disabled={busy}
              className={cn('mt-6 w-full justify-center px-8 py-4', busy && 'opacity-60')}
            >
              {busy ? 'מדליק…' : 'הדלקת נר לזכרו'}
            </Button>

            <p className="text-paper/50 mt-5 text-[0.85rem] leading-relaxed">
              אין צורך בהרשמה ואיננו שומרים כתובת IP או פרטי קשר. לצורך מניעת הדלקות כפולות ומניית
              מבקרים נשמר מזהה אנונימי מוצפן שאינו כולל פרטים אישיים. שם שנמסר מוצג באתר רק בהסכמה
              מפורשת.
            </p>
          </form>
        ) : (
          <p className="text-paper/70 mt-8 max-w-[32rem] leading-relaxed">
            נר אחד בכל יממה. הנר שהדלקת דולק, ואפשר לחזור ולהדליק נוסף מחר.
          </p>
        )}

        {failed && (
          <p className="label-caps text-brass-soft mt-6 max-w-[28rem]">
            לא ניתן להתחבר כרגע. נסה שוב מאוחר יותר.
          </p>
        )}
      </div>
    </div>
  )
}
