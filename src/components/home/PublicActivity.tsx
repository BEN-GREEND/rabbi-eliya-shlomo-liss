import Link from 'next/link'
import { getReal } from '@/lib/content'
import { Numerals } from '@/components/primitives/Numerals'
import { Glyph } from '@/components/primitives/Glyph'
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
      ground="stone"
      title="פעילות ציבורית"
      href="/activities"
      empty={items.length === 0}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const d = item.data as Record<string, unknown>
          const years =
            typeof d.startYear === 'number'
              ? `${d.startYear}${d.ongoing ? '—' : d.endYear ? `–${d.endYear}` : ''}`
              : null
          return (
            <li key={item.id} className="group">
              <Link
                href={item.url}
                className="surface-card group-hover:surface-card-hover flex h-full flex-col px-6 py-6 no-underline"
              >
                <Glyph
                  name="activity"
                  className="text-brass-line/70 group-hover:text-brass absolute end-5 top-5 h-4 w-4 transition-colors"
                />
                <p className="eyebrow">
                  {KIND_LABELS[d.kind as string]}
                  {years && (
                    <>
                      <span aria-hidden="true"> · </span>
                      <Numerals>{years}</Numerals>
                    </>
                  )}
                </p>
                <p className="font-display group-hover:text-wine mt-3 text-xl leading-snug transition-colors">
                  {item.title}
                </p>
                <span
                  aria-hidden="true"
                  className="border-rule-soft mt-auto flex items-center gap-2 border-t pt-4"
                >
                  <span className="bg-brass-line/0 group-hover:bg-brass-line h-px flex-1 transition-colors duration-300" />
                  <Glyph
                    name="arrow"
                    className="arrow-slide group-hover:arrow-slide-hover text-brass-line group-hover:text-wine h-4 w-4 transition-colors"
                  />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
