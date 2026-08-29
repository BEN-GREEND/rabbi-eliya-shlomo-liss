import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { assetExists } from '@/lib/assets'
import { catalogNumber } from '@/lib/catalog'
import {
  categoryById,
  COLLECTION_LABELS,
  getAll,
  getById,
  getBySlug,
  periodById,
  placeById,
  type Collection,
  type Item,
} from '@/lib/content'
import {
  ACTIVITY_KIND_LABELS,
  ASSET_STATUS_LABELS,
  DOC_TYPE_LABELS,
  TORAH_KIND_LABELS,
} from '@/lib/doc-types'
import { dateTimeAttr, formatDate } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { Numerals } from '@/components/primitives/Numerals'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Rule } from '@/components/primitives/Rule'
import { YearMark } from '@/components/primitives/YearMark'
import { PersonList } from './PersonChip'
import { Prose } from './Prose'
import { Provenance, type SourceRef } from './Provenance'
import { RelatedItems } from './RelatedItems'

type Data = Record<string, unknown>

/**
 * The item page.
 *
 * One frame — catalogue number, title, dating, facts, body, people, related
 * exhibits, provenance — with a different opening for each kind of thing. A
 * photograph leads with its plate, a document with its scan, a testimony with
 * the voice, a teaching with what it is a teaching on.
 *
 * They read as one museum without reading as one template.
 */
export function ExhibitPage({ collection, slug }: { collection: Collection; slug: string }) {
  const item = getBySlug(collection, slug)
  if (!item) notFound()

  const d = item.data as Data
  const index = getAll(collection).findIndex((i) => i.id === item.id)
  const date = formatDate(d)

  return (
    <Container width={collection === 'gallery' ? 'wide' : 'default'} className="py-20 lg:py-28">
      <article>
        <header className="relative">
          {typeof d.year === 'number' && d.undated !== true && (
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

          {date ? (
            <p className="label-caps mt-5">
              <time dateTime={dateTimeAttr(d)}>
                <Numerals>{date}</Numerals>
              </time>
              {typeof d.hebrewDate === 'string' && d.hebrewDate && (
                <span className="text-ink-faint ms-2">· {d.hebrewDate}</span>
              )}
            </p>
          ) : d.undated === true ? (
            <p className="label-caps text-ink-faint mt-5">תקופה לא מתוארכת</p>
          ) : null}

          {typeof d.subtitle === 'string' && d.subtitle && (
            <p className="text-ink-soft mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed">
              {d.subtitle}
            </p>
          )}

          {typeof d.summary === 'string' && d.summary && (
            <p className="font-display text-ink-soft mt-6 max-w-[38rem] text-xl leading-relaxed">
              {d.summary}
            </p>
          )}
        </header>

        <Lead collection={collection} item={item} />

        <Rule className="my-12" />

        <Facts collection={collection} d={d} />

        <StatusNotice d={d} />

        <Prose source={item.body} />

        <DocumentFiles d={d} />

        <Transcription d={d} />

        <div className="mt-12 space-y-3">
          <PersonList
            ids={((d.people as string[]) ?? []).filter(
              (id) => id !== d.author && id !== d.narrator,
            )}
            label={collection === 'gallery' ? 'מופיעים בתמונה' : 'אנשים קשורים'}
          />
          <PersonList ids={(d.mentions as string[]) ?? []} label="מוזכרים" />
          {typeof d.author === 'string' && <PersonList ids={[d.author]} label="מחבר" />}
          {typeof d.recipient === 'string' && <PersonList ids={[d.recipient]} label="נמען" />}
          {typeof d.narrator === 'string' && <PersonList ids={[d.narrator]} label="מסר את העדות" />}
          {Array.isArray(d.editor) && d.editor.length > 0 && (
            <PersonList ids={d.editor as string[]} label="ערך והוציא לאור" />
          )}
          {typeof d.custodian === 'string' && (
            <PersonList ids={[d.custodian]} label="המקור שמור אצל" />
          )}
        </div>

        <RelatedItems id={item.id} />

        <Provenance
          sources={(d.sources as SourceRef[] | undefined) ?? []}
          confidence={d.confidence as string | undefined}
          researchNote={d.researchNote as string | undefined}
          researchNeeded={d.researchNeeded as boolean | undefined}
          canonical={d.canonical as boolean | undefined}
        />
      </article>
    </Container>
  )
}

/** The opening that belongs to this kind of exhibit. */
function Lead({ collection, item }: { collection: Collection; item: Item }) {
  const d = item.data as Data

  if (collection === 'gallery') {
    const image = d.image as { src: string; alt: string } | undefined
    const present = assetExists(image?.src)
    return (
      <div className="border-rule bg-paper-deep relative mt-10 aspect-3/2 overflow-hidden border">
        {present && image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 72rem, 100vw"
            className="object-contain"
          />
        ) : (
          <span className="label-caps text-ink-faint absolute inset-0 flex items-center justify-center">
            {ASSET_STATUS_LABELS[(d.assetStatus as string) ?? 'awaited']}
          </span>
        )}
      </div>
    )
  }

  if (collection === 'testimonies') {
    const narrator = typeof d.narrator === 'string' ? getById(d.narrator) : undefined
    const nd = narrator?.data as { displayName?: string; name?: string } | undefined
    const speaker = nd?.displayName || nd?.name || (d.narratorName as string | undefined)
    const where = [d.location as string | undefined, formatDate(d)].filter(Boolean).join(' · ')

    if (!speaker && !d.pullQuote) return null

    return (
      <div className="mt-10">
        {speaker && (
          <div className="border-brass/30 border-s-2 ps-6">
            <p className="font-display text-2xl leading-snug">
              {narrator ? (
                <Link
                  href={narrator.url}
                  className="hover:text-brass no-underline transition-colors"
                >
                  {speaker}
                </Link>
              ) : (
                speaker
              )}
            </p>
            {where && (
              <p className="label-caps text-ink-faint mt-1.5">
                <Numerals>{where}</Numerals>
              </p>
            )}
          </div>
        )}

        {typeof d.pullQuote === 'string' && d.pullQuote && (
          <blockquote className="mt-10">
            <p className="font-display text-ink max-w-[24ch] text-3xl leading-[1.35] sm:text-4xl">
              „{d.pullQuote}”
            </p>
            {speaker && <footer className="label-caps text-ink-faint mt-5">— {speaker}</footer>}
          </blockquote>
        )}
      </div>
    )
  }

  if (collection === 'archive') {
    const preview = d.preview as { src: string; alt: string } | undefined
    if (!assetExists(preview?.src) || !preview) return null
    return (
      <div className="border-rule bg-paper-deep relative mt-10 aspect-4/3 overflow-hidden border">
        <Image
          src={preview.src}
          alt={preview.alt}
          fill
          priority
          sizes="(min-width: 1024px) 48rem, 100vw"
          className="object-contain"
        />
      </div>
    )
  }

  return null
}

/** Catalogue facts. Only rows that have a value are rendered. */
function Facts({ collection, d }: { collection: Collection; d: Data }) {
  const period = typeof d.period === 'string' ? periodById(d.period) : undefined
  const places = ((d.places as string[]) ?? []).flatMap((p) => placeById(p)?.name ?? [])
  const categories = ((d.categories as string[]) ?? []).flatMap(
    (c) => categoryById(collection, c)?.title ?? [],
  )

  const years =
    typeof d.startYear === 'number'
      ? `${d.startYear}${d.ongoing ? '—' : d.endYear ? `–${d.endYear}` : ''}`
      : null

  const kindLabel =
    DOC_TYPE_LABELS[d.docType as string] ??
    TORAH_KIND_LABELS[d.kind as string] ??
    ACTIVITY_KIND_LABELS[d.kind as string]

  const rows: Array<[string, string | undefined | null]> = [
    ['סוג', kindLabel],
    ['מסכת', d.tractate as string],
    ['פרק', d.chapter as string],
    ['פרשה', d.parasha as string],
    ['חלקים שיצאו', typeof d.publishedParts === 'number' ? String(d.publishedParts) : null],
    ['שנים', years],
    ['תקופה', period?.title],
    ['מקום', places.join(' · ') || (d.location as string | undefined)],
    ['קטגוריה', categories.join(' · ')],
    ['צלם', d.photographer as string],
    ['מוסר העדות', d.narratorName as string],
    ['הקשר', d.narratorRelation as string],
    ['מקור', d.source as string],
    ['קרדיט', d.credit as string],
    ['זכויות', d.copyright as string],
    ['מצב הפריט', ASSET_STATUS_LABELS[d.assetStatus as string]],
  ]

  const visible = rows.filter(([, value]) => Boolean(value))
  if (!visible.length) return null

  return (
    <dl className="mb-12 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map(([label, value]) => (
        <div key={label}>
          <dt className="label-caps text-ink-faint">{label}</dt>
          <dd className="mt-1 text-[0.95rem]">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A plain sentence about why an object is not here, when it is not. */
function StatusNotice({ d }: { d: Data }) {
  const notices: Record<string, string> = {
    'not-digitized': 'הפריט קיים בוודאות וטרם נסרק.',
    'private-archive': 'המקור שמור בארכיון משפחתי פרטי ואינו זמין לציבור.',
    awaited: 'הקובץ טרם הועלה לארכיון.',
    located: 'המקור אותר אך טרם הושג.',
    sought: 'הפריט טרם אותר.',
    lost: 'הפריט אבד. רשומה זו מתעדת מוצג שאיננו.',
  }
  const status = d.assetStatus as string | undefined
  const notice = status ? notices[status] : undefined
  if (!notice) return null
  return <PlaceholderNotice className="mb-10">{notice}</PlaceholderNotice>
}

/** A document's transcription, set out plainly rather than buried. */
function Transcription({ d }: { d: Data }) {
  const text = d.transcription
  if (typeof text !== 'string' || !text.trim()) return null
  return (
    <section className="mt-12" aria-labelledby="transcription-heading">
      <Rule />
      <h2 id="transcription-heading" className="label-caps text-brass mt-6">
        תמלול
      </h2>
      <div className="bg-paper-deep/40 border-brass/25 mt-5 border-s-2 px-6 py-5">
        <p className="max-w-[38rem] leading-[1.9] whitespace-pre-line">{text}</p>
      </div>
    </section>
  )
}

/** File links, only for files that actually exist on disk. */
function DocumentFiles({ d }: { d: Data }) {
  const files: Array<[string, string]> = []
  if (typeof d.file === 'string' && assetExists(d.file)) files.push(['הקובץ המלא', d.file])
  if (typeof d.pdf === 'string' && assetExists(d.pdf)) files.push(['PDF', d.pdf])
  for (const [i, page] of ((d.pages as string[]) ?? []).entries()) {
    if (assetExists(page)) files.push([`עמוד ${i + 1}`, page])
  }
  if (!files.length) return null

  return (
    <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
      {files.map(([label, href]) => (
        <Link key={href} href={href} className="label-caps border-brass border-b pb-1 no-underline">
          {label}
        </Link>
      ))}
    </p>
  )
}
