import type { Metadata } from 'next'
import { CollectionIndex } from '@/components/exhibit/CollectionIndex'

export const metadata: Metadata = { title: 'אישים' }

export default function Page() {
  return <CollectionIndex collection="people" />
}
