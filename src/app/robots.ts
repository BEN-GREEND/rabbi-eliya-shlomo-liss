import type { MetadataRoute } from 'next'
import { getSite } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const site = getSite()
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: new URL('/sitemap.xml', site.url).toString(),
  }
}
