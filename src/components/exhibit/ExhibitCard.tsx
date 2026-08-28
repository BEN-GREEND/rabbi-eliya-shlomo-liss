import Link from 'next/link'
import { catalogNumber } from '@/lib/catalog'
import { categoryById, periodById, type Item } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { ExhibitLabel } from './ExhibitLabel'

/**
 * One exhibit in a list. A card is a wall label wrapped in a link — the same
 * component the item page uses, so a photograph reads identically wherever
 * it appears.
 */
export function ExhibitCard({ item, index }: { item: Item; index: number }) {
  const d = item.data as Record<string, unknown>
  const period = typeof d.period === 'string' ? periodById(d.period) : undefined
  const firstCategory = (d.categories as string[] | undefined)?.[0]
  const category = firstCategory ? categoryById(item.collection, firstCategory) : undefined

  return (
    <article className="group">
      <Link href={item.url} className="block no-underline">
        <ExhibitLabel
          catalog={catalogNumber(item.collection, index)}
          title={<span className="group-hover:text-brass transition-colors">{item.title}</span>}
          meta={[formatDate(d), period?.title, category?.title]}
          className="group-hover:border-brass transition-colors"
        >
          {typeof d.summary === 'string' && d.summary ? (
            <p>{d.summary}</p>
          ) : d.placeholder ? (
            <PlaceholderNotice />
          ) : null}
        </ExhibitLabel>
      </Link>
    </article>
  )
}
