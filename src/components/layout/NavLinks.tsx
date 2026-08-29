'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRIMARY_NAV } from '@/lib/nav'
import { cn } from '@/lib/utils/cn'

/**
 * Desktop navigation.
 *
 * The current section is stated three ways at once — wine text, a wine rule
 * beneath it, and a faint warm ground — so where you are is never in doubt.
 * Hovering draws the same rule in brass from the leading edge, which is the
 * one underline gesture the site uses everywhere.
 */
export function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="hidden items-center gap-0.5 lg:flex">
      {PRIMARY_NAV.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative block px-3 py-2 text-[0.95rem] no-underline transition-colors duration-200',
                'after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-right',
                'after:transition-transform after:duration-300',
                active
                  ? 'text-wine bg-wine/[0.055] after:bg-wine after:scale-x-100'
                  : 'text-ink-soft hover:text-ink after:bg-brass after:scale-x-0 hover:after:scale-x-100',
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
