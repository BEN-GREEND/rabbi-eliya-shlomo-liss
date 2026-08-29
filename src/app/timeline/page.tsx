import type { Metadata } from 'next'
import { CollectionIndex } from '@/components/exhibit/CollectionIndex'
import { Prose } from '@/components/exhibit/Prose'
import { getBySlug } from '@/lib/content'
import { Container } from '@/components/primitives/Container'

export const metadata: Metadata = { title: 'תולדות חייו' }

/**
 * תולדות חייו — the biographical essay, then the timeline itself.
 *
 * The essay lives in content/pages/biography.mdx, so it can be rewritten
 * without touching this file and carries its sources like any other item.
 */
export default function Page() {
  const biography = getBySlug('pages', 'biography')

  return (
    <>
      {biography && (
        <Container width="wide" className="pt-20 lg:pt-28">
          <p className="label-caps text-brass">תולדות חייו</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">הרב אליהו שלמה ליס</h1>
          <div className="mt-10">
            <Prose source={biography.body} />
          </div>
        </Container>
      )}
      <CollectionIndex collection="timeline" heading="ציר הזמן" as="h2" />
    </>
  )
}
