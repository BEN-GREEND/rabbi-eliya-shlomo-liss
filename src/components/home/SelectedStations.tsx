import Link from 'next/link'
import { getReal } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { HomeSection } from './HomeSection'

/**
 * "תחנות בחייו" — a few events, shown as a horizontal run of the brass
 * spine that carries the full timeline page.
 */
export function SelectedStations({ index }: { index: number }) {
  const stations = getReal('timeline')
    .filter((item) => item.data.featured)
    .slice(0, 4)
  const fallback = getReal('timeline').slice(0, 4)
  const items = stations.length ? stations : fallback

  return (
    <HomeSection
      index={index}
      glyph="timeline"
      ground="paper"
      title="תחנות בחייו"
      eyebrow="ציר הזמן"
      href="/timeline"
      linkLabel="לציר הזמן המלא"
      empty={items.length === 0}
    >
      <ol className="relative grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* The spine, running behind the stations. */}
        <span
          aria-hidden="true"
          className="via-brass-line/60 absolute inset-x-0 top-2 hidden h-px bg-gradient-to-l from-transparent to-transparent lg:block"
        />
        {items.map((item) => {
          const date = formatDate(item.data)
          return (
            <li key={item.id} className="group relative">
              <span
                aria-hidden="true"
                className="bg-wine group-hover:bg-brass absolute start-0 -top-[3px] hidden h-2 w-2 rounded-full transition-colors lg:block"
              />
              <Link
                href={item.url}
                className="surface-card group-hover:surface-card-hover block h-full px-5 py-5 no-underline lg:mt-8"
              >
                <p className="font-display text-wine numerals text-[0.95rem] leading-none font-medium">
                  {date ?? (item.data.undated ? 'תקופה לא מתוארכת' : '')}
                </p>
                <p className="font-display group-hover:text-wine mt-3 text-xl leading-snug transition-colors">
                  {item.title}
                </p>
                {typeof item.data.summary === 'string' && item.data.summary && (
                  <p className="text-ink-soft mt-2.5 text-[0.95rem] leading-relaxed">
                    {item.data.summary}
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ol>
    </HomeSection>
  )
}
