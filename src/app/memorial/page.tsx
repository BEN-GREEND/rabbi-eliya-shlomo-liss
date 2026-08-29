import type { Metadata } from 'next'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { Rule } from '@/components/primitives/Rule'
import { MemorialCandle } from '@/components/memorial/MemorialCandle'

export const metadata: Metadata = { title: 'נר זכרון' }

/**
 * The memorial page.
 *
 * The stillest page on the site: a great deal of space, one candle, one line.
 * The page is static; only the count is fetched, by the candle itself.
 */
export default function MemorialPage() {
  const site = getSite()

  return (
    <div className="from-stone/70 via-paper to-paper relative isolate overflow-x-clip bg-gradient-to-b">
      <Container width="narrow" className="py-24 lg:py-32">
        <div className="text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-3">
            <span aria-hidden="true" className="bg-wine-line/40 h-px w-8" />
            <p className="eyebrow">{site.memorial.title}</p>
            <span aria-hidden="true" className="bg-wine-line/40 h-px w-8" />
          </div>
          <h1 className="font-display text-4xl leading-[1.15] sm:text-5xl lg:text-[3.5rem]">
            {site.name}
          </h1>
        </div>

        <div className="mt-24">
          <MemorialCandle />
        </div>

        {site.memorial.text && (
          <>
            <Rule className="mt-28" />
            <p className="font-display text-ink-soft mx-auto mt-12 max-w-[34rem] text-center text-lg leading-relaxed">
              {site.memorial.text}
            </p>
          </>
        )}

        <p className="label-caps text-ink-faint mx-auto mt-24 max-w-[30rem] text-center">
          לא נשמר כל מידע מזהה. אין הרשמה, ואין צורך למסור שם.
        </p>
      </Container>
    </div>
  )
}
