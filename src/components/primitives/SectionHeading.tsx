import type { ReactNode } from 'react'
import Link from 'next/link'
import { Glyph, type GlyphName } from './Glyph'
import { cn } from '@/lib/utils/cn'

/**
 * A section heading with an anchor.
 *
 * Never a bare line of text: a numbered brass rule, a mark for what the
 * section holds, a wine eyebrow, and the heading itself at real size. This is
 * what makes a section read as a room in the museum rather than as another
 * paragraph.
 */
export function SectionHeading({
  eyebrow,
  title,
  glyph,
  index,
  action,
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  glyph?: GlyphName
  /** Shown as a catalogue-style ordinal beside the rule. */
  index?: number
  action?: { href: string; label: string }
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <header className={cn('relative', className)}>
      <div className="mb-5 flex items-center gap-4">
        {index !== undefined && (
          <span className="label-caps numerals text-brass">{String(index).padStart(2, '0')}</span>
        )}
        {glyph && <Glyph name={glyph} className="text-brass h-4 w-4" />}
        <span aria-hidden="true" className="bg-brass-line/50 h-px flex-1" />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <Tag className="font-display text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            {title}
          </Tag>
        </div>

        {action && (
          <Link
            href={action.href}
            className="label-caps text-ink-soft hover:text-wine underline-grow no-underline transition-colors"
          >
            {action.label}
          </Link>
        )}
      </div>
    </header>
  )
}
