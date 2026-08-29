import type { ReactNode } from 'react'
import Link from 'next/link'
import { Container } from '@/components/primitives/Container'
import { Glyph, type GlyphName } from '@/components/primitives/Glyph'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { cn } from '@/lib/utils/cn'

/**
 * A section of the home page, in one of two states.
 *
 * With content it opens fully, on whichever ground it was given — sections
 * alternate between paper and a warmer stone so the page has bands rather than
 * one continuous sheet.
 *
 * Without content it collapses to a single row: mark, number, title, and a
 * quiet "בהכנה". Consecutive rows stack into what reads as a contents page for
 * an exhibition still being installed. Each opens on its own as its content
 * arrives.
 */
export function HomeSection({
  index,
  title,
  href,
  linkLabel = 'לכל הפריטים',
  eyebrow,
  glyph,
  empty = false,
  ground = 'paper',
  children,
}: {
  index: number
  title: string
  href: string
  linkLabel?: string
  eyebrow?: string
  glyph?: GlyphName
  empty?: boolean
  ground?: 'paper' | 'stone'
  children?: ReactNode
}) {
  if (empty) {
    return (
      <section className="border-rule border-t">
        <Container width="wide">
          <Link
            href={href}
            className="group hover:bg-paper-deep/50 -mx-4 flex items-center gap-5 px-4 py-6 no-underline transition-colors sm:gap-7"
          >
            {glyph && (
              <Glyph
                name={glyph}
                className="text-brass-line/50 group-hover:text-brass h-5 w-5 transition-colors"
              />
            )}
            <span className="label-caps numerals text-brass w-6 shrink-0">
              {String(index).padStart(2, '0')}
            </span>
            <h2 className="font-display group-hover:text-wine text-xl font-normal transition-colors sm:text-2xl">
              {title}
            </h2>
            <span aria-hidden="true" className="bg-rule mx-1 hidden h-px flex-1 sm:block" />
            <span className="label-caps text-ink-faint ms-auto shrink-0 sm:ms-0">בהכנה</span>
          </Link>
        </Container>
      </section>
    )
  }

  return (
    <section className={cn('border-rule border-t', ground === 'stone' && 'bg-paper-deep/55')}>
      <Container width="wide" className="py-16 lg:py-24">
        <SectionHeading
          index={index}
          eyebrow={eyebrow}
          title={title}
          glyph={glyph}
          action={{ href, label: linkLabel }}
          className="mb-12"
        />
        {children}
      </Container>
    </section>
  )
}
