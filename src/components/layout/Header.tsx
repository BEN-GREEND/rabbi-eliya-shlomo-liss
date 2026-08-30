import Link from 'next/link'
import { getSite } from '@/lib/site'
import { MEMORIAL_LINK, SEARCH_LINK } from '@/lib/nav'
import { Glyph } from '@/components/primitives/Glyph'
import { CandleGlyph } from './CandleGlyph'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

/**
 * The header.
 *
 * A petrol band, not a line of text on paper: the name in ivory display type
 * with its years beside it in brass, the navigation light against the dark,
 * and a brass thread along the bottom edge where the band meets the page. It
 * is the lintel of the building, and the first thing that says this is not an
 * ordinary site.
 *
 * Search and the memorial are pulled out of the navigation and given their own
 * marks, because they are actions and not sections — and the memorial is given
 * a wine field of its own, because it is the one action that is not browsing.
 */
export function Header() {
  const site = getSite()

  return (
    <header className="bg-navy/95 sticky top-0 z-40 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center gap-6 px-6 sm:px-10 lg:h-[5.25rem] lg:px-16">
        <Link href="/" className="group flex items-baseline gap-3 no-underline">
          <span className="font-display text-paper group-hover:text-brass-soft text-[1.0625rem] leading-none tracking-tight transition-colors lg:text-xl">
            {site.name}
          </span>
          <span
            dir="ltr"
            aria-hidden="true"
            className="label-caps numerals text-brass-soft hidden lg:inline"
          >
            1901–1963
          </span>
        </Link>

        <nav aria-label="ניווט ראשי" className="ms-auto hidden lg:block">
          <NavLinks />
        </nav>

        <div className="border-rule-navy ms-5 hidden items-center gap-2 border-s ps-5 lg:flex">
          <Link
            href={SEARCH_LINK.href}
            className="text-paper/75 hover:text-paper hover:bg-paper/[0.08] flex items-center gap-2 px-3 py-2.5 text-[0.95rem] no-underline transition-colors duration-200"
          >
            <Glyph name="search" className="h-4 w-4" />
            {SEARCH_LINK.label}
          </Link>

          {/* The memorial: its own field, in wine, so it never reads as one
              more section in the list. */}
          <Link
            href={MEMORIAL_LINK.href}
            className="text-paper border-wine-line/70 bg-wine/45 hover:bg-wine hover:border-wine flex items-center gap-2.5 border px-4 py-2.5 text-[0.95rem] no-underline transition-colors duration-200"
          >
            <CandleGlyph className="text-brass-soft h-4 w-2.5" />
            {MEMORIAL_LINK.label}
          </Link>
        </div>

        <div className="ms-auto lg:hidden">
          <MobileMenu />
        </div>
      </div>

      {/* The brass thread where the band meets the page. */}
      <div className="via-brass-line to-brass-line/25 h-px bg-gradient-to-l from-transparent" />
    </header>
  )
}
