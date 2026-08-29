'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { EmptyState } from '@/components/primitives/EmptyState'

export interface PersonCard {
  id: string
  url: string
  name: string
  years: string | null
  relation: string | null
  categories: string[]
  count: number
  image: { src: string; alt: string } | null
  initial: string
}

export interface CategoryOption {
  id: string
  title: string
  count: number
}

/**
 * The people wall.
 *
 * Portraits where we have them, a drawn monogram where we do not — a catalogue
 * of the faces around one life, not an index of names.
 *
 * The filters come from content/_vocab/categories.yml, never from a list in
 * this file: adding a category is an edit to the vocabulary and it appears
 * here on its own. Only categories that actually have people are offered.
 */
export function PeopleGallery({
  people,
  categories,
}: {
  people: PersonCard[]
  categories: CategoryOption[]
}) {
  const [active, setActive] = useState<string | null>(null)

  const shown = useMemo(
    () => (active ? people.filter((p) => p.categories.includes(active)) : people),
    [people, active],
  )

  return (
    <>
      <div className="border-rule mb-12 flex flex-wrap items-center gap-x-2 gap-y-3 border-y py-4">
        <span className="label-caps text-ink-faint me-3">סינון</span>
        <FilterChip active={active === null} onClick={() => setActive(null)} count={people.length}>
          הכול
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={active === c.id}
            onClick={() => setActive(c.id)}
            count={c.count}
          >
            {c.title}
          </FilterChip>
        ))}
      </div>

      <ul
        aria-live="polite"
        className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4"
      >
        {shown.map((person) => (
          <li key={person.id}>
            <Link href={person.url} className="group block no-underline">
              <div className="border-rule bg-paper-deep relative aspect-[4/5] overflow-hidden border">
                {person.image ? (
                  <Image
                    src={person.image.src}
                    alt={person.image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-display text-brass-line/20 absolute inset-0 flex items-center justify-center text-5xl"
                  >
                    {person.initial}
                  </span>
                )}
              </div>

              <div className="border-rule group-hover:border-brass mt-3 border-s ps-3 transition-colors">
                <p className="font-display group-hover:text-brass text-lg leading-snug transition-colors">
                  {person.name}
                </p>
                {person.years && (
                  <p className="label-caps text-ink-faint mt-1">
                    <span dir="ltr" className="numerals inline-block">
                      {person.years}
                    </span>
                  </p>
                )}
                {person.relation && (
                  <p className="text-ink-soft mt-1 text-[0.9rem] leading-snug">{person.relation}</p>
                )}
                {person.count > 0 && (
                  <p className="label-caps numerals text-brass mt-1.5">{person.count} מוצגים</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <EmptyState glyph="person" title="מקום שממתין לדמות" note="בקטגוריה זו טרם נוספו אישים." />
      )}
    </>
  )
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn('chip', active && 'chip-active')}
    >
      {children}
      <span className="numerals text-ink-faint ms-1.5">{count}</span>
    </button>
  )
}
