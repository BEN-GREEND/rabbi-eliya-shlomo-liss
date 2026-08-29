import type { ReactNode } from 'react'
import Link from 'next/link'
import { Glyph } from './Glyph'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'memorial'

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  memorial: 'btn-memorial',
}

/**
 * The site's calls to action.
 *
 * Three weights, so it is always clear what is clickable and how much it
 * matters. The arrow is flipped for RTL, where forward is to the left.
 */
export function ButtonLink({
  href,
  variant = 'secondary',
  arrow = false,
  className,
  children,
}: {
  href: string
  variant?: Variant
  arrow?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={cn('btn-base', VARIANTS[variant], className)}>
      {children}
      {arrow && <Glyph name="arrow" className="h-4 w-4 rotate-180" />}
    </Link>
  )
}

export function Button({
  variant = 'secondary',
  className,
  children,
  ...props
}: {
  variant?: Variant
  className?: string
  children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn('btn-base', VARIANTS[variant], className)} {...props}>
      {children}
    </button>
  )
}
