import type { Metadata } from 'next'
import { getSite } from './site'

/** Metadata for an exhibit page. Falls back to site defaults, never invents copy. */
export function itemMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string
  description?: string
  path: string
  image?: string
}): Metadata {
  const site = getSite()
  const url = new URL(path, site.url).toString()
  const desc = description || site.description

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${site.name}`,
      description: desc,
      url,
      siteName: site.name,
      locale: site.locale,
      type: 'article',
      ...(image ? { images: [{ url: new URL(image, site.url).toString() }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}
