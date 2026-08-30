import type { ReactNode } from 'react'
import Link from 'next/link'
import { Glyph } from './Glyph'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'onDeep' | 'memorial' | 'memorialDeep'

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  onDeep: 'btn-on-deep',
  memorial: 'btn-memorial',
  memorialDeep: 'btn-memorial-deep',
}

/**
 * The site's calls to action.
 *
 * Four weights, so it is always clear what is clickable and how much it
 * matters: petrol for the primary action, an outline for the secondary, the
 * same outline in brass for a dark ground, and wine for the memorial. The
 * arrow is flipped for RTL, where forward is to the left, and slides on
 * approach.
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
    <Link href={href} className={cn('group btn-base', VARIANTS[variant], className)}>
      {children}
      {arrow && (
        <Glyph
          name="arrow"
          className="arrow-slide group-hover:arrow-slide-hover h-4 w-4 rotate-180"
        />
      )}
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
