import Link from 'next/link'
import { getById, getReal } from '@/lib/content'
import { HomeSection } from './HomeSection'

/**
 * "קולות מהתערוכה" — testimonies presented as voices, not as blog posts.
 * A pull quote carries each one; the attribution sits beneath it in the
 * small caps used on every wall label.
 */
export function Voices({ index }: { index: number }) {
  const items = getReal('testimonies').slice(0, 3)

  return (
    <HomeSection
      index={index}
      glyph="testimony"
      ground="paper"
      title="קולות מהתערוכה"
      eyebrow="זכרונות ועדויות"
      href="/testimonies"
      empty={items.length === 0}
    >
      <ul className="grid gap-x-12 gap-y-14 md:grid-cols-3">
        {items.map((item) => {
          const d = item.data as Record<string, unknown>
          const narrator = typeof d.narrator === 'string' ? getById(d.narrator) : undefined
          const narratorData = narrator?.data as { displayName?: string; name?: string } | undefined
          const narratorName =
            narratorData?.displayName ??
            narratorData?.name ??
            (d.narratorName as string | undefined)
          const relation = d.narratorRelation as string | undefined
          const attribution = [narratorName, relation].filter(Boolean).join(' · ')

          return (
            <li key={item.id}>
              <Link href={item.url} className="group block no-underline">
                <blockquote className="font-display text-ink text-xl leading-[1.6]">
                  {typeof d.pullQuote === 'string' && d.pullQuote ? (
                    <p>„{d.pullQuote}”</p>
                  ) : (
                    <p className="group-hover:text-brass transition-colors">{item.title}</p>
                  )}
                </blockquote>
                {attribution && (
                  <p className="label-caps border-rule text-ink-faint mt-4 border-t pt-3">
                    {attribution}
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
