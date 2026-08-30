'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { Candle } from './Candle'
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
 * The memorial candle.
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
 */
export function MemorialCandle({ onPublished }: { onPublished?: () => void }) {
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
        if (!cancelled) setStatus(s)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
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
        // Only a published name changes the list below.
        if (next.publishName) onPublished?.()
      }
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }, [name, consent, onPublished])

  const justLit = lit?.accepted === true
  const burning = Boolean(status?.hasLitRecently) || justLit
  const canLight = status !== null && !status.hasLitRecently && !justLit
  const consentWithoutName = consent && name.trim() === ''

  return (
    <div className="relative flex flex-col items-center">
      {/* The light in the room. It sits behind the candle and brightens once a
          flame is burning, so the page itself responds to the act. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-4rem] left-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 transition-opacity duration-[1400ms]"
        style={{
          opacity: burning ? 1 : 0.45,
          background:
            'radial-gradient(circle at center, rgba(226,182,96,0.22) 0%, rgba(226,182,96,0.08) 38%, transparent 70%)',
        }}
      />

      <div className={cn('w-[9rem] sm:w-[11rem]', justLit && 'candle-kindle')}>
        <Candle lit={burning} />
      </div>

      <div aria-live="polite" className="mt-14 text-center">
        {status === null ? (
          <p className="label-caps text-ink-faint">{failed ? '' : '…'}</p>
        ) : (
          <>
            <p className="eyebrow">עד היום הודלקו לזכרו</p>
            <p className="mt-3 flex items-baseline justify-center gap-3">
              <span
                dir="ltr"
                className="font-display text-wine numerals text-5xl leading-none font-light sm:text-6xl"
              >
                {status.count.toLocaleString('he-IL')}
              </span>
              <span className="label-caps text-ink-soft">{status.count === 1 ? 'נר' : 'נרות'}</span>
            </p>
            <span aria-hidden="true" className="bg-wine-line/35 mx-auto mt-6 block h-px w-20" />
          </>
        )}

        {justLit && (
          <div className="mt-6">
            <p className="font-display text-ink text-xl">
              {lit?.displayName ? `${lit.displayName}, הנר הודלק לזכרו.` : 'נר נוסף הודלק לזכרו'}
            </p>
            {lit?.publishName && (
              <p className="text-ink-soft mt-2 text-[0.95rem]">שמך יוצג בין מדליקי הנרות.</p>
            )}
          </div>
        )}

        {!justLit && status?.hasLitRecently && (
          <p className="text-ink-soft mt-6 text-[0.95rem]">הנר שהדלקת דולק.</p>
        )}
      </div>

      {canLight && (
        <form
          className="mt-12 w-full max-w-[26rem]"
          onSubmit={(e) => {
            e.preventDefault()
            void light()
          }}
        >
          <div className="bg-stone/45 border-paper-edge focus-within:border-brass-line border px-6 py-6 transition-colors">
            <label htmlFor={nameId} className="eyebrow block">
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
              className="font-display placeholder:text-ink-faint/60 border-rule focus:border-brass mt-3 w-full border-0 border-b bg-transparent px-0 pb-2 text-xl leading-snug transition-colors outline-none"
            />
            <p id={helpId} className="label-caps text-ink-faint mt-3">
              אפשר להדליק נר גם ללא הזנת שם
            </p>

            <div className="border-rule-soft mt-6 border-t pt-5">
              <div className="flex items-start gap-3">
                <input
                  id={consentId}
                  name="publishName"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="accent-wine border-rule mt-0.5 h-4 w-4 shrink-0"
                />
                <label htmlFor={consentId} className="text-ink-soft text-[0.95rem] leading-snug">
                  אני מסכים ששמי יוצג באתר בין מדליקי הנרות
                </label>
              </div>

              {consentWithoutName && (
                <p className="label-caps text-wine mt-3 ps-7">יש להזין שם כדי שיוצג ברשימה</p>
              )}
            </div>
          </div>

          <p className="text-ink-faint mt-5 text-[0.85rem] leading-relaxed">
            אין צורך בהרשמה. ניתן להדליק נר ללא מסירת שם. אם תזין שם, הוא יוצג באתר רק אם תבחר בכך
            במפורש.
          </p>

          <Button
            type="submit"
            variant="memorial"
            disabled={busy}
            className={cn('mt-8 w-full justify-center px-8 py-4', busy && 'opacity-60')}
          >
            {busy ? 'מדליק…' : 'הדלקת נר לזכרו'}
          </Button>
        </form>
      )}

      {failed && (
        <p className="label-caps text-ink-faint mt-8 max-w-[28rem] text-center">
          לא ניתן להתחבר כרגע. נסה שוב מאוחר יותר.
        </p>
      )}
    </div>
  )
}
