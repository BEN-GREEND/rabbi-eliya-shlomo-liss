import type { Metadata } from 'next'
import { CollectionIndex } from '@/components/exhibit/CollectionIndex'

export const metadata: Metadata = { title: 'גלריה' }

export default function Page() {
  return <CollectionIndex collection="gallery" />
}
