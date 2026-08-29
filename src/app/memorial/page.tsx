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
    <Container width="narrow" className="py-24 lg:py-32">
      <div className="text-center">
        <p className="label-caps text-brass tracking-[var(--tracking-wide-label)]">
          {site.memorial.title}
        </p>
        <h1 className="font-display mt-5 text-4xl leading-tight sm:text-5xl">{site.name}</h1>
      </div>

      <div className="mt-20">
        <MemorialCandle />
      </div>

      {site.memorial.text && (
        <>
          <Rule className="mt-24" />
          <p className="text-ink-soft mx-auto mt-10 max-w-[34rem] text-center leading-relaxed">
            {site.memorial.text}
          </p>
        </>
      )}

      <p className="label-caps text-ink-faint mx-auto mt-24 max-w-[30rem] text-center">
        לא נשמר כל מידע מזהה. אין הרשמה, ואין צורך למסור שם.
      </p>
    </Container>
  )
}
