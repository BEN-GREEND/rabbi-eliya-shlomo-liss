import Link from 'next/link'
import { getReal } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { HomeSection } from './HomeSection'
import { Glyph } from '@/components/primitives/Glyph'

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
      <ul className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const kind = KIND_LABELS[item.data.kind as string]
          const date = formatDate(item.data)
          return (
            <li key={item.id} className="group">
              <Link
                href={item.url}
                className="surface-card group-hover:surface-card-hover flex h-full flex-col px-6 py-6 no-underline"
              >
                <Glyph
                  name="torah"
                  className="text-brass-line/70 group-hover:text-brass absolute end-5 top-5 h-4 w-4 transition-colors"
                />
                <p className="eyebrow">{[kind, date].filter(Boolean).join(' · ')}</p>
                <p className="font-display group-hover:text-wine mt-3 text-2xl leading-snug transition-colors">
                  {item.title}
                </p>
                {typeof item.data.summary === 'string' && item.data.summary && (
                  <p className="text-ink-soft mt-3 text-[0.95rem] leading-relaxed">
                    {item.data.summary}
                  </p>
                )}
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
