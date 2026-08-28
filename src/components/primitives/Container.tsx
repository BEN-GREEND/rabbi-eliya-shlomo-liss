import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/** Page gutter. `narrow` is the reading measure for long-form Hebrew text. */
export function Container({
  children,
  width = 'default',
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  width?: 'narrow' | 'default' | 'wide'
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'article'
}) {
  const widths = {
    narrow: 'max-w-[38rem]',
    default: 'max-w-[72rem]',
    wide: 'max-w-[86rem]',
  }
  return (
    <Tag className={cn('mx-auto w-full px-6 sm:px-10 lg:px-16', widths[width], className)}>
      {children}
    </Tag>
  )
}
