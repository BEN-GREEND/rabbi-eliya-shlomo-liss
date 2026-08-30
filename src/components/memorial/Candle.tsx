import { cn } from '@/lib/utils/cn'

/**
 * The candle.
 *
 * Drawn for this site — not an emoji and not an icon from a set. A glass cup
 * with a faint highlight, wax inside it, a wick, and a flame built from two
 * stacked shapes: an outer body in dulled brass and a pale inner core.
 *
 * The flame moves on two loops of different, deliberately non-matching lengths
 * (2.7s and 3.4s), so the motion never settles into a visible repeat. The glow
 * breathes on a third. All of it is CSS on transforms and opacity only.
 *
 * Unlit, the flame and glow are simply absent — the wax is grey, and the whole
 * thing reads as waiting rather than broken.
 *
 * Under prefers-reduced-motion every loop stops and the flame holds still. The
 * global reduced-motion rule already forces this; the keyframes here are
 * written so the resting frame is the correct one.
 */
export function Candle({ lit, className }: { lit: boolean; className?: string }) {
  return (
    // Unlit, the whole object sits back a little. It is not dimmed to hide a
    // flaw — a waiting candle in a dim room simply catches less light, and it
    // makes the lighting an event rather than a colour change.
    <div
      className={cn('relative transition-opacity duration-[1400ms]', className)}
      style={{ opacity: lit ? 1 : 0.72 }}
    >
      {/* Glow, behind the glass. */}
      {lit && (
        <div
          aria-hidden="true"
          className="candle-glow pointer-events-none absolute top-[6%] h-[46%] w-[150%] rounded-full"
        />
      )}

      <svg
        viewBox="0 0 80 150"
        role="img"
        aria-label={lit ? 'נר דולק' : 'נר שאינו דולק'}
        className="relative h-full w-full"
      >
        <defs>
          <linearGradient id="candle-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-paper-edge)" stopOpacity="0.55" />
            <stop offset="28%" stopColor="var(--color-paper)" stopOpacity="0.9" />
            <stop offset="70%" stopColor="var(--color-paper-edge)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-rule)" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="candle-wax" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={lit ? '#efe4cd' : 'var(--color-paper-edge)'} />
            <stop offset="45%" stopColor={lit ? '#f6efe0' : 'var(--color-paper-deep)'} />
            <stop offset="100%" stopColor={lit ? '#e2d2b4' : 'var(--color-rule)'} />
          </linearGradient>
          <radialGradient id="candle-flame-core" cx="50%" cy="62%" r="60%">
            <stop offset="0%" stopColor="#fff6e2" />
            <stop offset="100%" stopColor="#f2cf86" />
          </radialGradient>
        </defs>

        {/* Glass cup */}
        <path
          d="M20 56 h40 a3 3 0 0 1 3 3 v78 a6 6 0 0 1-6 6 H23 a6 6 0 0 1-6-6 V59 a3 3 0 0 1 3-3 z"
          fill="url(#candle-glass)"
          stroke="var(--color-rule)"
          strokeWidth="1"
        />
        {/* One highlight down the glass — not a shine, just a reading of the surface. */}
        <path d="M25 64 v70" stroke="var(--color-paper)" strokeWidth="2.5" opacity="0.7" />

        {/* Wax */}
        <path
          d="M22 70 h36 v66 a4 4 0 0 1-4 4 H26 a4 4 0 0 1-4-4 z"
          fill="url(#candle-wax)"
          opacity="0.95"
        />
        {/* The dip the wick sits in */}
        <ellipse cx="40" cy="70" rx="18" ry="3.4" fill="var(--color-rule)" opacity="0.45" />

        {/* Wick */}
        <path
          d="M40 70 v-7"
          stroke={lit ? '#4a3a20' : 'var(--color-ink-faint)'}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {lit && (
          <g className="candle-flame" style={{ transformOrigin: '40px 63px' }}>
            {/* Outer body */}
            <path
              d="M40 24c9.5 12.4 14 20.5 14 28.4A14 14 0 0 1 26 52.4C26 44.5 30.5 36.4 40 24z"
              fill="var(--color-brass-line)"
              opacity="0.5"
            />
            {/* Core */}
            <path
              className="candle-flame-core"
              style={{ transformOrigin: '40px 60px' }}
              d="M40 38c4.6 6.4 7 10.6 7 14.6a7 7 0 1 1-14 0c0-4 2.4-8.2 7-14.6z"
              fill="url(#candle-flame-core)"
            />
          </g>
        )}
      </svg>
    </div>
  )
}
