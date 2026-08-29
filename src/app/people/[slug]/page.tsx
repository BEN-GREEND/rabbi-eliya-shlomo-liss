import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { assetExists } from '@/lib/assets'
import {
  COLLECTION_LABELS,
  COLLECTION_SINGULAR,
  BROWSABLE_COLLECTIONS,
  getAll,
  getBySlug,
  getById,
  getInverseRelations,
  getPersonItems,
  periodById,
  placeById,
  ROLE_LABELS,
  type Collection,
} from '@/lib/content'
import { RELATION_LABELS } from '@/lib/content/references'
import { itemMetadata } from '@/lib/seo'
import { formatDate, lifeSpan } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { Glyph, COLLECTION_GLYPH } from '@/components/primitives/Glyph'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Numerals } from '@/components/primitives/Numerals'
import { Prose } from '@/components/exhibit/Prose'
import { Provenance, type SourceRef } from '@/components/exhibit/Provenance'

export function generateStaticParams() {
  return getAll('people').map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const person = getBySlug('people', slug)
  if (!person) return {}
  return itemMetadata({
    title: person.title,
    description: (person.data.shortBio ?? person.data.relationToRabbi) as string | undefined,
    path: person.url,
  })
}

/** One fact in the catalogue card. Rendered only when there is a value. */
function Fact({ label, children }: { label: string; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <div>
      <dt className="label-caps text-ink-faint">{label}</dt>
      <dd className="mt-1 text-[0.95rem]">{children}</dd>
    </div>
  )
}

/** A row of tags: roles, places, periods. Rendered only when non-empty. */
function ChipRow({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="label-caps text-ink-faint w-full sm:w-auto">{label}</span>
      {values.map((value) => (
        <span key={value} className="chip">
          {value}
        </span>
      ))}
    </div>
  )
}

/**
 * The person page — a museum catalogue card, then everything in the archive
 * that touches this person.
 *
 * The exhibit list is derived entirely from the reverse index. Nothing here is
 * maintained by hand: a photograph that names this person in its `people`
 * field appears below without anyone editing this file or theirs.
 */
export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = getBySlug('people', slug)
  if (!person) notFound()

  const d = person.data as Record<string, unknown>
  const image = d.image as { src: string; alt: string } | undefined
  const hasPortrait = assetExists(image?.src)
  const years = lifeSpan(d)
  const places = ((d.places as string[]) ?? []).flatMap((p) => placeById(p)?.name ?? [])
  const periods = ((d.periods as string[]) ?? []).flatMap((p) => periodById(p)?.title ?? [])
  const roles = (d.roles as string[]) ?? []
  // Ties this record declares, plus ties other people declared towards it —
  // each connection is authored once, on whichever side is natural.
  const declared = (d.relations as Array<{ person: string; type: string; note?: string }>) ?? []
  const declaredIds = new Set(declared.map((r) => r.person))
  const relations = [
    ...declared,
    ...getInverseRelations(person.id).filter((r) => !declaredIds.has(r.person)),
  ]

  // Everything in the archive that points at this person, grouped by collection.
  const linked = getPersonItems(person.id)
  const grouped = BROWSABLE_COLLECTIONS.filter((c) => c !== 'people' && c !== 'sources')
    .map((collection) => ({
      collection,
      items: linked.filter((i) => i.collection === collection),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <Container width="default" className="py-20 lg:py-28">
      <article>
        <div className="mb-6 flex items-center gap-3">
          <Glyph name="person" className="text-brass h-4 w-4" />
          <p className="eyebrow">{COLLECTION_LABELS.people}</p>
          <span aria-hidden="true" className="bg-rule h-px flex-1" />
        </div>

        {/* ---- catalogue card ---- */}
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-[13rem_1fr]">
          <div className="bg-stone/50 border-paper-edge h-fit border p-2.5 shadow-[var(--shadow-rest)]">
            <div className="border-rule bg-paper-deep relative aspect-[4/5] w-full overflow-hidden border">
              {hasPortrait && image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="13rem"
                  className="object-cover"
                  priority
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="font-display text-brass-line/25 absolute inset-0 flex items-center justify-center text-6xl"
                >
                  {String((d.displayName ?? d.name ?? person.title) as string).charAt(0)}
                </span>
              )}
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl leading-[1.15] sm:text-5xl">
              {(d.displayName as string) || (d.name as string) || person.title}
            </h1>
            {years && (
              <p className="mt-4 flex items-center gap-3">
                <span aria-hidden="true" className="bg-wine-line/50 h-px w-8" />
                <span className="font-display text-wine numerals text-lg leading-none font-medium">
                  <Numerals>{years}</Numerals>
                </span>
              </p>
            )}
            {typeof d.relationToRabbi === 'string' && d.relationToRabbi && (
              <p className="font-display text-ink-soft mt-5 max-w-[34rem] text-xl leading-relaxed">
                {d.relationToRabbi}
              </p>
            )}

            {(roles.length > 0 || places.length > 0 || periods.length > 0) && (
              <div className="mt-7 space-y-3">
                <ChipRow label="תפקידים" values={roles} />
                <ChipRow label="מקומות" values={places} />
                <ChipRow label="תקופות" values={periods} />
              </div>
            )}

            <dl className="bg-stone/45 border-paper-edge mt-8 grid gap-x-10 gap-y-5 border px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] sm:grid-cols-2">
              <Fact label="נולד">{d.birthHebrewDate as string}</Fact>
              <Fact label="נפטר">{d.deathHebrewDate as string}</Fact>
              <Fact label="מקום לידה">{d.birthPlace as string}</Fact>
              <Fact label="מקום פטירה">{d.deathPlace as string}</Fact>
              <Fact label="מקום קבורה">{d.burialPlace as string}</Fact>
              <Fact label="שם נעורים">{d.maidenName as string}</Fact>
              <Fact label="כינויים">
                {((d.aliases as string[]) ?? []).join(' · ') || undefined}
              </Fact>
            </dl>
          </div>
        </div>

        {d.researchCandidate === true && (
          <PlaceholderNotice className="mt-10">
            מועמד מחקר — הקשר לרב ליס טרם אומת
          </PlaceholderNotice>
        )}

        <div className="my-14 flex items-center gap-4">
          <span aria-hidden="true" className="bg-brass-line/45 h-px w-16" />
          <span aria-hidden="true" className="bg-rule h-px flex-1" />
        </div>

        {typeof d.shortBio === 'string' && d.shortBio && (
          <p className="font-display mb-8 max-w-[38rem] text-xl leading-relaxed">{d.shortBio}</p>
        )}
        <Prose source={person.body} />

        {/* ---- ties to other people ---- */}
        {relations.length > 0 && (
          <section className="mt-20" aria-labelledby="relations-heading">
            <SectionHeading
              eyebrow="הרשת סביבו"
              title="קשרים"
              glyph="person"
              className="[&_h2]:text-3xl sm:[&_h2]:text-4xl"
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {relations.map((rel) => {
                const other = getById(rel.person)
                if (!other) return null
                const od = other.data as { displayName?: string; name?: string }
                return (
                  <li key={`${rel.person}-${rel.type}`}>
                    <Link
                      href={other.url}
                      className="group surface-card hover:surface-card-hover block px-5 py-4 no-underline"
                    >
                      <span className="eyebrow block">{RELATION_LABELS[rel.type] ?? rel.type}</span>
                      <span className="font-display group-hover:text-wine mt-1.5 block text-lg transition-colors">
                        {od.displayName || od.name || other.title}
                      </span>
                      {rel.note && (
                        <span className="text-ink-soft mt-1 block text-[0.9rem] leading-snug">
                          {rel.note}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* ---- everything in the archive that touches this person ---- */}
        {grouped.length > 0 && (
          <section className="mt-20" aria-labelledby="exhibits-heading">
            <SectionHeading
              eyebrow="מן הארכיון"
              title="מוצגים הקשורים לאישיות"
              glyph="archive"
              className="[&_h2]:text-3xl sm:[&_h2]:text-4xl"
            />

            <div className="mt-10 space-y-12">
              {grouped.map(({ collection, items }) => (
                <div key={collection}>
                  <h3 className="border-rule flex items-center gap-2.5 border-b pb-3">
                    <Glyph
                      name={COLLECTION_GLYPH[collection] ?? 'archive'}
                      className="text-brass-line h-4 w-4"
                    />
                    <span className="label-caps text-ink">
                      {COLLECTION_LABELS[collection as Collection]}
                    </span>
                    <span className="numerals label-caps text-brass">{items.length}</span>
                  </h3>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const date = formatDate(item.data)
                      const role = ROLE_LABELS[item.role]
                      return (
                        <li key={`${item.id}-${item.role}`}>
                          <Link
                            href={item.url}
                            className="group surface-card hover:surface-card-hover block h-full px-5 py-4 no-underline"
                          >
                            <span className="eyebrow block">
                              {role ?? COLLECTION_SINGULAR[item.collection]}
                            </span>
                            <span className="font-display group-hover:text-wine mt-1.5 block text-lg leading-snug transition-colors">
                              {item.title}
                            </span>
                            {date && (
                              <span className="label-caps numerals text-ink-faint mt-2 block">
                                {date}
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

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
