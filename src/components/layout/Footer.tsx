import Link from 'next/link'
import { BROWSABLE_COLLECTIONS, COLLECTION_LABELS, COLLECTION_ROUTES } from '@/lib/content/types'
import { MEMORIAL_LINK, SEARCH_LINK } from '@/lib/nav'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { COLLECTION_GLYPH, Glyph } from '@/components/primitives/Glyph'
import { CandleGlyph } from './CandleGlyph'
import { CandleCount } from './CandleCount'
import { VisitorCount } from './VisitorCount'

/**
 * The footer.
 *
 * Built to read as the end of the building rather than a strip of links: a
 * brass thread across the top, the identity set as one tight block — name,
 * years on a brass rule directly beneath it, then the description — the
 * collections listed with their own marks, and the memorial given a block of
 * its own in wine that carries the live count of candles.
 */
export function Footer() {
  const site = getSite()

  return (
    <footer className="ground-deep paper-grain bg-navy-deep">
      <div className="via-brass-line/60 h-px bg-gradient-to-l from-transparent to-transparent" />

      <Container width="wide" className="py-16 lg:py-24">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[1.4fr_1fr_auto]">
          <div>
            <p className="font-display text-3xl leading-tight">{site.name}</p>
            {/* The years belong to the name: a short brass rule ties them to
                it rather than leaving them floating underneath. */}
            <p className="mt-2.5 flex items-center gap-3">
              <span aria-hidden="true" className="bg-brass-line h-px w-7 shrink-0" />
              <span dir="ltr" className="label-caps numerals text-brass-soft">
                1901–1963
              </span>
            </p>
            <p className="text-paper/65 mt-6 max-w-[26rem] text-[0.95rem] leading-relaxed">
              {site.description}
            </p>
          </div>

          <nav aria-label="ניווט תחתון">
            <p className="label-caps text-brass-soft mb-5">אוספים</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-[0.95rem]">
              {BROWSABLE_COLLECTIONS.map((c) => (
                <li key={c}>
                  <Link
                    href={COLLECTION_ROUTES[c]}
                    className="text-paper/70 hover:text-paper group flex items-center gap-2.5 no-underline transition-colors"
                  >
                    <Glyph
                      name={COLLECTION_GLYPH[c] ?? 'archive'}
                      className="text-brass-soft/60 group-hover:text-brass-soft h-4 w-4 transition-colors"
                    />
                    {COLLECTION_LABELS[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:min-w-[15rem]">
            <p className="label-caps text-brass-soft mb-5">הנצחה</p>
            <Link
              href={MEMORIAL_LINK.href}
              className="group bg-wine-deep border-brass-line/50 hover:bg-wine hover:border-brass-soft block border p-6 no-underline transition-colors duration-300"
            >
              <CandleGlyph className="text-brass-soft group-hover:text-brass-faint h-9 w-6 transition-colors" />
              <span className="font-display text-paper mt-3 block text-xl">
                {MEMORIAL_LINK.label}
              </span>
              <CandleCount />
              <span className="label-caps text-brass-soft/85 mt-4 block">להדלקת נר לזכרו</span>
            </Link>

            <Link
              href={SEARCH_LINK.href}
              className="text-paper/70 hover:text-paper mt-5 flex items-center gap-2.5 text-[0.95rem] no-underline transition-colors"
            >
              <Glyph name="search" className="text-brass-soft/60 h-4 w-4" />
              {SEARCH_LINK.label}
            </Link>
          </div>
        </div>

        <div className="border-rule-navy mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-8">
          <p className="label-caps text-paper/55">אתר מורשת · כל הזכויות שמורות</p>
          <span className="ms-auto">
            <VisitorCount />
          </span>
        </div>
      </Container>
    </footer>
  )
}
