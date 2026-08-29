'use client'

import { useCallback, useEffect, useState } from 'react'
import { Candle } from './Candle'
import { Button } from '@/components/primitives/Button'
import { cn } from '@/lib/utils/cn'

interface Status {
  count: number
  hasLitRecently: boolean
  nextAllowedAt: string | null
}

/**
 * The memorial candle.
 *
 * The count is read once on mount, so the page itself stays static. Lighting
 * posts once and takes the new count from the reply — there is no polling and
 * no second source of truth.
 *
 * A visitor who has already lit one inside the cooldown window sees their
 * candle burning and the button gone. That is the honest state: their candle
 * is lit. It is not framed as a refusal.
 */
export function MemorialCandle() {
  const [status, setStatus] = useState<Status | null>(null)
  const [busy, setBusy] = useState(false)
  const [justLit, setJustLit] = useState(false)
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
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error('unavailable')
      const next = (await res.json()) as Status & { accepted: boolean }
      setStatus(next)
      if (next.accepted) setJustLit(true)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }, [])

  const lit = Boolean(status?.hasLitRecently) || justLit
  const canLight = status !== null && !status.hasLitRecently && !justLit

  return (
    <div className="relative flex flex-col items-center">
      {/* The light in the room. It sits behind the candle and brightens once a
          flame is burning, so the page itself responds to the act. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-4rem] left-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 transition-opacity duration-[1400ms]"
        style={{
          opacity: lit ? 1 : 0.45,
          background:
            'radial-gradient(circle at center, rgba(226,182,96,0.22) 0%, rgba(226,182,96,0.08) 38%, transparent 70%)',
        }}
      />

      <div className={cn('w-[9rem] sm:w-[11rem]', justLit && 'candle-kindle')}>
        <Candle lit={lit} />
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

        {justLit && <p className="font-display text-ink mt-6 text-xl">נר נוסף הודלק לזכרו</p>}

        {!justLit && status?.hasLitRecently && (
          <p className="text-ink-soft mt-6 text-[0.95rem]">הנר שהדלקת דולק.</p>
        )}
      </div>

      {canLight && (
        <Button
          type="button"
          variant="memorial"
          onClick={light}
          disabled={busy}
          className={cn('mt-10 px-8 py-4', busy && 'opacity-60')}
        >
          {busy ? 'מדליק…' : 'הדלקת נר לזכרו'}
        </Button>
      )}

      {failed && (
        <p className="label-caps text-ink-faint mt-8 max-w-[28rem] text-center">
          לא ניתן להתחבר כרגע. נסה שוב מאוחר יותר.
        </p>
      )}
    </div>
  )
}
