/**
 * Controlled vocabularies.
 *
 * Periods, places and categories are content, not code. Adding a period means
 * editing a YAML file — no component changes, and nothing to keep in sync.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { VOCAB_DIR } from './paths'
import { COLLECTIONS, type Collection } from './types'

const zTerm = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  note: z.string().optional(),
})

const zPeriod = zTerm.extend({
  yearFrom: z.number().int().optional(),
  yearTo: z.number().int().optional(),
  order: z.number().int().default(0),
})

const zPlace = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  region: z.string().optional(),
  note: z.string().optional(),
})

export type Period = z.output<typeof zPeriod>
export type Place = z.output<typeof zPlace>
export type Term = z.output<typeof zTerm>

export interface Vocab {
  periods: Period[]
  places: Place[]
  /** Categories are scoped per collection: a gallery category is not an archive category. */
  categories: Record<Collection, Term[]>
}

function readYaml(file: string): unknown {
  const abs = path.join(VOCAB_DIR, file)
  if (!fs.existsSync(abs)) return null
  return parseYaml(fs.readFileSync(abs, 'utf8'))
}

let cache: Vocab | null = null

export function loadVocab(): Vocab {
  if (cache) return cache

  const periods = zPeriod
    .array()
    .parse(readYaml('periods.yml') ?? [])
    .sort((a, b) => a.order - b.order || (a.yearFrom ?? 0) - (b.yearFrom ?? 0))

  const places = zPlace.array().parse(readYaml('places.yml') ?? [])

  const rawCategories = (readYaml('categories.yml') ?? {}) as Record<string, unknown>
  const categories = Object.fromEntries(
    COLLECTIONS.map((c) => [c, zTerm.array().parse(rawCategories[c] ?? [])]),
  ) as Record<Collection, Term[]>

  cache = { periods, places, categories }
  return cache
}

export function periodById(id: string): Period | undefined {
  return loadVocab().periods.find((p) => p.id === id)
}

export function placeById(id: string): Place | undefined {
  return loadVocab().places.find((p) => p.id === id)
}

export function categoryById(collection: Collection, id: string): Term | undefined {
  return loadVocab().categories[collection].find((t) => t.id === id)
}
