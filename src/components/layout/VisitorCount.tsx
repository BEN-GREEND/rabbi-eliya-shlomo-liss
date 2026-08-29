'use client'

import { useEffect, useState } from 'react'

/**
 * The visitor count, in the footer.
 *
 * One request on load: it registers this browser if it has not been here
 * before and returns the total. Registering is idempotent, so a reload or a
 * second tab changes nothing. This component lives in the root layout, so
 * moving between pages does not re-run it.
 *
 * The number is a count of anonymous browsers, not of people — clearing
 * cookies makes a new one. That is an acceptable approximation for a line in
 * a footer, and the wording does not claim otherwise.
 */
export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/visitors', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('unavailable'))))
      .then((d: { count: number }) => {
        if (!cancelled) setCount(d.count)
      })
      .catch(() => {
        // Nothing is shown if it fails. A footer line is not worth an error.
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (count === null) return null

  return (
    <span className="label-caps text-paper/55">
      <span dir="ltr" className="numerals inline-block">
        {count.toLocaleString('he-IL')}
      </span>{' '}
      {count === 1 ? 'מבקר באתר' : 'מבקרים באתר'}
    </span>
  )
}
