import type { Metadata } from 'next'
import { Container } from '@/components/primitives/Container'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { SearchClient } from '@/components/search/SearchClient'

export const metadata: Metadata = { title: 'חיפוש' }

export default function SearchPage() {
  return (
    <Container width="wide" className="pt-12 pb-20 lg:pt-16 lg:pb-28">
      <SectionHeading
        eyebrow="חיפוש"
        title="חיפוש בארכיון"
        glyph="search"
        as="h1"
        className="mb-10"
      />
      <SearchClient />
    </Container>
  )
}
