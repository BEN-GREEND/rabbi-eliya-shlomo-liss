'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRIMARY_NAV } from '@/lib/nav'
import { cn } from '@/lib/utils/cn'

/** Desktop navigation. The current section keeps a brass underline. */
export function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
      {PRIMARY_NAV.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative py-1 text-[0.95rem] no-underline transition-colors',
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right',
                'after:bg-brass after:transition-transform after:duration-300',
                active
                  ? 'text-ink after:scale-x-100'
                  : 'text-ink-soft hover:text-ink after:scale-x-0 hover:after:scale-x-100',
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
