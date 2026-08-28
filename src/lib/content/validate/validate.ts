/**
 * Referential integrity.
 *
 * Four stages:
 *   A. parse        — per-file, in load.ts
 *   B. registry     — build global id/slug/vocab tables once everything is read
 *   C. references   — walk REFERENCES and resolve every link
 *   D. uniqueness   — ids, slugs, aliases, reserved routes
 *
 * All problems are collected; the run never stops at the first one. A broken
 * reference is an error and fails the build. Things that are merely worth
 * knowing (an unreferenced person) are warnings and do not.
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadAll } from '../load'
import { PUBLIC_DIR } from '../paths'
import { readRefField, rulesFor, type ReferenceRule } from '../references'
import { COLLECTIONS, COLLECTION_LABELS, type Collection, type RawItem } from '../types'
import { loadVocab } from '../vocab'
import { nearest } from './suggest'

export interface Problem {
  severity: 'error' | 'warning'
  filePath: string
  field?: string
  value?: string
  /** Human description of what the value was supposed to point at. */
  expected?: string
  message: string
  suggestion?: string
  known?: string[]
}

export interface ValidationResult {
  problems: Problem[]
  items: RawItem[]
  errorCount: number
  warningCount: number
}

/** Routes owned by the app. A slug may not collide with one. */
const RESERVED_SLUGS = new Set([
  'search',
  'memorial',
  'family',
  'people',
  'timeline',
  'torah',
  'gallery',
  'archive',
  'testimonies',
  'activities',
  'periods',
  'api',
  'sitemap',
  'robots',
])

function describeTarget(rule: ReferenceRule, owner: Collection): string {
  switch (rule.target.kind) {
    case 'collection':
      return `collection → ${rule.target.collection} (${COLLECTION_LABELS[rule.target.collection]})`
    case 'anyItem':
      return 'פריט כלשהו באתר (לפי id גלובלי)'
    case 'vocab':
      return `vocabulary → content/_vocab/${rule.target.vocab}.yml`
    case 'categories':
      return `vocabulary → content/_vocab/categories.yml › ${owner}`
  }
}

export function validateContent(): ValidationResult {
  const { items, issues } = loadAll()
  const problems: Problem[] = []

  // Stage A results carry straight through.
  for (const issue of issues) {
    problems.push({
      severity: 'error',
      filePath: issue.filePath,
      field: issue.field,
      message: issue.message,
    })
  }

  // ---- Stage B: registries -------------------------------------------------
  const byId = new Map<string, RawItem>()
  const idsPerCollection = new Map<Collection, string[]>(COLLECTIONS.map((c) => [c, []]))
  const vocab = loadVocab()
  const periodIds = vocab.periods.map((p) => p.id)
  const placeIds = vocab.places.map((p) => p.id)

  const seenId = new Map<string, string[]>()
  const seenSlug = new Map<string, string[]>()

  for (const item of items) {
    const id = item.data.id as string
    const slug = item.data.slug as string

    seenId.set(id, [...(seenId.get(id) ?? []), item.filePath])
    const slugKey = `${item.collection}/${slug}`
    seenSlug.set(slugKey, [...(seenSlug.get(slugKey) ?? []), item.filePath])

    if (!byId.has(id)) byId.set(id, item)
    idsPerCollection.get(item.collection)!.push(id)
  }

  // ---- Stage D: uniqueness -------------------------------------------------
  for (const [id, files] of seenId) {
    if (files.length > 1) {
      problems.push({
        severity: 'error',
        filePath: files.join('  •  '),
        field: 'id',
        value: id,
        message: `המזהה "${id}" מופיע ב-${files.length} קבצים. id חייב להיות ייחודי בכל האתר.`,
      })
    }
  }
  for (const [key, files] of seenSlug) {
    if (files.length > 1) {
      problems.push({
        severity: 'error',
        filePath: files.join('  •  '),
        field: 'slug',
        value: key,
        message: `ה-slug "${key}" מופיע ב-${files.length} קבצים. slug חייב להיות ייחודי בתוך ה-collection.`,
      })
    }
  }
  for (const item of items) {
    const slug = item.data.slug as string
    if (RESERVED_SLUGS.has(slug)) {
      problems.push({
        severity: 'error',
        filePath: item.filePath,
        field: 'slug',
        value: slug,
        message: `ה-slug "${slug}" שמור לנתיב קבוע באתר. בחר slug אחר.`,
      })
    }
  }

  // Person aliases must not collide — the search index resolves names through them.
  const aliasOwner = new Map<string, string>()
  for (const item of items.filter((i) => i.collection === 'people')) {
    const names = [
      item.data.name as string,
      ...((item.data.aliases as string[] | undefined) ?? []),
    ].filter(Boolean)
    for (const name of names) {
      const prev = aliasOwner.get(name)
      if (prev && prev !== item.filePath) {
        problems.push({
          severity: 'error',
          filePath: item.filePath,
          field: 'aliases',
          value: name,
          message: `השם "${name}" משמש גם ב-${prev}. שם או alias חייב להצביע על אדם אחד בלבד.`,
        })
      } else {
        aliasOwner.set(name, item.filePath)
      }
    }
  }

  // ---- Stage C: references -------------------------------------------------
  for (const item of items) {
    const selfId = item.data.id as string

    for (const rule of rulesFor(item.collection)) {
      for (const { value, path: fieldPath } of readRefField(item.data, rule.field)) {
        let ok = false
        let known: string[] = []

        switch (rule.target.kind) {
          case 'collection': {
            known = idsPerCollection.get(rule.target.collection)!
            const found = byId.get(value)
            ok = !!found && found.collection === rule.target.collection
            // Point at the real mistake when the id exists but in the wrong place.
            if (found && found.collection !== rule.target.collection) {
              problems.push({
                severity: 'error',
                filePath: item.filePath,
                field: fieldPath,
                value,
                expected: describeTarget(rule, item.collection),
                message: `המזהה קיים, אך הוא שייך ל-collection "${found.collection}" (${found.filePath}) ולא ל-"${rule.target.collection}".`,
              })
              continue
            }
            break
          }
          case 'anyItem':
            known = [...byId.keys()]
            ok = byId.has(value)
            break
          case 'vocab':
            known = rule.target.vocab === 'periods' ? periodIds : placeIds
            ok = known.includes(value)
            break
          case 'categories':
            known = vocab.categories[item.collection].map((t) => t.id)
            ok = known.includes(value)
            break
        }

        if (!ok) {
          problems.push({
            severity: 'error',
            filePath: item.filePath,
            field: fieldPath,
            value,
            expected: describeTarget(rule, item.collection),
            message: 'לא קיים.',
            suggestion: nearest(value, known),
            known: known.length <= 12 ? known : undefined,
          })
          continue
        }

        if (rule.noSelf && value === selfId) {
          problems.push({
            severity: 'error',
            filePath: item.filePath,
            field: fieldPath,
            value,
            message: 'פריט אינו יכול להצביע על עצמו.',
          })
        }
      }
    }
  }

  // ---- Consistency and asset checks ---------------------------------------
  for (const item of items) {
    const d = item.data

    if (d.date && d.approximateDate) {
      problems.push({
        severity: 'error',
        filePath: item.filePath,
        field: 'date / approximateDate',
        message: 'שני השדות מלאים. תאריך הוא ודאי או משוער — לא שניהם.',
      })
    }

    if (item.collection === 'testimonies' && d.narrator && d.narratorName) {
      problems.push({
        severity: 'warning',
        filePath: item.filePath,
        field: 'narrator / narratorName',
        message: 'שני השדות מלאים. פריט האישיות (narrator) גובר; narratorName יתעלם.',
      })
    }

    // Referenced assets must actually be on disk.
    const assets: Array<[string, unknown]> = [
      ['image.src', (d.image as { src?: string } | undefined)?.src],
      ['coverImage.src', (d.coverImage as { src?: string } | undefined)?.src],
      ['preview.src', (d.preview as { src?: string } | undefined)?.src],
      ['pdf', d.pdf],
      ['file', d.file],
      ...((d.scans as string[] | undefined) ?? []).map(
        (s, i) => [`scans[${i}]`, s] as [string, unknown],
      ),
      ...((d.pages as string[] | undefined) ?? []).map(
        (s, i) => [`pages[${i}]`, s] as [string, unknown],
      ),
    ]
    for (const [field, value] of assets) {
      if (typeof value !== 'string' || !value) continue
      if (/^https?:\/\//.test(value)) continue
      if (!fs.existsSync(path.join(PUBLIC_DIR, value.replace(/^\//, '')))) {
        problems.push({
          severity: 'error',
          filePath: item.filePath,
          field,
          value,
          expected: 'קובץ תחת public/',
          message: 'הקובץ לא נמצא.',
        })
      }
    }
  }

  // A person nobody points at is legitimate, but usually means a forgotten link.
  const referencedPeople = new Set<string>()
  for (const item of items) {
    for (const rule of rulesFor(item.collection)) {
      if (rule.target.kind !== 'collection' || rule.target.collection !== 'people') continue
      for (const { value } of readRefField(item.data, rule.field)) referencedPeople.add(value)
    }
  }
  for (const item of items.filter((i) => i.collection === 'people')) {
    if (!referencedPeople.has(item.data.id as string)) {
      problems.push({
        severity: 'warning',
        filePath: item.filePath,
        field: 'id',
        value: item.data.id as string,
        message: 'אף פריט באתר אינו מקושר לאישיות הזו.',
      })
    }
  }

  return {
    problems,
    items,
    errorCount: problems.filter((p) => p.severity === 'error').length,
    warningCount: problems.filter((p) => p.severity === 'warning').length,
  }
}
