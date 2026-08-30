'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MEMORIAL_LINK } from '@/lib/nav'
import { CandleGlyph } from './CandleGlyph'
import { cn } from '@/lib/utils/cn'

/**
 * The memorial plaque, at the trailing end of the header.
 *
 * The one element on the band that is not navigation, so it is not shaped like
 * navigation: a filled wine plaque with a brass edge and a drawn flame, hanging
 * below the header's line like a plate screwed to a wall. On its own page it
 * darkens and the flame brightens, which is the whole of its active state.
 *
 * On a narrow screen it keeps its colour and its flame but loses the second
 * line, so it stays the clear call to action without taking half the bar.
 */
export function MemorialPlaque() {
  const pathname = usePathname()
  const active = pathname === MEMORIAL_LINK.href

  return (
    <Link
      href={MEMORIAL_LINK.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group border-brass-line/60 relative flex items-center gap-2.5 border no-underline',
        'shadow-[0_6px_18px_-10px_rgba(0,0,0,0.8)] transition-all duration-300',
        'px-3 py-2.5 lg:h-[7.5rem] lg:w-[6.25rem] lg:flex-col lg:justify-center lg:gap-2 lg:px-0 lg:py-0',
        'hover:border-brass-soft hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-12px_rgba(0,0,0,0.9)]',
        active ? 'bg-wine-deep border-brass-soft' : 'bg-wine hover:bg-wine-deep',
      )}
    >
      {/* A brass hairline inset from the edge — the plate's own engraving. */}
      <span
        aria-hidden="true"
        className="border-brass-soft/25 pointer-events-none absolute inset-[3px] hidden border lg:block"
      />

      <CandleGlyph
        className={cn(
          'text-brass-soft h-5 w-3 shrink-0 transition-colors lg:h-8 lg:w-5',
          'group-hover:text-brass-faint',
        )}
      />

      <span className="text-paper label-caps leading-tight whitespace-nowrap lg:text-center">
        <span className="lg:block">נר</span> <span className="lg:mt-1 lg:block">זיכרון</span>
      </span>
    </Link>
  )
}
