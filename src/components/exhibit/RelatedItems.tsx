import Link from 'next/link'
import { COLLECTION_SINGULAR, getRelated } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { COLLECTION_GLYPH, Glyph } from '@/components/primitives/Glyph'

/**
 * "פריטים קשורים" — the thread between exhibits.
 *
 * The list is derived: a link declared once in either direction shows on both
 * ends. Nothing here is maintained by hand.
 */
export function RelatedItems({ id }: { id: string }) {
  const related = getRelated(id)
  if (!related.length) return null

  return (
    <section className="mt-20" aria-labelledby="related-heading">
      <SectionHeading
        eyebrow="החוט ממשיך"
        title="פריטים קשורים"
        glyph="arrow"
        className="[&_h2]:text-3xl sm:[&_h2]:text-4xl"
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={item.url}
              className="group surface-card hover:surface-card-hover flex h-full flex-col gap-1.5 px-5 py-4 no-underline"
            >
              <span className="flex items-center gap-2">
                <Glyph
                  name={COLLECTION_GLYPH[item.collection] ?? 'archive'}
                  className="text-brass-line h-3.5 w-3.5"
                />
                <span className="eyebrow">{COLLECTION_SINGULAR[item.collection]}</span>
              </span>
              <span className="font-display group-hover:text-wine text-lg leading-snug transition-colors">
                {item.title}
              </span>
              {formatDate(item.data as Record<string, unknown>) && (
                <span className="label-caps numerals text-ink-faint mt-auto pt-2">
                  {formatDate(item.data as Record<string, unknown>)}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
