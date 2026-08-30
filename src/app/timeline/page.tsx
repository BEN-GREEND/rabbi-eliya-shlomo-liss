import type { Metadata } from 'next'
import { getAll, getById, getBySlug, getRelated, periodById, placeById } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Prose } from '@/components/exhibit/Prose'
import { Provenance, type SourceRef } from '@/components/exhibit/Provenance'
import { Thread, type ThreadEvent } from '@/components/timeline/Thread'

export const metadata: Metadata = { title: 'תולדות חייו' }

/**
 * תולדות חייו — the biographical essay, then the thread of years.
 *
 * The essay lives in content/pages/biography.mdx and can be rewritten without
 * touching this file. Everything the thread needs is resolved here, on the
 * server, so the client component ships data rather than the content layer.
 */
export default function TimelinePage() {
  const biography = getBySlug('pages', 'biography')

  const events: ThreadEvent[] = getAll('timeline').map((item) => {
    const d = item.data as Record<string, unknown>
    const period = typeof d.period === 'string' ? periodById(d.period) : undefined
    const placeIds = (d.places as string[]) ?? []
    const place =
      placeIds
        .map((p) => placeById(p)?.name)
        .filter(Boolean)
        .join(' · ') ||
      (d.location as string | undefined) ||
      null

    return {
      id: item.id,
      url: item.url,
      title: item.title,
      summary: (d.summary as string) ?? null,
      date: formatDate(d),
      hebrewDate: (d.hebrewDate as string) ?? null,
      year: typeof d.year === 'number' ? d.year : null,
      undated: d.undated === true,
      periodId: (d.period as string) ?? null,
      periodTitle: period?.title ?? null,
      place,
      people: ((d.people as string[]) ?? []).flatMap((id) => {
        const person = getById(id)
        if (!person) return []
        const pd = person.data as { displayName?: string; name?: string }
        return [{ id, url: person.url, name: pd.displayName || pd.name || person.title }]
      }),
      relatedCount: getRelated(item.id).length,
    }
  })

  return (
    <>
      <Container width="wide" className="pt-12 lg:pt-16">
        <SectionHeading
          eyebrow="תולדות חייו"
          title="הרב אליהו שלמה ליס"
          glyph="person"
          as="h1"
          className="[&_h1]:text-4xl sm:[&_h1]:text-5xl lg:[&_h1]:text-6xl"
        />
        {biography && (
          <div className="mt-10">
            <Prose source={biography.body} />
            <Provenance
              sources={(biography.data.sources as SourceRef[] | undefined) ?? []}
              confidence={biography.data.confidence as string | undefined}
              canonical={biography.data.canonical as boolean | undefined}
            />
          </div>
        )}
      </Container>

      <Container width="wide" className="pt-20 pb-24 lg:pt-28">
        <SectionHeading eyebrow="חוט השנים" title="ציר הזמן" glyph="timeline" className="mb-14" />
        <Thread events={events} />
      </Container>
    </>
  )
}
