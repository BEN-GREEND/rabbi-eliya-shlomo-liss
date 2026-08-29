import Link from 'next/link'
import { catalogNumber } from '@/lib/catalog'
import { categoryById, periodById, type Item } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { COLLECTION_GLYPH, Glyph } from '@/components/primitives/Glyph'
import { ExhibitLabel } from './ExhibitLabel'

/**
 * One exhibit in a list.
 *
 * A wall label mounted on its own leaf of paper: the label component is
 * unchanged, so a photograph reads identically wherever it appears, but the
 * card around it lifts, takes a brass edge on its leading side and turns its
 * title wine when you point at it.
 */
export function ExhibitCard({ item, index }: { item: Item; index: number }) {
  const d = item.data as Record<string, unknown>
  const period = typeof d.period === 'string' ? periodById(d.period) : undefined
  const firstCategory = (d.categories as string[] | undefined)?.[0]
  const category = firstCategory ? categoryById(item.collection, firstCategory) : undefined

  return (
    <article className="group h-full">
      <Link
        href={item.url}
        className="surface-card group-hover:surface-card-hover block h-full px-5 py-5 no-underline sm:px-6 sm:py-6"
      >
        <Glyph
          name={COLLECTION_GLYPH[item.collection] ?? 'archive'}
          className="text-brass-line/70 group-hover:text-brass absolute end-5 top-5 h-4 w-4 transition-colors"
        />
        <ExhibitLabel
          titleAs="h2"
          catalog={catalogNumber(item.collection, index)}
          title={<span className="group-hover:text-wine transition-colors">{item.title}</span>}
          meta={[formatDate(d), period?.title, category?.title]}
          className="border-0 ps-0 sm:ps-0"
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
