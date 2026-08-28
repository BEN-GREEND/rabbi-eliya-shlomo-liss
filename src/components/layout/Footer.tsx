import Link from 'next/link'
import { COLLECTION_LABELS, COLLECTION_ROUTES, COLLECTIONS } from '@/lib/content/types'
import { MEMORIAL_LINK } from '@/lib/nav'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { CandleGlyph } from './CandleGlyph'

export function Footer() {
  const site = getSite()

  return (
    <footer className="paper-grain border-rule-deep bg-deep text-paper mt-32 border-t">
      <Container width="wide" className="py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_auto]">
          <div>
            <p className="font-display text-2xl leading-tight">{site.name}</p>
            <p className="text-paper/60 mt-3 max-w-sm text-[0.95rem] leading-relaxed">
              {site.description}
            </p>
          </div>

          <nav aria-label="ניווט תחתון">
            <p className="label-caps text-brass-soft mb-4">אוספים</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.95rem]">
              {COLLECTIONS.map((c) => (
                <li key={c}>
                  <Link
                    href={COLLECTION_ROUTES[c]}
                    className="text-paper/70 hover:text-paper no-underline transition-colors"
                  >
                    {COLLECTION_LABELS[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-caps text-brass-soft mb-4">הנצחה</p>
            <Link
              href={MEMORIAL_LINK.href}
              className="text-paper/70 hover:text-paper inline-flex items-center gap-2.5 text-[0.95rem] no-underline transition-colors"
            >
              <CandleGlyph className="text-brass-soft h-5 w-3" />
              {MEMORIAL_LINK.label}
            </Link>
          </div>
        </div>

        <p className="label-caps border-rule-deep text-paper/55 mt-16 border-t pt-8">
          אתר מורשת · כל הזכויות שמורות
        </p>
      </Container>
    </footer>
  )
}
