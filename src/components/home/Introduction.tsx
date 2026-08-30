import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'

/** The short opening text. Empty until real copy is supplied. */
export function Introduction() {
  const site = getSite()

  return (
    <section className="border-rule bg-paper-deep/35 border-t">
      <Container width="wide" className="py-16 lg:py-24">
        <div className="border-brass max-w-[42rem] border-s-2 ps-7">
          {site.intro ? (
            <p className="font-display text-ink text-xl leading-[1.7] sm:text-2xl">{site.intro}</p>
          ) : (
            <PlaceholderNotice>פסקת הקדמה — טרם הוזנה</PlaceholderNotice>
          )}
        </div>
      </Container>
    </section>
  )
}
