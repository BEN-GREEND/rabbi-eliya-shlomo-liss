import Link from 'next/link'
import { getById } from '@/lib/content'
import { Rule } from '@/components/primitives/Rule'

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
 * "מניין אנחנו יודעים" — the provenance block.
 *
 * This is what separates an archive from a blog. Every claim on the site can
 * be traced to the record it came from, how close that record stands to the
 * events, and how much weight it carries. A visitor who wants to check us
 * can; a future editor who wants to correct us knows where to look.
 */
export function Provenance({
  sources = [],
  confidence,
  researchNote,
  researchNeeded,
}: {
  sources?: SourceRef[]
  confidence?: string
  researchNote?: string
  researchNeeded?: boolean
}) {
  if (!sources.length && !researchNote && !researchNeeded) return null

  return (
    <section className="mt-16" aria-labelledby="provenance-heading">
      <Rule />
      <h2 id="provenance-heading" className="label-caps text-brass mt-6">
        מניין אנחנו יודעים
      </h2>

      {sources.length > 0 && (
        <ul className="mt-5 space-y-4">
          {sources.map((ref) => {
            const item = getById(ref.source)
            if (!item) return null
            const d = item.data as Record<string, unknown>
            const facts = [
              SOURCE_TYPE_LABELS[d.sourceType as string],
              d.author as string | undefined,
              d.publication as string | undefined,
              d.issue as string | undefined,
              d.hebrewYear as string | undefined,
              ref.locator ?? (d.pageRef as string | undefined),
              STATUS_LABELS[d.status as string],
            ].filter(Boolean)

            return (
              <li key={ref.source} className="border-rule border-s ps-4">
                <Link
                  href={item.url}
                  className="font-display hover:text-brass text-[1.0625rem] no-underline transition-colors"
                >
                  {item.title}
                </Link>
                <p className="label-caps text-ink-faint mt-1">{facts.join(' · ')}</p>
                {ref.note && <p className="text-ink-soft mt-1 text-[0.9rem]">{ref.note}</p>}
              </li>
            )
          })}
        </ul>
      )}

      {confidence && (
        <p className="label-caps text-ink-faint mt-5">
          רמת ודאות: <span className="text-ink-soft">{CONFIDENCE_LABELS[confidence]}</span>
        </p>
      )}

      {(researchNote || researchNeeded) && (
        <div className="border-brass-line/50 bg-paper-deep/50 mt-6 border-s-2 px-5 py-4">
          <p className="label-caps text-brass">
            {researchNeeded ? 'שאלה פתוחה במחקר' : 'הערת מחקר'}
          </p>
          {researchNote && (
            <p className="text-ink-soft mt-2 max-w-[42rem] text-[0.95rem] leading-relaxed">
              {researchNote}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

/**
 * A compact marker for lists: enough to warn a reader that an item rests on a
 * secondary source, without the full apparatus.
 */
export function ConfidenceMark({ confidence }: { confidence?: string }) {
  if (!confidence || confidence === 'high') return null
  return (
    <span className="label-caps text-ink-faint" title={CONFIDENCE_LABELS[confidence]}>
      {confidence === 'low' ? 'טעון אימות' : 'מקור משני'}
    </span>
  )
}
