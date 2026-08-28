import Link from 'next/link'
import { getSite } from '@/lib/site'
import { MEMORIAL_LINK } from '@/lib/nav'
import { CandleGlyph } from './CandleGlyph'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

export function Header() {
  const site = getSite()

  return (
    <header className="border-rule bg-paper/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center gap-6 px-6 sm:px-10 lg:h-[4.5rem] lg:px-16">
        <Link
          href="/"
          className="font-display text-[1.0625rem] leading-none tracking-tight no-underline lg:text-lg"
        >
          {site.name}
        </Link>

        <nav aria-label="ניווט ראשי" className="ms-auto hidden lg:block">
          <NavLinks />
        </nav>

        <Link
          href={MEMORIAL_LINK.href}
          className="border-rule text-ink-soft hover:text-brass ms-auto hidden items-center gap-2 border-s ps-6 text-[0.95rem] no-underline transition-colors lg:ms-0 lg:flex"
        >
          <CandleGlyph className="text-brass h-4 w-2.5" />
          {MEMORIAL_LINK.label}
        </Link>

        <div className="ms-auto lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
