import Image from 'next/image'
import Link from 'next/link'
import { getSite } from '@/lib/site'
import { assetExists } from '@/lib/assets'
import { SEARCH_LINK } from '@/lib/nav'
import { Glyph } from '@/components/primitives/Glyph'
import { MemorialPlaque } from './MemorialPlaque'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

const HEADER_PORTRAIT = '/images/people/rabbi-eliya-shlomo-liss/portrait-header-framed.jpg'

/**
 * The header.
 *
 * Two anchors hold the band, one at each end, with the navigation drawn tight
 * between them.
 *
 * At the leading edge, an identity plate: the framed portrait hanging from the
 * lintel, the name in ivory beneath the frame's own gilt, the years in brass.
 * At the trailing edge, the memorial plaque in wine. Both hang a little below
 * the band's brass line, so the header has depth and the page beneath it
 * begins under something rather than after it.
 *
 * The portrait carries its own gold frame, so nothing is added around it — a
 * CSS border on top of a framed print reads as two frames. Only a shadow, to
 * lift it off the petrol.
 */
export function Header() {
  const site = getSite()
  const hasPortrait = assetExists(HEADER_PORTRAIT)

  return (
    <header className="bg-navy/95 sticky top-0 z-40 backdrop-blur-sm">
      <div className="relative z-10 mx-auto flex h-[4.75rem] w-full max-w-[86rem] items-stretch gap-4 px-6 sm:px-10 lg:h-[6.5rem] lg:px-16">
        {/* ---- identity ----
            The plate hangs from the lintel: it starts 8px below the top of the
            band and finishes 24px below its brass line. The link stretches to
            the band's full height so that offset is measured from the band and
            not from the link's own content. */}
        <Link href="/" className="group flex items-start gap-3.5 no-underline lg:gap-5">
          {hasPortrait && (
            <span className="mt-1.5 block w-11 shrink-0 lg:mt-2 lg:w-24">
              <Image
                src={HEADER_PORTRAIT}
                alt=""
                width={1122}
                height={1402}
                priority
                sizes="(min-width: 1024px) 96px, 44px"
                className="block h-auto w-full shadow-[0_6px_18px_-8px_rgba(0,0,0,0.75)] transition-shadow duration-300 group-hover:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.9)]"
              />
            </span>
          )}

          <span className="hidden flex-col self-center sm:flex">
            <span className="font-display text-paper group-hover:text-brass-soft text-[1.0625rem] leading-tight tracking-tight transition-colors lg:text-[1.375rem]">
              {site.name}
            </span>
            <span className="mt-1.5 hidden items-center gap-2.5 sm:flex">
              <span aria-hidden="true" className="bg-brass-line/70 h-px w-5" />
              <span dir="ltr" className="label-caps numerals text-brass-soft">
                1901–1963
              </span>
            </span>
          </span>
        </Link>

        {/* ---- navigation, drawn tight in the middle ---- */}
        <nav aria-label="ניווט ראשי" className="mx-auto hidden items-center lg:flex">
          <NavLinks />
        </nav>

        {/* ---- the two actions, as one group at the trailing end ---- */}
        <div className="ms-auto flex items-stretch gap-2 lg:ms-0 lg:gap-3">
          <Link
            href={SEARCH_LINK.href}
            className="text-paper/75 hover:text-brass-soft hover:bg-paper/[0.07] hidden items-center gap-2 self-center px-3 py-2 text-[0.95rem] no-underline transition-colors duration-200 lg:flex"
          >
            <Glyph name="search" className="h-4 w-4" />
            {SEARCH_LINK.label}
          </Link>

          <div className="flex items-start lg:mt-2">
            <MemorialPlaque />
          </div>

          <div className="flex items-center lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* The brass thread where the band meets the page. */}
      <div className="via-brass-line to-brass-line/25 h-px bg-gradient-to-l from-transparent" />
      {/* And a short fall of shadow beneath it, so the page starts under the band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-[rgba(13,30,38,0.16)] to-transparent"
      />
    </header>
  )
}
