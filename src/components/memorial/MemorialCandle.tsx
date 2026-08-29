'use client'

import { useCallback, useEffect, useState } from 'react'
import { Candle } from './Candle'
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
    <div className="flex flex-col items-center">
      <div className={cn('w-[7.5rem] sm:w-[9rem]', justLit && 'candle-kindle')}>
        <Candle lit={lit} />
      </div>

      <div aria-live="polite" className="mt-12 text-center">
        {status === null ? (
          <p className="label-caps text-ink-faint">{failed ? '' : '…'}</p>
        ) : (
          <p className="label-caps text-ink-soft">
            עד היום הודלקו לזכרו{' '}
            <span dir="ltr" className="numerals text-brass inline-block font-semibold">
              {status.count.toLocaleString('he-IL')}
            </span>{' '}
            {status.count === 1 ? 'נר' : 'נרות'}
          </p>
        )}

        {justLit && <p className="font-display text-ink mt-6 text-xl">נר נוסף הודלק לזכרו</p>}

        {!justLit && status?.hasLitRecently && (
          <p className="text-ink-soft mt-6 text-[0.95rem]">הנר שהדלקת דולק.</p>
        )}
      </div>

      {canLight && (
        <button
          type="button"
          onClick={light}
          disabled={busy}
          className={cn(
            'label-caps border-brass mt-10 border px-6 py-3 transition-colors',
            'hover:bg-brass/10 focus-visible:bg-brass/10',
            busy && 'opacity-60',
          )}
        >
          {busy ? 'מדליק…' : 'הדלקת נר לזכרו'}
        </button>
      )}

      {failed && (
        <p className="label-caps text-ink-faint mt-8 max-w-[28rem] text-center">
          לא ניתן להתחבר כרגע. נסה שוב מאוחר יותר.
        </p>
      )}
    </div>
  )
}
