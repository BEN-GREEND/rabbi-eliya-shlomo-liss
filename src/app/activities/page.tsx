import type { Metadata } from 'next'
import { CollectionIndex } from '@/components/exhibit/CollectionIndex'

export const metadata: Metadata = { title: 'פעילותו' }

export default function Page() {
  return <CollectionIndex collection="activities" />
}
