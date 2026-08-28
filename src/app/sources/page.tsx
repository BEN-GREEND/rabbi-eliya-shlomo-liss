import type { Metadata } from 'next'
import Link from 'next/link'
import { getAll } from '@/lib/content'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'

export const metadata: Metadata = { title: 'מקורות' }

const TYPE_LABELS: Record<string, string> = {
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
 * The bibliography.
 *
 * Published rather than hidden: an archive that shows its sources — including
 * the ones it has not yet read — is making a claim a visitor can check.
 */
export default function SourcesPage() {
  const sources = getAll('sources')
  const read = sources.filter((s) => s.data.status === 'obtained')
  const outstanding = sources.filter((s) => s.data.status !== 'obtained')

  const row = (item: (typeof sources)[number]) => {
    const d = item.data as Record<string, unknown>
    const facts = [
      TYPE_LABELS[d.sourceType as string],
      d.author as string,
      d.publication as string,
      d.issue as string,
      d.hebrewYear as string,
      d.pageRef as string,
    ].filter(Boolean)

    return (
      <li key={item.id}>
        <Link
          href={item.url}
          className="group border-rule hover:border-brass block border-s py-3 ps-5 no-underline transition-colors"
        >
          <span className="font-display group-hover:text-brass block text-xl leading-snug transition-colors">
            {item.title}
          </span>
          <span className="label-caps text-ink-faint mt-1 block">{facts.join(' · ')}</span>
          <span className="label-caps text-brass mt-1 block">
            {STATUS_LABELS[d.status as string]}
            {d.priority === 'very-high' && ' · עדיפות גבוהה'}
          </span>
        </Link>
      </li>
    )
  }

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="mb-14">
        <p className="label-caps text-brass">אוסף</p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">מקורות</h1>
        <p className="text-ink-soft mt-5 max-w-[38rem]">
          כל עובדה באתר מפנה למקור שממנו הגיעה, ולרמת הקרבה שלו לאירועים. גם מקורות שאותרו אך טרם
          נקראו מופיעים כאן — לדעת מה עוד לא קראנו הוא חלק מן הארכיון.
        </p>
      </header>

      {sources.length === 0 ? (
        <PlaceholderNotice>טרם הוזנו מקורות</PlaceholderNotice>
      ) : (
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
          <section aria-labelledby="read-heading">
            <h2 id="read-heading" className="label-caps text-ink-faint mb-4">
              נקראו במלואם
            </h2>
            <ul className="space-y-1">{read.map(row)}</ul>
          </section>
          <section aria-labelledby="outstanding-heading">
            <h2 id="outstanding-heading" className="label-caps text-ink-faint mb-4">
              ממתינים להשגה
            </h2>
            <ul className="space-y-1">{outstanding.map(row)}</ul>
          </section>
        </div>
      )}
    </Container>
  )
}
