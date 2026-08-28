import Link from 'next/link'
import { COLLECTION_LABELS, COLLECTION_ROUTES, COLLECTIONS, getAll } from '@/lib/content'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Rule } from '@/components/primitives/Rule'

/**
 * Stage 2 home shell.
 *
 * Enough to prove the design system and the content pipeline. The museum
 * hero composition — portrait, oversized year, selected exhibits — is
 * stage 3.
 */
export default function HomePage() {
  const site = getSite()

  return (
    <>
      <section className="paper-grain border-rule relative overflow-hidden border-b">
        <Container width="wide" className="py-28 lg:py-40">
          <p className="label-caps text-brass">ארכיון · מורשת</p>

          <h1 className="font-display mt-6 text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-7xl">
            {site.name}
          </h1>

          <div className="mt-8 max-w-[38rem]">
            {site.tagline ? (
              <p className="font-display text-ink-soft text-xl leading-relaxed sm:text-2xl">
                {site.tagline}
              </p>
            ) : (
              <PlaceholderNotice>שורת משנה — טרם הוזנה</PlaceholderNotice>
            )}
          </div>

          <div className="mt-10 max-w-[38rem]">
            {site.intro ? (
              <p className="text-ink-soft leading-relaxed">{site.intro}</p>
            ) : (
              <PlaceholderNotice>פסקת הקדמה — טרם הוזנה</PlaceholderNotice>
            )}
          </div>
        </Container>
      </section>

      <Container width="wide" className="py-20 lg:py-28">
        <h2 className="label-caps text-brass">אוספי הארכיון</h2>
        <Rule className="mt-4" />

        <ul className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((collection) => {
            const count = getAll(collection).length
            return (
              <li key={collection}>
                <Link
                  href={COLLECTION_ROUTES[collection]}
                  className="group border-rule hover:border-brass block border-s ps-5 no-underline transition-colors"
                >
                  <p className="label-caps numerals text-ink-faint">
                    {count} {count === 1 ? 'פריט' : 'פריטים'}
                  </p>
                  <p className="font-display group-hover:text-brass mt-2 text-2xl transition-colors">
                    {COLLECTION_LABELS[collection]}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </>
  )
}
