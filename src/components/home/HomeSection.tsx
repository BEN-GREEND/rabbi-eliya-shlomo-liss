import type { ReactNode } from 'react'
import Link from 'next/link'
import { Container } from '@/components/primitives/Container'
import { cn } from '@/lib/utils/cn'

/**
 * A section of the home page, in one of two states.
 *
 * When the section has content it opens fully. When it does not, it collapses
 * to a single hairline row: number, title, "בהכנה". Consecutive empty rows
 * stack into what reads as an exhibition contents page — an honest statement
 * that the hall is being installed, rather than an apology or a grid of
 * invented filler. Each section opens on its own as its content arrives.
 */
export function HomeSection({
  index,
  title,
  href,
  linkLabel = 'לכל הפריטים',
  eyebrow,
  empty = false,
  children,
}: {
  index: number
  title: string
  href: string
  linkLabel?: string
  eyebrow?: string
  empty?: boolean
  children?: ReactNode
}) {
  const number = String(index).padStart(2, '0')

  if (empty) {
    return (
      <section className="border-rule border-t">
        <Container width="wide">
          <Link href={href} className="group flex items-baseline gap-5 py-6 no-underline sm:gap-8">
            <span className="label-caps numerals text-brass w-6 shrink-0">{number}</span>
            <h2 className="font-display group-hover:text-brass text-xl font-normal transition-colors sm:text-2xl">
              {title}
            </h2>
            <span
              aria-hidden="true"
              className="bg-rule mx-1 hidden h-px flex-1 self-center sm:block"
            />
            <span className="label-caps text-ink-faint ms-auto shrink-0 sm:ms-0">בהכנה</span>
          </Link>
        </Container>
      </section>
    )
  }

  return (
    <section className="border-rule border-t">
      <Container width="wide" className="py-16 lg:py-24">
        <header className="mb-12 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <span className="label-caps numerals text-brass w-6 shrink-0">{number}</span>
          <div>
            {eyebrow && <p className="label-caps text-ink-faint mb-1.5">{eyebrow}</p>}
            <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
          </div>
          <Link
            href={href}
            className={cn(
              'label-caps border-brass/40 ms-auto border-b pb-1 no-underline',
              'hover:border-brass hover:text-brass transition-colors',
            )}
          >
            {linkLabel}
          </Link>
        </header>
        {children}
      </Container>
    </section>
  )
}
