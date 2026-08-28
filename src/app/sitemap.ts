import type { MetadataRoute } from 'next'
import { COLLECTION_ROUTES, COLLECTIONS, getAll } from '@/lib/content'
import { getSite } from '@/lib/site'

/** Generated from the content index — never maintained by hand. */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite()
  const abs = (path: string) => new URL(path, site.url).toString()

  const staticPages = ['/', '/family', '/memorial'].map((path) => ({
    url: abs(path),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.5,
  }))

  const collectionPages = COLLECTIONS.flatMap((collection) => [
    { url: abs(COLLECTION_ROUTES[collection]), changeFrequency: 'weekly' as const, priority: 0.8 },
    ...getAll(collection).map((item) => ({
      url: abs(item.url),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ])

  return [...staticPages, ...collectionPages]
}
