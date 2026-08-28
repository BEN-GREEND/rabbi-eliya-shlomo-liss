import type { Metadata } from 'next'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'

export const metadata: Metadata = { title: 'נר זכרון' }

/** Stage 5 builds the candle, the counter and the backend behind it. */
export default function MemorialPage() {
  const site = getSite()
  return (
    <Container width="narrow" className="py-24 text-center lg:py-32">
      <h1 className="font-display text-4xl sm:text-5xl">{site.memorial.title}</h1>
      <PlaceholderNotice className="mt-10">נר הזכרון ייבנה בשלב 5</PlaceholderNotice>
    </Container>
  )
}
