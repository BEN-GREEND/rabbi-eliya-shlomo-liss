import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { assetExists } from '@/lib/assets'
import {
  COLLECTION_LABELS,
  COLLECTION_SINGULAR,
  COLLECTIONS,
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
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Numerals } from '@/components/primitives/Numerals'
import { Rule } from '@/components/primitives/Rule'
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
  const grouped = COLLECTIONS.filter((c) => c !== 'people' && c !== 'sources')
    .map((collection) => ({
      collection,
      items: linked.filter((i) => i.collection === collection),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <Container width="default" className="py-20 lg:py-28">
      <article>
        <p className="label-caps text-brass">{COLLECTION_LABELS.people}</p>

        {/* ---- catalogue card ---- */}
        <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-[13rem_1fr]">
          <div className="border-rule bg-paper-deep relative aspect-[4/5] w-full max-w-[13rem] overflow-hidden border">
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
                className="font-display text-brass-line/20 absolute inset-0 flex items-center justify-center text-6xl"
              >
                {String((d.displayName ?? d.name ?? person.title) as string).charAt(0)}
              </span>
            )}
          </div>

          <div>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              {(d.displayName as string) || (d.name as string) || person.title}
            </h1>
            {years && (
              <p className="label-caps text-ink-soft mt-3">
                <Numerals>{years}</Numerals>
              </p>
            )}
            {typeof d.relationToRabbi === 'string' && d.relationToRabbi && (
              <p className="font-display text-ink-soft mt-4 max-w-[34rem] text-xl leading-relaxed">
                {d.relationToRabbi}
              </p>
            )}

            <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              <Fact label="נולד">{d.birthHebrewDate as string}</Fact>
              <Fact label="נפטר">{d.deathHebrewDate as string}</Fact>
              <Fact label="מקום לידה">{d.birthPlace as string}</Fact>
              <Fact label="מקום פטירה">{d.deathPlace as string}</Fact>
              <Fact label="מקום קבורה">{d.burialPlace as string}</Fact>
              <Fact label="תפקידים">{roles.length ? roles.join(' · ') : undefined}</Fact>
              <Fact label="מקומות">{places.length ? places.join(' · ') : undefined}</Fact>
              <Fact label="תקופות">{periods.length ? periods.join(' · ') : undefined}</Fact>
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

        <Rule className="my-12" />

        {typeof d.shortBio === 'string' && d.shortBio && (
          <p className="font-display mb-8 max-w-[38rem] text-xl leading-relaxed">{d.shortBio}</p>
        )}
        <Prose source={person.body} />

        {/* ---- ties to other people ---- */}
        {relations.length > 0 && (
          <section className="mt-16" aria-labelledby="relations-heading">
            <Rule />
            <h2 id="relations-heading" className="label-caps text-brass mt-6">
              קשרים
            </h2>
            <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {relations.map((rel) => {
                const other = getById(rel.person)
                if (!other) return null
                const od = other.data as { displayName?: string; name?: string }
                return (
                  <li key={`${rel.person}-${rel.type}`} className="border-rule border-s ps-4">
                    <span className="label-caps text-ink-faint">
                      {RELATION_LABELS[rel.type] ?? rel.type}
                    </span>
                    <Link
                      href={other.url}
                      className="font-display hover:text-brass mt-0.5 block text-lg no-underline transition-colors"
                    >
                      {od.displayName || od.name || other.title}
                    </Link>
                    {rel.note && <p className="text-ink-soft text-[0.9rem]">{rel.note}</p>}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* ---- everything in the archive that touches this person ---- */}
        {grouped.length > 0 && (
          <section className="mt-16" aria-labelledby="exhibits-heading">
            <Rule />
            <h2 id="exhibits-heading" className="label-caps text-brass mt-6">
              מוצגים הקשורים לאישיות
            </h2>

            <div className="mt-8 space-y-10">
              {grouped.map(({ collection, items }) => (
                <div key={collection}>
                  <h3 className="label-caps text-ink-faint">
                    {COLLECTION_LABELS[collection as Collection]}
                    <span className="numerals text-brass ms-2">{items.length}</span>
                  </h3>
                  <ul className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const date = formatDate(item.data)
                      const role = ROLE_LABELS[item.role]
                      return (
                        <li key={`${item.id}-${item.role}`}>
                          <Link
                            href={item.url}
                            className="group border-rule hover:border-brass block border-s ps-4 no-underline transition-colors"
                          >
                            <span className="label-caps text-ink-faint">
                              {role ?? COLLECTION_SINGULAR[item.collection]}
                            </span>
                            <span className="font-display group-hover:text-brass block text-lg leading-snug transition-colors">
                              {item.title}
                            </span>
                            {date && (
                              <span className="label-caps numerals text-ink-faint">{date}</span>
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
