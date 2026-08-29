import Link from 'next/link'
import { getById } from '@/lib/content'

export interface SourceRef {
  source: string
  locator?: string
  note?: string
}

const CONFIDENCE_LABELS: Record<string, string> = {
  high: 'ודאות גבוהה',
  medium: 'ודאות בינונית',
  low: 'ודאות נמוכה',
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  primary: 'מקור ראשוני',
  firsthand: 'עדות ישירה',
  contemporary: 'מקור בן־זמנו',
  retrospective: 'מקור רטרוספקטיבי',
  family: 'מקור משפחתי',
  secondary: 'מקור משני',
  unverified: 'לא מאומת',
}

const STATUS_LABELS: Record<string, string> = {
  obtained: 'נקרא במלואו',
  located: 'אותר — טרם נקרא',
  sought: 'טרם אותר',
}

/**
 * Provenance, kept quiet.
 *
 * A visitor reading the life of the Rabbi should not be made to walk through
 * an apparatus of footnotes. The sources are always there and always one
 * click away — a closed disclosure in small type at the foot of the item —
 * but they do not compete with the exhibit itself.
 *
 * Internal research questions live inside the same disclosure. They matter to
 * whoever continues the work; they are not what a visitor came for.
 */
export function Provenance({
  sources = [],
  confidence,
  researchNote,
  researchNeeded,
  canonical,
}: {
  sources?: SourceRef[]
  confidence?: string
  researchNote?: string
  researchNeeded?: boolean
  canonical?: boolean
}) {
  if (!sources.length && !researchNote) return null

  return (
    <details className="border-rule mt-16 border-t pt-5 [&[open]_.marker]:rotate-90">
      <summary className="label-caps text-ink-faint hover:text-brass flex cursor-pointer list-none items-center gap-2 transition-colors [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="marker inline-block transition-transform duration-200">
          ‹
        </span>
        מקורות
        {sources.length > 0 && <span className="numerals">({sources.length})</span>}
      </summary>

      <div className="mt-5 max-w-[42rem] text-[0.9rem]">
        {sources.length > 0 && (
          <ul className="space-y-3">
            {sources.map((ref) => {
              const item = getById(ref.source)
              if (!item) return null
              const sd = item.data as Record<string, unknown>
              const facts = [
                SOURCE_TYPE_LABELS[sd.sourceType as string],
                sd.author as string | undefined,
                sd.publication as string | undefined,
                sd.issue as string | undefined,
                sd.hebrewYear as string | undefined,
                ref.locator ?? (sd.pageRef as string | undefined),
                STATUS_LABELS[sd.status as string],
              ].filter(Boolean)

              return (
                <li key={ref.source}>
                  <Link
                    href={item.url}
                    className="text-ink no-underline underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <span className="label-caps text-ink-faint ms-2">{facts.join(' · ')}</span>
                  {sd.publicSource === true && typeof sd.url === 'string' && (
                    <a
                      href={sd.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-caps text-brass ms-2 no-underline hover:underline"
                    >
                      למקור המקוון ↗
                    </a>
                  )}
                  {ref.note && <p className="text-ink-soft mt-0.5">{ref.note}</p>}
                </li>
              )
            })}
          </ul>
        )}

        <p className="label-caps text-ink-faint mt-4">
          {canonical
            ? 'פרט מוסמך — נקבע על פי המקור המשפחתי'
            : confidence
              ? CONFIDENCE_LABELS[confidence]
              : null}
        </p>

        {researchNote && (
          <div className="border-rule text-ink-soft mt-4 border-s-2 ps-4">
            <p className="label-caps text-ink-faint">
              {researchNeeded ? 'עדיין במחקר' : 'הערת מקור'}
            </p>
            <p className="mt-1 leading-relaxed">{researchNote}</p>
          </div>
        )}
      </div>
    </details>
  )
}
