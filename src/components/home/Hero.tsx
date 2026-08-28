import { getReal } from '@/lib/content'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { YearMark } from '@/components/primitives/YearMark'
import { Portrait } from './Portrait'

/**
 * The opening composition.
 *
 * Asymmetric on purpose: the name occupies the leading two thirds at
 * exhibition scale, the portrait plate sits lower and narrower on the
 * trailing side, and a brass hairline ties them together. Not an image with
 * a headline on top of it.
 *
 * The oversized year appears only when real dated content exists. Right now
 * none does, so nothing is shown — the site never invents a date to decorate
 * with.
 */
export function Hero() {
  const site = getSite()

  const datedYears = getReal('timeline')
    .map((item) => (item.data as { year?: number }).year)
    .filter((y): y is number => typeof y === 'number')
  const earliestYear = datedYears.length ? Math.min(...datedYears) : null

  return (
    <section className="paper-grain border-rule relative overflow-hidden border-b">
      {earliestYear !== null && (
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 -z-10 hidden justify-center lg:flex">
          <YearMark year={earliestYear} size="xl" />
        </div>
      )}

      <Container width="wide" className="pt-20 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-12">
          {/* Name — the leading side */}
          <div className="lg:col-span-7">
            <p className="label-caps text-brass">ארכיון · מורשת</p>

            <h1 className="font-display mt-7 leading-[0.95]">
              <span className="text-ink-soft block text-[1.75rem] font-light sm:text-3xl">הרב</span>
              <span className="mt-2 block text-[3.25rem] sm:text-7xl lg:text-[5.5rem]">
                אליהו שלמה
              </span>
              <span className="mt-1 block text-[3.25rem] sm:text-7xl lg:text-[5.5rem]">ליס</span>
            </h1>

            <div aria-hidden="true" className="bg-brass mt-9 h-px w-20" />

            <div className="mt-8 max-w-[34rem]">
              {site.tagline ? (
                <p className="font-display text-ink-soft text-xl leading-relaxed sm:text-2xl">
                  {site.tagline}
                </p>
              ) : (
                <PlaceholderNotice>שורת משנה — טרם הוזנה</PlaceholderNotice>
              )}
            </div>
          </div>

          {/* Narrower than its column and dropped below the name's baseline —
              the asymmetry that keeps this from reading as a two-column header. */}
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
