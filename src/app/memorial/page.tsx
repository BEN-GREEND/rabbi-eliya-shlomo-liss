import type { Metadata } from 'next'
import { assetExists } from '@/lib/assets'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { MemorialSection } from '@/components/memorial/MemorialSection'

export const metadata: Metadata = { title: 'נר זכרון' }

/**
 * The memorial page.
 *
 * A dim room rather than a bright one: deep petrol, so a drawn flame reads as
 * a flame and the light it gives has somewhere to fall. His photograph with
 * the candle in front of it, and the act of lighting beside them, on screen
 * together.
 *
 * The print is resolved here, on the server: the components below sit under a
 * client boundary and must not reach into the content layer.
 *
 * The page is static; the count, and the names of those who asked to be named,
 * are fetched by the client components themselves.
 */
export default function MemorialPage() {
  const site = getSite()
  const portrait = assetExists(site.portrait)
    ? {
        src: site.portrait,
        alt: site.portraitAlt || site.name,
        credit: site.portraitCredit,
      }
    : null

  return (
    <div className="ground-deep paper-grain relative isolate overflow-x-clip">
      <Container width="wide" className="pt-16 pb-24 lg:pt-24 lg:pb-32">
        <MemorialSection
          memorialTitle={site.memorial.title}
          siteName={site.name}
          portrait={portrait}
        />

        {site.memorial.text && (
          <>
            <span aria-hidden="true" className="bg-brass-line/30 mx-auto mt-24 block h-px w-24" />
            <p className="font-display text-paper/75 mx-auto mt-12 max-w-[34rem] text-center text-lg leading-relaxed">
              {site.memorial.text}
            </p>
          </>
        )}
      </Container>
    </div>
  )
}
