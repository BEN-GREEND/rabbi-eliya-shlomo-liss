import Link from 'next/link'
import { getReal } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { HomeSection } from './HomeSection'

const KIND_LABELS: Record<string, string> = {
  article: 'מאמר',
  lecture: 'שיעור',
  excerpt: 'קטע',
  letter: 'מכתב',
  manuscript: 'כתב יד',
  quote: 'ציטוט',
}

/** "מתורתו" — a few selected teachings. */
export function FromHisTorah({ index }: { index: number }) {
  const all = getReal('torah')
  const items = (
    all.filter((i) => i.data.featured).length ? all.filter((i) => i.data.featured) : all
  ).slice(0, 3)

  return (
    <HomeSection
      index={index}
      glyph="torah"
      ground="stone"
      title="מתורתו"
      href="/torah"
      empty={items.length === 0}
    >
      <ul className="grid gap-x-12 gap-y-12 md:grid-cols-3">
        {items.map((item) => {
          const kind = KIND_LABELS[item.data.kind as string]
          const date = formatDate(item.data)
          return (
            <li key={item.id}>
              <Link
                href={item.url}
                className="group border-rule hover:border-brass block border-s ps-5 no-underline transition-colors"
              >
                <p className="label-caps text-brass">{[kind, date].filter(Boolean).join(' · ')}</p>
                <p className="font-display group-hover:text-brass mt-2.5 text-2xl leading-snug transition-colors">
                  {item.title}
                </p>
                {typeof item.data.summary === 'string' && item.data.summary && (
                  <p className="text-ink-soft mt-3 text-[0.95rem] leading-relaxed">
                    {item.data.summary}
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
