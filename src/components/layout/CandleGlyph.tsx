/**
 * The small candle mark used beside the memorial link.
 * Drawn, not an emoji or an icon-font glyph — the memorial is the one place
 * on this site that must not look borrowed.
 */
export function CandleGlyph({ className, lit = true }: { className?: string; lit?: boolean }) {
  return (
    <svg viewBox="0 0 12 20" className={className} aria-hidden="true" fill="none">
      {lit && (
        <path
          d="M6 1.4c1.5 1.9 2.4 3.2 2.4 4.5A2.4 2.4 0 0 1 6 8.3a2.4 2.4 0 0 1-2.4-2.4c0-1.3.9-2.6 2.4-4.5Z"
          fill="currentColor"
          opacity="0.85"
        />
      )}
      <rect x="4.1" y="8.8" width="3.8" height="9.6" rx="0.6" fill="currentColor" opacity="0.35" />
    </svg>
  )
}
