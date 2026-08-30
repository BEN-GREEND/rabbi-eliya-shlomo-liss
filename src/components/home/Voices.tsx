import Link from 'next/link'
import { getById, getReal } from '@/lib/content'
import { Glyph } from '@/components/primitives/Glyph'
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
      ground="deep"
      title="קולות מהתערוכה"
      eyebrow="זכרונות ועדויות"
      href="/testimonies"
      empty={items.length === 0}
    >
      <ul className="grid gap-5 md:grid-cols-3">
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
            <li key={item.id} className="group">
              <Link
                href={item.url}
                className="surface-card-deep group-hover:surface-card-deep-hover flex h-full flex-col px-6 py-7 no-underline"
              >
                <Glyph name="quote" className="text-brass-soft/50 h-6 w-6" />
                <blockquote className="font-display text-paper mt-4 text-xl leading-[1.6]">
                  {typeof d.pullQuote === 'string' && d.pullQuote ? (
                    <p>{d.pullQuote}</p>
                  ) : (
                    <p className="group-hover:text-brass-soft transition-colors">{item.title}</p>
                  )}
                </blockquote>
                {attribution && (
                  <p className="label-caps border-rule-navy text-brass-soft mt-auto border-t pt-4">
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
