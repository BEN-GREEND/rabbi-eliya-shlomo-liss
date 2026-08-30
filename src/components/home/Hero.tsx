import { getReal } from '@/lib/content'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { ButtonLink } from '@/components/primitives/Button'
import { Portrait } from './Portrait'

/**
 * The opening composition.
 *
 * Two rooms side by side rather than one page. The trailing side is a petrol
 * field, floor to ceiling, and the portrait hangs on it as an object hangs on
 * a gallery wall; the leading side stays paper, and carries the name at the
 * largest size on the site.
 *
 * The furniture around them is the museum's own: a catalogue line at the top,
 * a brass rule, the life years in wine, the earliest recorded year standing
 * behind the text at exhibition scale, and a drawn seal where the two rooms
 * meet. Everything decorative here is a real object from the building — none
 * of it is ornament for its own sake.
 */
export function Hero() {
  const site = getSite()

  const years = getReal('timeline')
    .map((item) => (item.data as { year?: number }).year)
    .filter((y): y is number => typeof y === 'number')
  const earliest = years.length ? Math.min(...years) : null

  return (
    <section className="relative isolate overflow-hidden">
      {/* The petrol room: a band on the trailing third, behind everything. */}
      <div
        aria-hidden="true"
        className="bg-navy absolute inset-y-0 -z-20 hidden lg:block"
        style={{ insetInlineEnd: 0, width: '42%' }}
      />
      <div
        aria-hidden="true"
        className="paper-grain from-stone via-paper-deep to-paper absolute inset-0 -z-30 bg-gradient-to-b lg:hidden"
      />
      <div
        aria-hidden="true"
        className="paper-grain from-stone via-paper-deep to-paper absolute inset-y-0 -z-30 hidden bg-gradient-to-b lg:block"
        style={{ insetInlineStart: 0, width: '58%' }}
      />
      {/* The brass seam where the two rooms meet. */}
      <div
        aria-hidden="true"
        className="via-brass-line/70 absolute inset-y-0 -z-10 hidden w-px bg-gradient-to-b from-transparent to-transparent lg:block"
        style={{ insetInlineEnd: '42%' }}
      />

      <Container width="wide" className="pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* The catalogue line, above everything. */}
        <div className="mb-14 flex items-center gap-4 lg:mb-20 lg:w-[54%]">
          <span className="eyebrow shrink-0">ארכיון · מורשת</span>
          <span aria-hidden="true" className="bg-brass-line/50 h-px flex-1" />
          <span dir="ltr" className="label-caps numerals text-brass shrink-0">
            1901–1963
          </span>
        </div>

        <div className="grid items-center gap-x-16 gap-y-16 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            {earliest !== null && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] -z-10 hidden justify-center lg:flex"
              >
                <span
                  dir="ltr"
                  className="numerals font-display text-brass-line/[0.18] text-[13rem] leading-none font-light xl:text-[16rem]"
                >
                  {earliest}
                </span>
              </div>
            )}

            <h1 className="font-display leading-[0.92]">
              <span className="text-ink-soft block text-[1.75rem] font-light sm:text-3xl">הרב</span>
              <span className="mt-2.5 block text-[3.5rem] sm:text-7xl lg:text-[5.75rem]">
                אליהו שלמה
              </span>
              <span className="mt-1 block text-[3.5rem] sm:text-7xl lg:text-[5.75rem]">ליס</span>
            </h1>

            <div className="mt-8 flex items-center gap-5">
              <span aria-hidden="true" className="bg-wine h-[2px] w-16" />
              <span dir="ltr" className="label-caps numerals text-wine">
                1901–1963
              </span>
            </div>

            {site.tagline && (
              <p className="font-display text-ink-soft mt-8 max-w-[34rem] text-xl leading-relaxed sm:text-2xl">
                {site.tagline}
              </p>
            )}

            <div className="mt-11 flex flex-wrap gap-3">
              <ButtonLink href="/timeline" variant="primary" arrow>
                תולדות חייו
              </ButtonLink>
              <ButtonLink href="/archive" variant="secondary">
                אל הארכיון
              </ButtonLink>
            </div>
          </div>

          {/* The object on the petrol wall.

              On a narrow screen there is no room for two rooms side by side,
              so the petrol comes with the portrait: the panel bleeds to both
              edges and the plate keeps its dark mount and its ivory label.
              Without this the label would be ivory on ivory. */}
          <div className="bg-navy -mx-6 px-6 py-14 sm:-mx-10 sm:px-10 lg:col-span-5 lg:mx-0 lg:translate-y-6 lg:bg-transparent lg:px-0 lg:py-0">
            <div className="mx-auto max-w-[23rem]">
              <Portrait onDeep />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
