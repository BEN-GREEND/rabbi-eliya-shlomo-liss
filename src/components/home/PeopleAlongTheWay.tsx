import Image from 'next/image'
import Link from 'next/link'
import { assetExists } from '@/lib/assets'
import { countPersonItems, getReal } from '@/lib/content'
import { lifeSpan } from '@/lib/utils/format'
import { HomeSection } from './HomeSection'

/** The site's subject is the exhibition, not one of the people in it. */
const SUBJECT_ID = 'rabbi-eliya-shlomo-liss'

/**
 * "אנשים בדרכו" — portraits as catalogue cards.
 *
 * The count under each name is derived from the reverse index: how many
 * exhibits across the whole site point at that person.
 */
export function PeopleAlongTheWay({ index }: { index: number }) {
  const people = getReal('people')
    .filter((p) => p.id !== SUBJECT_ID)
    .sort((a, b) => countPersonItems(b.id) - countPersonItems(a.id))
    .slice(0, 6)

  return (
    <HomeSection
      index={index}
      title="אנשים בדרכו"
      href="/people"
      linkLabel="לכל האישים"
      empty={people.length === 0}
    >
      <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {people.map((person) => {
          const d = person.data as Record<string, unknown>
          const image = d.image as { src: string; alt: string } | undefined
          const years = lifeSpan(d)
          const count = countPersonItems(person.id)

          return (
            <li key={person.id}>
              <Link href={person.url} className="group block no-underline">
                <div className="border-rule bg-paper-deep relative aspect-square overflow-hidden border">
                  {assetExists(image?.src) && image ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 14vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="font-display text-brass/20 absolute inset-0 flex items-center justify-center text-3xl"
                    >
                      {String((d.displayName ?? d.name ?? person.title) as string).charAt(0)}
                    </span>
                  )}
                </div>
                <p className="font-display group-hover:text-brass mt-3 text-[1.0625rem] leading-snug transition-colors">
                  {(d.displayName as string) || (d.name as string) || person.title}
                </p>
                {years && <p className="label-caps numerals text-ink-faint mt-1">{years}</p>}
                {typeof d.relationToRabbi === 'string' && d.relationToRabbi && (
                  <p className="label-caps text-ink-faint mt-1">{d.relationToRabbi}</p>
                )}
                {count > 0 && (
                  <p className="label-caps numerals text-brass mt-1.5">{count} מוצגים</p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
