import Image from 'next/image'
import Link from 'next/link'
import { assetExists } from '@/lib/assets'
import { getDailyItem } from '@/lib/content'
import { Container } from '@/components/primitives/Container'
import { formatDate } from '@/lib/utils/format'

const DOC_LABELS: Record<string, string> = {
  letter: 'מכתב',
  manuscript: 'כתב יד',
  certificate: 'תעודה',
  invitation: 'הזמנה',
  article: 'כתבה',
  scan: 'סריקה',
  document: 'מסמך',
}

/**
 * "פריט מהארכיון" — one document, changing daily.
 *
 * The pick is deterministic (day of year modulo the collection size), so the
 * page stays fully static while still feeling like a living archive.
 *
 * This is the one section on a paper-white page that sits on the deep ground,
 * the way a single lit case does in a dim room.
 */
export function FromTheArchive() {
  const item = getDailyItem('archive')
  if (!item) return null

  const d = item.data as Record<string, unknown>
  const preview = (d.preview as { src?: string; alt?: string } | undefined) ?? {}
  const hasPreview = assetExists(preview.src)
  const docType = DOC_LABELS[d.docType as string]
  const date = formatDate(d)

  return (
    <section className="ground-deep paper-grain">
      <Container width="wide" className="py-20 lg:py-28">
        <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label-caps text-brass-soft tracking-[var(--tracking-wide-label)]">
              פריט מהארכיון
            </p>
            <h2 className="font-display mt-5 max-w-[20ch] text-3xl leading-tight sm:text-4xl">
              {item.title}
            </h2>
            {(docType || date) && (
              <p className="label-caps text-paper/70 mt-4">
                {[docType, date].filter(Boolean).join(' · ')}
              </p>
            )}
            {typeof d.description === 'string' && d.description && (
              <p className="text-paper/75 mt-5 max-w-[38rem] leading-relaxed">{d.description}</p>
            )}
            <Link
              href={item.url}
              className="label-caps border-brass text-paper hover:text-brass-soft mt-8 inline-block border-b pb-1 no-underline transition-colors"
            >
              לצפייה במסמך
            </Link>
          </div>
          <div className="lg:col-span-5">
            {hasPreview && preview.src ? (
              <div className="border-brass/25 relative aspect-[4/3] overflow-hidden border">
                <Image
                  src={preview.src}
                  alt={preview.alt ?? item.title}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="border-brass/25 flex aspect-[4/3] items-center justify-center border border-dashed">
                <p className="label-caps text-paper/55">סריקה טרם הועלתה</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
