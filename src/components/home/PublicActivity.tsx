import Link from 'next/link'
import { getReal } from '@/lib/content'
import { Numerals } from '@/components/primitives/Numerals'
import { HomeSection } from './HomeSection'

const KIND_LABELS: Record<string, string> = {
  institution: 'מוסד',
  role: 'תפקיד',
  community: 'קהילה',
  initiative: 'יוזמה',
  event: 'אירוע',
  enterprise: 'מפעל ציבורי',
}

/** "פעילותו" — areas of activity, each its own item. */
export function PublicActivity({ index }: { index: number }) {
  const items = getReal('activities').slice(0, 6)

  return (
    <HomeSection
      index={index}
      glyph="activity"
      ground="paper"
      title="פעילות ציבורית"
      href="/activities"
      empty={items.length === 0}
    >
      <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const d = item.data as Record<string, unknown>
          const years =
            typeof d.startYear === 'number'
              ? `${d.startYear}${d.ongoing ? '—' : d.endYear ? `–${d.endYear}` : ''}`
              : null
          return (
            <li key={item.id}>
              <Link
                href={item.url}
                className="group border-rule hover:border-brass block border-t pt-5 no-underline transition-colors"
              >
                <p className="label-caps text-brass">
                  {KIND_LABELS[d.kind as string]}
                  {years && (
                    <>
                      <span aria-hidden="true"> · </span>
                      <Numerals>{years}</Numerals>
                    </>
                  )}
                </p>
                <p className="font-display group-hover:text-brass mt-2 text-xl leading-snug transition-colors">
                  {item.title}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
