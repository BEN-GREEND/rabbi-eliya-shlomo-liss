import type { ReactNode } from 'react'
import Link from 'next/link'
import { Glyph, type GlyphName } from './Glyph'
import { cn } from '@/lib/utils/cn'

/**
 * A section heading with a catalogue line.
 *
 * Never a bare line of text on an empty ground: a numbered plate, the mark for
 * what the section holds, a brass rule across the width, the heading at real
 * size, and a short accent beneath it in the section's own colour. This is
 * what makes a section read as a room in the museum rather than as another
 * paragraph.
 *
 * `tone="deep"` is the same heading standing on the petrol ground.
 */
export function SectionHeading({
  eyebrow,
  title,
  glyph,
  index,
  action,
  tone = 'light',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  glyph?: GlyphName
  /** Shown as a catalogue-style ordinal on its own plate. */
  index?: number
  action?: { href: string; label: string }
  /** `deep` for a heading standing on the petrol ground. */
  tone?: 'light' | 'deep'
  className?: string
  as?: 'h1' | 'h2'
}) {
  const deep = tone === 'deep'

  return (
    <header className={cn('relative', className)}>
      <div className="mb-5 flex items-center gap-4">
        {index !== undefined && (
          <span
            className={cn(
              'label-caps numerals flex h-7 w-7 shrink-0 items-center justify-center border',
              deep
                ? 'border-brass-line/60 text-brass-soft bg-paper/[0.06]'
                : 'border-brass-line/50 text-brass bg-brass/[0.06]',
            )}
          >
            {String(index).padStart(2, '0')}
          </span>
        )}
        {glyph && (
          <Glyph name={glyph} className={cn('h-5 w-5', deep ? 'text-brass-soft' : 'text-brass')} />
        )}
        <span
          aria-hidden="true"
          className={cn('h-px flex-1', deep ? 'bg-brass-line/45' : 'bg-brass-line/50')}
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          {eyebrow && <p className={cn('eyebrow mb-2', deep && 'text-brass-soft')}>{eyebrow}</p>}
          <Tag
            className={cn(
              'font-display text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]',
              deep && 'text-paper',
            )}
          >
            {title}
          </Tag>
          {/* A short accent under the title, in the section's own colour. */}
          <span
            aria-hidden="true"
            className={cn('mt-4 block h-[2px] w-14', deep ? 'bg-brass-soft' : 'bg-wine')}
          />
        </div>

        {action && (
          <Link
            href={action.href}
            className={cn(
              'group label-caps flex items-center gap-2 no-underline transition-colors',
              deep ? 'text-paper/75 hover:text-brass-soft' : 'text-ink-soft hover:text-wine',
            )}
          >
            <span className="underline-grow">{action.label}</span>
            <Glyph name="arrow" className="arrow-slide group-hover:arrow-slide-hover h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </header>
  )
}
