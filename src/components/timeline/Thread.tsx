'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Glyph } from '@/components/primitives/Glyph'

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
 * One brass hairline runs the length of the life. Events hang off it on their
 * own leaves of paper, and the year of whichever event you are reading sits
 * behind the page at exhibition scale, cross-fading as you move from one to
 * the next. The year is the architecture of the page, not a label on a card.
 *
 * The periods are the second structure: where one ends and the next begins the
 * thread widens into a band, so the shape of the life is visible before a
 * single event is read.
 *
 * An undated episode is a first-class citizen here: it takes a hollow mark
 * instead of a filled one and shows its period rather than a year. Nothing is
 * given a date it does not have.
 *
 * On a narrow screen the backdrop becomes a small sticky marker, which is
 * legible where a giant numeral would not be.
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
      <div className="bg-paper/92 border-rule sticky top-16 z-20 -mx-6 mb-8 flex items-baseline gap-3 border-b px-6 py-2.5 backdrop-blur-sm sm:-mx-10 sm:px-10 lg:hidden">
        <span className="font-display text-wine numerals text-lg leading-none font-medium">
          {active?.undated ? '—' : <span dir="ltr">{active?.year}</span>}
        </span>
        {active?.periodTitle && (
          <span className="label-caps text-ink-faint truncate">{active.periodTitle}</span>
        )}
      </div>

      <div className="relative lg:grid lg:grid-cols-[1fr_24rem] lg:gap-x-16">
        <ol className="relative ps-[var(--thread)] [--thread:1.75rem] sm:[--thread:3rem]">
          {/* The thread itself: brass at the top, fading out at the end of the
              life rather than stopping at a hard edge. */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px"
            style={{
              insetInlineStart: 0,
              background:
                'linear-gradient(to bottom, var(--color-brass-line) 0%, var(--color-rule) 12%, var(--color-rule) 88%, transparent 100%)',
            }}
          />

          {events.map((event, i) => {
            const isActive = i === activeIndex
            const startsPeriod =
              event.periodTitle !== null && (i === 0 || events[i - 1]?.periodId !== event.periodId)

            return (
              <li
                key={event.id}
                ref={(node) => {
                  itemRefs.current[i] = node
                }}
                className="group relative pb-10 last:pb-0 lg:pb-14"
              >
                {startsPeriod && <PeriodBand title={event.periodTitle as string} first={i === 0} />}

                <div className="relative">
                  {/* The mark on the thread: filled when dated, hollow when
                        not, ringed while it is the one you are reading. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[1.6rem] flex h-3.5 w-3.5 items-center justify-center"
                    // Centre on the thread without relying on physical direction:
                    // pull back by the gutter plus half the marker's own width.
                    style={{
                      insetInlineStart: 0,
                      marginInlineStart: 'calc(-1 * (var(--thread) + 0.4375rem))',
                    }}
                  >
                    <span
                      className={cn(
                        'absolute inset-0 rounded-full border transition-all duration-500',
                        isActive ? 'border-wine-line/45 scale-100' : 'scale-50 border-transparent',
                      )}
                    />
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full transition-colors duration-500',
                        event.undated
                          ? 'border-brass-line bg-paper border'
                          : isActive
                            ? 'bg-wine'
                            : 'bg-brass-line/60 group-hover:bg-brass',
                      )}
                    />
                  </span>

                  {/* The tie from the thread to the leaf of paper. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'bg-rule absolute top-[2.15rem] hidden h-px transition-colors duration-300 sm:block',
                      'group-hover:bg-brass-line',
                    )}
                    style={{
                      insetInlineStart: 0,
                      marginInlineStart: 'calc(-1 * (var(--thread) - 0.4rem))',
                      width: 'calc(var(--thread) - 0.4rem)',
                    }}
                  />

                  <article
                    className={cn(
                      'surface-card group-hover:surface-card-hover px-5 py-5 sm:px-7 sm:py-6',
                      isActive && 'border-brass-line/60',
                    )}
                  >
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {event.undated ? (
                        <span className="label-caps text-ink-faint">תקופה לא מתוארכת</span>
                      ) : (
                        <span
                          dir="ltr"
                          className="font-display text-wine numerals inline-block text-lg leading-none font-medium"
                        >
                          {event.date}
                        </span>
                      )}
                      {event.hebrewDate && !event.undated && (
                        <span className="label-caps text-ink-faint">{event.hebrewDate}</span>
                      )}
                    </p>

                    <h3 className="mt-3">
                      <Link
                        href={event.url}
                        className="font-display group-hover:text-wine text-2xl leading-snug no-underline transition-colors duration-300 sm:text-[1.75rem]"
                      >
                        {event.title}
                      </Link>
                    </h3>

                    {event.summary && (
                      <p className="text-ink-soft mt-3 max-w-[38rem] leading-relaxed">
                        {event.summary}
                      </p>
                    )}

                    {(event.place || event.people.length > 0 || event.relatedCount > 0) && (
                      <div className="border-rule-soft text-ink-faint mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4">
                        {event.place && (
                          <span className="label-caps flex items-center gap-1.5">
                            <Glyph name="activity" className="text-brass-line h-3.5 w-3.5" />
                            {event.place}
                          </span>
                        )}
                        {event.people.length > 0 && (
                          <span className="flex items-center gap-1.5 text-[0.9rem]">
                            <Glyph name="person" className="text-brass-line h-3.5 w-3.5" />
                            <span>
                              {event.people.map((p, n) => (
                                <span key={p.id}>
                                  {n > 0 && <span aria-hidden="true">, </span>}
                                  <Link
                                    href={p.url}
                                    className="hover:text-wine underline-grow no-underline transition-colors"
                                  >
                                    {p.name}
                                  </Link>
                                </span>
                              ))}
                            </span>
                          </span>
                        )}
                        {event.relatedCount > 0 && (
                          <span className="label-caps numerals flex items-center gap-1.5">
                            <Glyph name="archive" className="text-brass-line h-3.5 w-3.5" />
                            {event.relatedCount === 1
                              ? 'פריט קשור אחד'
                              : `${event.relatedCount} פריטים קשורים`}
                          </span>
                        )}
                      </div>
                    )}
                  </article>
                </div>
              </li>
            )
          })}
        </ol>

        {/* The year, at exhibition scale, behind everything. */}
        <div aria-hidden="true" className="pointer-events-none hidden lg:block">
          <div className="sticky top-[34vh]">
            {active?.undated ? (
              <p className="font-display text-brass-line/30 max-w-[16ch] text-3xl leading-tight">
                {active.periodTitle}
              </p>
            ) : (
              <span
                dir="ltr"
                key={active?.year}
                className="numerals font-display text-brass-line/[0.18] exhibit-enter block text-[9.5rem] leading-none font-light xl:text-[12rem]"
              >
                {active?.year}
              </span>
            )}
            {active?.periodTitle && !active.undated && (
              <>
                <span className="bg-wine-line/40 mt-6 block h-px w-16" />
                <p className="eyebrow text-wine/70 mt-4 max-w-[18ch]">{active.periodTitle}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The band that opens a period.
 *
 * It sits in the thread's own gutter so the eye reads it as a station on the
 * line rather than a heading floating above the cards.
 */
function PeriodBand({ title, first }: { title: string; first: boolean }) {
  return (
    <div className={cn('relative flex items-center gap-4', first ? 'mb-8' : 'mt-6 mb-8 pt-10')}>
      {!first && (
        <span
          aria-hidden="true"
          className="bg-rule absolute top-0 h-px"
          style={{ insetInlineStart: 'calc(-1 * var(--thread))', insetInlineEnd: 0 }}
        />
      )}
      <span
        aria-hidden="true"
        className="border-wine-line/50 bg-paper absolute h-2 w-2 rotate-45 border"
        style={{
          insetInlineStart: 0,
          marginInlineStart: 'calc(-1 * (var(--thread) + 0.25rem))',
        }}
      />
      <h3 className="eyebrow text-wine">{title}</h3>
      <span aria-hidden="true" className="bg-wine-line/25 h-px flex-1" />
    </div>
  )
}
