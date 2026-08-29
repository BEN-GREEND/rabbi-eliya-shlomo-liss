import { getReal } from '@/lib/content'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { ButtonLink } from '@/components/primitives/Button'
import { Portrait } from './Portrait'

/**
 * The opening composition.
 *
 * A stone ground rather than plain paper, so the page starts with weight. The
 * name is set at the largest size on the site and broken across three lines,
 * with a wine rule and the life years beneath it, and the portrait plate sits
 * lower and narrower on the trailing side.
 *
 * The earliest recorded year stands behind the text column at exhibition scale
 * — inside that column, not across the whole section, so the whole numeral is
 * readable rather than half-hidden behind the plate.
 *
 * Two actions, ranked: into the life, or into the archive.
 */
export function Hero() {
  const site = getSite()

  const years = getReal('timeline')
    .map((item) => (item.data as { year?: number }).year)
    .filter((y): y is number => typeof y === 'number')
  const earliest = years.length ? Math.min(...years) : null

  return (
    <section className="paper-grain from-stone via-paper-deep to-paper relative isolate overflow-hidden bg-gradient-to-b">
      <Container width="wide" className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            {earliest !== null && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] -z-10 hidden justify-center lg:flex"
              >
                <span
                  dir="ltr"
                  className="numerals font-display text-brass-line/[0.16] text-[13rem] leading-none font-light xl:text-[16rem]"
                >
                  {earliest}
                </span>
              </div>
            )}

            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="bg-wine/60 h-px w-8" />
              ארכיון · מורשת
            </p>

            <h1 className="font-display mt-7 leading-[0.92]">
              <span className="text-ink-soft block text-[1.75rem] font-light sm:text-3xl">הרב</span>
              <span className="mt-2.5 block text-[3.5rem] sm:text-7xl lg:text-[5.75rem]">
                אליהו שלמה
              </span>
              <span className="mt-1 block text-[3.5rem] sm:text-7xl lg:text-[5.75rem]">ליס</span>
            </h1>

            <div className="mt-8 flex items-center gap-5">
              <span aria-hidden="true" className="bg-wine h-px w-16" />
              <span dir="ltr" className="label-caps numerals text-wine">
                1901–1963
              </span>
            </div>

            {site.tagline && (
              <p className="font-display text-ink-soft mt-8 max-w-[34rem] text-xl leading-relaxed sm:text-2xl">
                {site.tagline}
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/timeline" variant="primary" arrow>
                תולדות חייו
              </ButtonLink>
              <ButtonLink href="/archive" variant="secondary">
                אל הארכיון
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5 lg:translate-y-10">
            <div className="mx-auto max-w-[24rem] lg:me-0">
              <Portrait />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
