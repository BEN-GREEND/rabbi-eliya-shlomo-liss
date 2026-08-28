import { notFound } from 'next/navigation'
import { catalogNumber } from '@/lib/catalog'
import {
  COLLECTION_LABELS,
  categoryById,
  getAll,
  getBySlug,
  periodById,
  placeById,
  type Collection,
} from '@/lib/content'
import { formatDate, dateTimeAttr } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Rule } from '@/components/primitives/Rule'
import { YearMark } from '@/components/primitives/YearMark'
import { PersonList } from './PersonChip'
import { Provenance, type SourceRef } from './Provenance'
import { Prose } from './Prose'
import { RelatedItems } from './RelatedItems'

/**
 * Shared item page.
 *
 * Stage 2 scaffolding, same as CollectionIndex — real data, real design
 * system, no bespoke layout yet. The archive reading view and the gallery
 * lightbox arrive in stage 4.
 */
export function ExhibitPage({ collection, slug }: { collection: Collection; slug: string }) {
  const item = getBySlug(collection, slug)
  if (!item) notFound()

  const d = item.data as Record<string, unknown>
  const index = getAll(collection).findIndex((i) => i.id === item.id)
  const period = typeof d.period === 'string' ? periodById(d.period) : undefined
  const places = ((d.places as string[] | undefined) ?? []).flatMap((p) => placeById(p)?.name ?? [])
  const categories = ((d.categories as string[] | undefined) ?? []).flatMap(
    (c) => categoryById(collection, c)?.title ?? [],
  )
  const date = formatDate(d)

  return (
    <Container width="default" className="py-20 lg:py-28">
      <article>
        <header className="relative">
          {typeof d.year === 'number' && (
            <div className="pointer-events-none absolute end-0 -top-20 -z-10 hidden sm:block">
              <YearMark year={d.year} />
            </div>
          )}

          <p className="label-caps numerals text-brass">
            {COLLECTION_LABELS[collection]} · מוצג {catalogNumber(collection, index)}
          </p>

          <h1 className="font-display mt-4 max-w-[24ch] text-4xl leading-tight sm:text-5xl">
            {item.title}
          </h1>

          {date && (
            <p className="label-caps mt-5">
              <time dateTime={dateTimeAttr(d)}>{date}</time>
            </p>
          )}

          {typeof d.summary === 'string' && d.summary && (
            <p className="font-display text-ink-soft mt-6 max-w-[38rem] text-xl leading-relaxed">
              {d.summary}
            </p>
          )}
        </header>

        <Rule className="my-12" />

        {/* Catalogue facts — rendered only where a value exists. */}
        <dl className="mb-12 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['תקופה', period?.title],
            ['מקום', places.join(' · ') || (d.location as string | undefined)],
            ['קטגוריה', categories.join(' · ')],
            ['מקור', d.source as string | undefined],
            ['קרדיט', d.credit as string | undefined],
          ]
            .filter(([, value]) => Boolean(value))
            .map(([label, value]) => (
              <div key={label as string}>
                <dt className="label-caps text-ink-faint">{label}</dt>
                <dd className="mt-1 text-[0.95rem]">{value}</dd>
              </div>
            ))}
        </dl>

        {d.placeholder ? <PlaceholderNotice className="mb-10" /> : null}
        {d.acquisitionStatus === 'sought' && (
          <PlaceholderNotice className="mb-10">המסמך טרם אותר — רשומת קטלוג בלבד</PlaceholderNotice>
        )}
        {d.acquisitionStatus === 'located' && (
          <PlaceholderNotice className="mb-10">המסמך אותר אך טרם הושג</PlaceholderNotice>
        )}
        {d.assetStatus === 'awaited' && (
          <PlaceholderNotice className="mb-10">הקובץ טרם הועלה לארכיון</PlaceholderNotice>
        )}
        {d.status === 'located' && (
          <PlaceholderNotice className="mb-10">
            המקור אותר ביבליוגרפית — טרם נקרא במלואו
          </PlaceholderNotice>
        )}
        {d.status === 'sought' && (
          <PlaceholderNotice className="mb-10">המקור טרם אותר</PlaceholderNotice>
        )}

        <Prose source={item.body} />

        <div className="mt-12 space-y-3">
          <PersonList ids={(d.people as string[] | undefined) ?? []} label="אנשים קשורים" />
          <PersonList ids={(d.mentions as string[] | undefined) ?? []} label="מוזכרים" />
          {typeof d.author === 'string' && <PersonList ids={[d.author]} label="מחבר" />}
          {typeof d.recipient === 'string' && <PersonList ids={[d.recipient]} label="נמען" />}
          {typeof d.narrator === 'string' && <PersonList ids={[d.narrator]} label="מסר את העדות" />}
        </div>

        <Provenance
          sources={(d.sources as SourceRef[] | undefined) ?? []}
          confidence={d.confidence as string | undefined}
          researchNote={d.researchNote as string | undefined}
          researchNeeded={d.researchNeeded as boolean | undefined}
        />

        <RelatedItems id={item.id} />
      </article>
    </Container>
  )
}
