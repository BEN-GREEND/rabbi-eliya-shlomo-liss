/**
 * Stage A of the pipeline: read files off disk and validate each one in
 * isolation. No cross-file knowledge here — that is stage C.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { CONTENT_DIR, relPath } from './paths'
import { schemas } from './schemas'
import { COLLECTIONS, type Collection, type RawItem } from './types'

export interface FieldIssue {
  filePath: string
  collection: Collection
  field: string
  message: string
}

export interface LoadResult {
  items: RawItem[]
  issues: FieldIssue[]
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name) && !e.name.startsWith('_'))
    .map((e) => path.join(dir, e.name))
    .sort()
}

/** Read and per-file validate every collection. Never throws — issues are returned. */
export function loadAll(): LoadResult {
  const items: RawItem[] = []
  const issues: FieldIssue[] = []

  for (const collection of COLLECTIONS) {
    for (const abs of listFiles(path.join(CONTENT_DIR, collection))) {
      const filePath = relPath(abs)
      const raw = fs.readFileSync(abs, 'utf8')

      let parsed: matter.GrayMatterFile<string>
      try {
        parsed = matter(raw)
      } catch (err) {
        issues.push({
          filePath,
          collection,
          field: '(front matter)',
          message: `שגיאת תחביר ב-YAML: ${(err as Error).message}`,
        })
        continue
      }

      const result = schemas[collection].safeParse(parsed.data)
      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({
            filePath,
            collection,
            field: issue.path.join('.') || '(root)',
            message: issue.message,
          })
        }
        continue
      }

      // A file's slug must match its filename, so the URL is predictable
      // from the file you are editing.
      const expectedSlug = path.basename(abs).replace(/\.mdx?$/, '')
      if (result.data.slug !== expectedSlug) {
        issues.push({
          filePath,
          collection,
          field: 'slug',
          message: `slug הוא "${result.data.slug}" אך שם הקובץ הוא "${expectedSlug}" — הם חייבים להיות זהים`,
        })
      }

      items.push({
        collection,
        filePath,
        body: parsed.content.trim(),
        data: result.data as Record<string, unknown>,
      })
    }
  }

  return { items, issues }
}
