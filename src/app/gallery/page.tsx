import type { Metadata } from 'next'
import { assetExists } from '@/lib/assets'
import { getAll, getById, loadVocab, placeById } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { EmptyState } from '@/components/primitives/EmptyState'
import { GalleryWall, type Filter, type GalleryPhoto } from '@/components/gallery/GalleryWall'

export const metadata: Metadata = { title: 'גלריה' }

export default function GalleryPage() {
  const photos: GalleryPhoto[] = getAll('gallery').map((item) => {
    const d = item.data as Record<string, unknown>
    const image = d.image as { src: string; alt: string } | undefined
    const places = ((d.places as string[]) ?? [])
      .map((p) => placeById(p)?.name)
      .filter(Boolean)
      .join(' · ')

    return {
      id: item.id,
      url: item.url,
      title: item.title,
      description: (d.description as string) ?? null,
      date: formatDate(d),
      place: places || (d.location as string) || null,
      photographer: (d.photographer as string) ?? null,
      source: (d.source as string) ?? null,
      credit: (d.credit as string) ?? null,
      copyright: (d.copyright as string) ?? null,
      categories: (d.categories as string[]) ?? [],
      emphasis: (d.emphasis as GalleryPhoto['emphasis']) ?? 'medium',
      assetStatus: (d.assetStatus as string) ?? 'present',
      image: assetExists(image?.src) && image ? image : null,
      people: ((d.people as string[]) ?? []).flatMap((id) => {
        const person = getById(id)
        if (!person) return []
        const pd = person.data as { displayName?: string; name?: string }
        return [{ id, url: person.url, name: pd.displayName || pd.name || person.title }]
      }),
    }
  })

  const filters: Filter[] = loadVocab()
    .categories.gallery.map((term) => ({
      id: term.id,
      title: term.title,
      count: photos.filter((p) => p.categories.includes(term.id)).length,
    }))
    .filter((f) => f.count > 0)

  const awaiting = photos.filter((p) => !p.image).length

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="mb-12">
        <SectionHeading
          eyebrow="אוסף"
          title="גלריה"
          glyph="gallery"
          as="h1"
          index={photos.length}
        />
        <p className="text-ink-soft mt-6 max-w-[38rem] leading-relaxed">
          תצלומים מן הארכיון. לכל תצלום כיתוב מלא — תאריך, מקום, מי מופיע בו ומקורו. אנשים המזוהים
          בתמונה מקושרים לדף האישיות שלהם.
        </p>
        {awaiting > 0 && (
          <p className="label-caps text-ink-faint mt-4">
            {photos.length === awaiting
              ? 'התצלומים טרם הועלו. הכיתובים כבר כאן, והלוחות יתמלאו עם קבלת הקבצים.'
              : `${awaiting} מן התצלומים טרם הועלו`}
          </p>
        )}
      </header>

      {photos.length === 0 ? (
        <EmptyState glyph="gallery" title="אולם שממתין לתצלומים" note="טרם הוזנו תמונות לאוסף." />
      ) : (
        <GalleryWall photos={photos} filters={filters} />
      )}
    </Container>
  )
}
