import type { Metadata } from 'next'
import { CollectionIndex } from '@/components/exhibit/CollectionIndex'

export const metadata: Metadata = { title: 'ארכיון' }

export default function Page() {
  return <CollectionIndex collection="archive" />
}
