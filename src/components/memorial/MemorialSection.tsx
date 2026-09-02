'use client'

import { useCallback, useState } from 'react'
import { MemorialCandle } from './MemorialCandle'
import type { PortraitPlate } from './MemorialPortrait'
import { Lighters } from './Lighters'

/**
 * The memorial room.
 *
 * Before a flame, the room is dim: deep petrol, a candle waiting, almost no
 * light. When the server confirms a candle is burning the room warms — a wide
 * amber wash rises behind the composition and the petrol itself lifts a shade
 * — over about a second and a half. It is the same idea as the glow behind the
 * candle, widened to the whole space, rather than a second effects system.
 *
 * Under prefers-reduced-motion the site's global rule collapses every
 * transition to nothing, so the warm state simply appears. The room is still
 * correct; it just does not travel.
 *
 * The two children share a parent for two small reasons only: the light, and
 * the fact that publishing a name should put it in the list below without a
 * reload.
 */
export function MemorialSection({
  memorialTitle,
  siteName,
  portrait,
}: {
  memorialTitle: string
  siteName: string
  portrait: PortraitPlate | null
}) {
  const [reloadKey, setReloadKey] = useState(0)
  const [burning, setBurning] = useState(false)

  const onPublished = useCallback(() => setReloadKey((n) => n + 1), [])
  const onBurningChange = useCallback((next: boolean) => setBurning(next), [])

  return (
    <div className="relative isolate">
      {/* The room's own light, behind everything in it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-20vw] -top-24 -bottom-24 -z-10 transition-opacity duration-[1500ms]"
        style={{
          opacity: burning ? 1 : 0,
          background:
            'radial-gradient(ellipse 60% 55% at 72% 34%, rgba(226,182,96,0.13) 0%, rgba(226,182,96,0.05) 45%, transparent 72%)',
        }}
      />
      {/* And a half-shade lifted off the petrol itself. */}
      <div
        aria-hidden="true"
        className="bg-navy-soft/35 pointer-events-none absolute inset-x-[-20vw] -top-32 -bottom-32 -z-20 transition-opacity duration-[1500ms]"
        style={{ opacity: burning ? 1 : 0 }}
      />

      <MemorialCandle
        memorialTitle={memorialTitle}
        siteName={siteName}
        portrait={portrait}
        onPublished={onPublished}
        onBurningChange={onBurningChange}
      />
      <Lighters reloadKey={reloadKey} />
    </div>
  )
}
