'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export interface ThreadEvent {
  id: string
  url: string
  title: string
  summary: string | null
  /** Rendered date, or null for an undated episode. */
  date: string | null
  hebrewDate: string | null
  /** The year to show in the backdrop. Null for an undated episode. */
  year: number | null
  undated: boolean
  periodId: string | null
  periodTitle: string | null
  place: string | null
  people: Array<{ id: string; url: string; name: string }>
  relatedCount: number
}

/**
 * חוט השנים — the thread of years.
 *
 * One brass hairline runs the length of the life. Events hang off it, and the
 * year of whichever event you are reading sits behind the page at exhibition
 * scale, cross-fading as you move from one to the next. The year is the
 * architecture of the page, not a label on a card.
 *
 * An undated episode is a first-class citizen here: it takes a hollow mark
 * instead of a filled one and shows its period rather than a year. Nothing is
 * given a date it does not have.
 *
 * On a narrow screen the thread moves to the edge and the backdrop becomes a
 * small sticky marker, which is legible where a giant numeral would not be.
 */
export function Thread({ events }: { events: ThreadEvent[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const nodes = itemRefs.current.filter((n): n is HTMLLIElement => n !== null)
    if (!nodes.length) return

    // The event nearest the reading line, not merely the first one visible.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (!visible) return
        const index = nodes.indexOf(visible.target as HTMLLIElement)
        if (index >= 0) setActiveIndex(index)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [events.length])

  const active = events[activeIndex]

  return (
    <div className="relative">
      {/* Sticky marker on small screens — a giant numeral would not fit. */}
      <div className="bg-paper/90 border-rule sticky top-16 z-20 -mx-6 mb-6 border-b px-6 py-2 backdrop-blur-sm sm:-mx-10 sm:px-10 lg:hidden">
        <p className="label-caps text-brass">
          {active?.undated ? (
            (active.periodTitle ?? 'תקופה לא מתוארכת')
          ) : (
            <span dir="ltr" className="numerals inline-block">
              {active?.year}
            </span>
          )}
        </p>
      </div>

      <div className="relative lg:grid lg:grid-cols-[1fr_22rem] lg:gap-x-16">
        <ol className="border-rule relative border-s ps-[var(--thread)] [--thread:1.5rem] sm:[--thread:2.5rem]">
          {events.map((event, i) => (
            <li
              key={event.id}
              ref={(node) => {
                itemRefs.current[i] = node
              }}
              className="relative pb-16 last:pb-0 lg:pb-24"
            >
              {/* The mark on the thread: filled when dated, hollow when not. */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-2.5 h-2.5 w-2.5 rounded-full transition-colors duration-500',
                  event.undated
                    ? 'border-brass-line bg-paper border'
                    : i === activeIndex
                      ? 'bg-brass'
                      : 'bg-brass-line/50',
                )}
                // Centre on the thread without relying on physical direction:
                // pull back by the gutter plus half the marker's own width.
                style={{
                  insetInlineStart: 0,
                  marginInlineStart: 'calc(-1 * (var(--thread) + 0.3125rem))',
                }}
              />

              <article>
                <p className="label-caps text-brass">
                  {event.undated ? (
                    <span className="text-ink-faint">תקופה לא מתוארכת</span>
                  ) : (
                    <span dir="ltr" className="numerals inline-block">
                      {event.date}
                    </span>
                  )}
                  {event.hebrewDate && !event.undated && (
                    <span className="text-ink-faint ms-2">· {event.hebrewDate}</span>
                  )}
                </p>

                <h3 className="mt-2">
                  <Link
                    href={event.url}
                    className="font-display hover:text-brass text-2xl leading-snug no-underline transition-colors sm:text-3xl"
                  >
                    {event.title}
                  </Link>
                </h3>

                {event.summary && (
                  <p className="text-ink-soft mt-3 max-w-[38rem] leading-relaxed">
                    {event.summary}
                  </p>
                )}

                <div className="text-ink-faint mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {event.place && <span className="label-caps">{event.place}</span>}
                  {event.people.length > 0 && (
                    <span className="text-[0.9rem]">
                      {event.people.map((p, n) => (
                        <span key={p.id}>
                          {n > 0 && <span aria-hidden="true">, </span>}
                          <Link
                            href={p.url}
                            className="decoration-brass-soft/70 hover:text-brass underline underline-offset-4 transition-colors"
                          >
                            {p.name}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                  {event.relatedCount > 0 && (
                    <span className="label-caps numerals">{event.relatedCount} פריטים קשורים</span>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>

        {/* The year, at exhibition scale, behind everything. */}
        <div aria-hidden="true" className="pointer-events-none hidden lg:block">
          <div className="sticky top-[38vh]">
            {active?.undated ? (
              <p className="font-display text-brass-line/25 max-w-[16ch] text-3xl leading-tight">
                {active.periodTitle}
              </p>
            ) : (
              <span
                dir="ltr"
                key={active?.year}
                className="numerals font-display text-brass-line/[0.16] exhibit-enter block text-[9rem] leading-none font-light xl:text-[11rem]"
              >
                {active?.year}
              </span>
            )}
            {active?.periodTitle && !active.undated && (
              <p className="label-caps text-ink-faint mt-4 max-w-[18ch]">{active.periodTitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
