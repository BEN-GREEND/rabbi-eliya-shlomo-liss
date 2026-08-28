import type { Metadata } from 'next'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'

export const metadata: Metadata = { title: 'משפחתו והמשך דרכו' }

/** Stage 4. No family names or relations are entered — none have been supplied. */
export default function FamilyPage() {
  return (
    <Container width="default" className="py-20 lg:py-28">
      <p className="label-caps text-brass">עמוד</p>
      <h1 className="font-display mt-3 text-4xl sm:text-5xl">משפחתו והמשך דרכו</h1>
      <PlaceholderNotice className="mt-10">העמוד ייבנה בשלב 4</PlaceholderNotice>
    </Container>
  )
}
