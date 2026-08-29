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
 * Two rules rather than one — a hairline and a brass thread beneath it — so
 * the bar reads as the edge of a case rather than a border. The name sits in
 * display type with its years beside it; search and the memorial are pulled
 * out of the navigation and given their own marks, because they are actions
 * and not sections.
 */
export function Header() {
  const site = getSite()

  return (
    <header className="bg-paper/90 sticky top-0 z-40 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center gap-6 px-6 sm:px-10 lg:h-[4.75rem] lg:px-16">
        <Link href="/" className="group flex items-baseline gap-3 no-underline">
          <span className="font-display group-hover:text-wine text-[1.0625rem] leading-none tracking-tight transition-colors lg:text-lg">
            {site.name}
          </span>
          <span
            dir="ltr"
            aria-hidden="true"
            className="label-caps numerals text-ink-faint hidden lg:inline"
          >
            1901–1963
          </span>
        </Link>

        <nav aria-label="ניווט ראשי" className="ms-auto hidden lg:block">
          <NavLinks />
        </nav>

        <div className="border-rule ms-6 hidden items-center gap-1 border-s ps-6 lg:flex">
          <Link
            href={SEARCH_LINK.href}
            className="text-ink-soft hover:text-ink flex items-center gap-2 px-2 py-2 text-[0.95rem] no-underline transition-colors"
          >
            <Glyph name="search" className="h-4 w-4" />
            {SEARCH_LINK.label}
          </Link>

          <Link
            href={MEMORIAL_LINK.href}
            className="text-wine hover:bg-wine hover:text-paper border-wine-line/40 hover:border-wine ms-1 flex items-center gap-2 border px-3 py-2 text-[0.95rem] no-underline transition-colors duration-200"
          >
            <CandleGlyph className="h-4 w-2.5" />
            {MEMORIAL_LINK.label}
          </Link>
        </div>

        <div className="ms-auto lg:hidden">
          <MobileMenu />
        </div>
      </div>

      {/* Two rules: a hairline, then a brass thread. The edge of the case. */}
      <div className="border-rule border-b" />
      <div className="via-brass-line/45 h-px bg-gradient-to-l from-transparent to-transparent" />
    </header>
  )
}
