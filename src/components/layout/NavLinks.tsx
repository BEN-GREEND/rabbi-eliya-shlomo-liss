'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRIMARY_NAV } from '@/lib/nav'
import { cn } from '@/lib/utils/cn'

/**
 * Desktop navigation, drawn tight between the header's two anchors.
 *
 * No boxes: each item is a word with a rule under it. The current section
 * takes brass type and a solid brass rule; hovering draws the same rule from
 * the leading edge and lifts the type to ivory. One gesture, two weights, so
 * the row reads as a single run of text rather than a strip of buttons.
 */
export function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="hidden items-center lg:flex">
      {PRIMARY_NAV.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative block px-2.5 py-1.5 text-[0.9375rem] whitespace-nowrap no-underline',
                'transition-colors duration-200 xl:px-3',
                'after:absolute after:inset-x-2.5 after:-bottom-1 after:h-[2px] after:origin-right',
                'after:transition-transform after:duration-300 xl:after:inset-x-3',
                active
                  ? 'text-brass-soft after:bg-brass-soft after:scale-x-100'
                  : 'text-paper/70 hover:text-paper after:bg-brass-line after:scale-x-0 hover:after:scale-x-100',
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
