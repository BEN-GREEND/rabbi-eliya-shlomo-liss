import type { Metadata } from 'next'
import { ExhibitPage } from '@/components/exhibit/ExhibitPage'
import { getAll, getBySlug } from '@/lib/content'
import { itemMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return getAll('gallery').map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getBySlug('gallery', slug)
  if (!item) return {}
  return itemMetadata({
    title: item.title,
    description: item.data.summary as string | undefined,
    path: item.url,
  })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ExhibitPage collection="gallery" slug={slug} />
}
