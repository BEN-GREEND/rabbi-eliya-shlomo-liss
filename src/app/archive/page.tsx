import type { Metadata } from 'next'
import { assetExists } from '@/lib/assets'
import { getAll, getById } from '@/lib/content'
import { DOC_TYPE_LABELS } from '@/lib/doc-types'
import { formatDate } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { EmptyState } from '@/components/primitives/EmptyState'
import { ArchiveTable, type ArchiveDoc, type Drawer } from '@/components/archive/ArchiveTable'

export const metadata: Metadata = { title: 'ארכיון' }

function personRef(id: unknown) {
  if (typeof id !== 'string') return null
  const person = getById(id)
  if (!person) return null
  const d = person.data as { displayName?: string; name?: string }
  return { url: person.url, name: d.displayName || d.name || person.title }
}

export default function ArchivePage() {
  const docs: ArchiveDoc[] = getAll('archive').map((item) => {
    const d = item.data as Record<string, unknown>
    const preview = d.preview as { src: string; alt: string } | undefined
    const docType = (d.docType as string) ?? 'document'

    return {
      id: item.id,
      url: item.url,
      title: item.title,
      description: (d.description as string) ?? null,
      date: formatDate(d),
      docType,
      docTypeLabel: DOC_TYPE_LABELS[docType] ?? 'מסמך',
      assetStatus: (d.assetStatus as string) ?? 'present',
      preview: assetExists(preview?.src) && preview ? preview : null,
      custodian: personRef(d.custodian),
      author: personRef(d.author),
      recipient: personRef(d.recipient),
      source: (d.source as string) ?? null,
    }
  })

  // Drawers are the document types actually present, in a fixed order.
  const drawers: Drawer[] = Object.entries(DOC_TYPE_LABELS)
    .map(([id, title]) => ({ id, title, count: docs.filter((d) => d.docType === id).length }))
    .filter((d) => d.count > 0)

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="mb-12">
        <SectionHeading eyebrow="אוסף" title="ארכיון" glyph="archive" as="h1" index={docs.length} />
        <p className="text-ink-soft mt-6 max-w-[38rem] leading-relaxed">
          מכתבים, כתבי יד, תעודות ומסמכים. הארכיון מקטלג גם מוצגים שאינם בידיו — כאלה שנשמרים אצל
          המשפחה, כאלה שטרם נסרקו, וכאלה שאבדו. לכל פריט מצוין מה בדיוק ידוע עליו.
        </p>
      </header>

      {docs.length === 0 ? (
        <EmptyState
          glyph="archive"
          title="ארכיון שממתין למסמכים"
          note="טרם הוזנו מסמכים לארכיון."
        />
      ) : (
        <ArchiveTable docs={docs} drawers={drawers} />
      )}
    </Container>
  )
}
