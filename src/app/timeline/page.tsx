import type { Metadata } from 'next'
import { CollectionIndex } from '@/components/exhibit/CollectionIndex'

export const metadata: Metadata = { title: 'תולדות חייו' }

export default function Page() {
  return <CollectionIndex collection="timeline" />
}
