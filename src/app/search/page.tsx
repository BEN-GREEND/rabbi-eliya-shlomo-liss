import type { Metadata } from 'next'
import { Container } from '@/components/primitives/Container'
import { SearchClient } from '@/components/search/SearchClient'

export const metadata: Metadata = { title: 'חיפוש' }

export default function SearchPage() {
  return (
    <Container width="wide" className="py-20 lg:py-28">
      <p className="label-caps text-brass">חיפוש</p>
      <h1 className="font-display mt-3 mb-10 text-4xl sm:text-5xl">חיפוש בארכיון</h1>
      <SearchClient />
    </Container>
  )
}
