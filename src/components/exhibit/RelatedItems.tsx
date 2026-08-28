import Link from 'next/link'
import { COLLECTION_SINGULAR, getRelated } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { Rule } from '@/components/primitives/Rule'

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
      <Rule />
      <h2 id="related-heading" className="label-caps text-brass mt-6">
        פריטים קשורים
      </h2>

      <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={item.url}
              className="group border-rule hover:border-brass flex flex-col gap-1 border-s ps-4 no-underline transition-colors"
            >
              <span className="label-caps text-ink-faint">
                {COLLECTION_SINGULAR[item.collection]}
              </span>
              <span className="font-display group-hover:text-brass text-lg leading-snug transition-colors">
                {item.title}
              </span>
              {formatDate(item.data as Record<string, unknown>) && (
                <span className="label-caps text-ink-faint">
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
