/**
 * Site-level text and metadata, read from content/site.yml.
 * Empty strings are intentional: a field with no value renders as an explicit
 * "not yet entered" state, never as invented copy.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { CONTENT_DIR } from './content/paths'

const zSite = z.object({
  name: z.string(),
  tagline: z.string().default(''),
  intro: z.string().default(''),
  description: z.string(),
  url: z.string(),
  locale: z.string().default('he_IL'),
  memorial: z
    .object({ title: z.string().default('נר זכרון'), text: z.string().default('') })
    .default({ title: 'נר זכרון', text: '' }),
})

export type Site = z.output<typeof zSite>

let cache: Site | null = null

export function getSite(): Site {
  if (!cache) {
    const raw = parseYaml(fs.readFileSync(path.join(CONTENT_DIR, 'site.yml'), 'utf8'))
    cache = zSite.parse(raw)
  }
  return cache
}
