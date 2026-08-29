import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * The museum wall label — the design atom of this site.
 *
 * Every exhibit uses it: photograph, document, timeline event, teaching,
 * person. A hairline on the leading edge, a catalogue number, then the
 * facts in small tracked caps. One component, so the whole archive reads
 * as a single system and nothing is styled twice.
 */
export function ExhibitLabel({
  catalog,
  title,
  meta = [],
  credit,
  children,
  as: Tag = 'div',
  titleAs: Title = 'h3',
  tone = 'light',
  className,
}: {
  catalog?: string
  title: ReactNode
  /** Short facts: date, place, category. Empty entries are dropped. */
  meta?: Array<string | null | undefined>
  credit?: string
  children?: ReactNode
  as?: 'div' | 'figcaption' | 'header'
  /** The heading level of the title. h3 by default; h2 in a list under an h1. */
  titleAs?: 'h2' | 'h3'
  tone?: 'light' | 'deep'
  className?: string
}) {
  const facts = meta.filter((m): m is string => Boolean(m))
  const deep = tone === 'deep'

  return (
    <Tag
      className={cn('border-s ps-4 sm:ps-5', deep ? 'border-brass/40' : 'border-rule', className)}
    >
      {catalog && (
        <p
          className={cn(
            'label-caps numerals mb-2 tracking-[var(--tracking-wide-label)]',
            deep ? 'text-brass-soft' : 'text-brass',
          )}
        >
          מוצג {catalog}
        </p>
      )}

      <Title
        className={cn(
          'font-display text-xl leading-snug sm:text-2xl',
          deep ? 'text-paper' : 'text-ink',
        )}
      >
        {title}
      </Title>

      {facts.length > 0 && (
        <p className={cn('label-caps mt-2.5', deep && 'text-paper/70')}>
          {facts.map((fact, i) => (
            <span key={i}>
              {i > 0 && (
                <span aria-hidden="true" className="text-brass/60 mx-2">
                  ·
                </span>
              )}
              {fact}
            </span>
          ))}
        </p>
      )}

      {children && (
        <div
          className={cn(
            'mt-3 text-[0.95rem] leading-relaxed',
            deep ? 'text-paper/75' : 'text-ink-soft',
          )}
        >
          {children}
        </div>
      )}

      {credit && (
        <p
          className={cn(
            'label-caps mt-3 text-[0.625rem]',
            deep ? 'text-paper/60' : 'text-ink-faint',
          )}
        >
          מקור: {credit}
        </p>
      )}
    </Tag>
  )
}
