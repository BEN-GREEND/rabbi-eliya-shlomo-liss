'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRIMARY_NAV } from '@/lib/nav'
import { cn } from '@/lib/utils/cn'

/**
 * Desktop navigation, on the petrol band.
 *
 * The current section is stated three ways at once — a brass label, a brass
 * rule beneath it, and a lit field behind it — so where you are is never in
 * doubt. Hovering lights the field and draws the same rule from the leading
 * edge, which is the one underline gesture the site uses everywhere.
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
                'relative block px-3.5 py-2.5 text-[0.95rem] no-underline transition-colors duration-200',
                'after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-right',
                'after:transition-transform after:duration-300',
                active
                  ? 'text-brass-soft bg-paper/[0.09] after:bg-brass-soft after:scale-x-100'
                  : 'text-paper/72 hover:text-paper hover:bg-paper/[0.06] after:bg-brass-line after:scale-x-0 hover:after:scale-x-100',
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
