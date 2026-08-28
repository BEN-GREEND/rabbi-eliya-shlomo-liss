/**
 * The reverse index.
 *
 * Built from the same REFERENCES table the validator uses, so a link that
 * validates is a link that appears. Nothing here is stored in content files:
 * a person file never lists its photographs. Write
 * `people: ["person-x"]` on the photograph, and the person page finds it.
 */
import { INVERSE_RELATION, personRulesFor, readRefField, rulesFor } from './references'
import type { Collection, RawItem } from './types'

export interface PersonLink {
  /** Item that points at the person. */
  itemId: string
  collection: Collection
  /** Semantic role from the reference table: author, depicted, narrator… */
  role: string
}

export interface InverseRelation {
  /** The person who declared the tie. */
  person: string
  /** This subject's role as seen from that person — the inverse of what they wrote. */
  type: string
  note?: string
}

export interface ContentIndex {
  items: RawItem[]
  byId: Map<string, RawItem>
  byCollection: Map<Collection, RawItem[]>
  /** person id → every item that points at them, with the role of the link. */
  personToItems: Map<string, PersonLink[]>
  /** item id → related item ids, made symmetric. */
  relatedGraph: Map<string, Set<string>>
  byPeriod: Map<string, string[]>
  byPlace: Map<string, string[]>
  byTag: Map<string, string[]>
  /** person id → ties other people declared towards them. */
  inverseRelations: Map<string, InverseRelation[]>
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key)
  if (list) list.push(value)
  else map.set(key, [value])
}

export function buildIndex(items: RawItem[]): ContentIndex {
  const byId = new Map<string, RawItem>()
  const byCollection = new Map<Collection, RawItem[]>()
  const personToItems = new Map<string, PersonLink[]>()
  const relatedGraph = new Map<string, Set<string>>()
  const byPeriod = new Map<string, string[]>()
  const byPlace = new Map<string, string[]>()
  const byTag = new Map<string, string[]>()
  const inverseRelations = new Map<string, InverseRelation[]>()

  for (const item of items) {
    byId.set(item.data.id as string, item)
    push(byCollection, item.collection, item)
  }

  for (const item of items) {
    const id = item.data.id as string

    // people — derived, never authored on the person side
    for (const rule of personRulesFor(item.collection)) {
      for (const { value } of readRefField(item.data, rule.field)) {
        if (value === id) continue
        push(personToItems, value, { itemId: id, collection: item.collection, role: rule.role! })
      }
    }

    // related — declared once, in one direction; made symmetric here
    for (const { value } of readRefField(item.data, 'related')) {
      if (!relatedGraph.has(id)) relatedGraph.set(id, new Set())
      if (!relatedGraph.has(value)) relatedGraph.set(value, new Set())
      relatedGraph.get(id)!.add(value)
      relatedGraph.get(value)!.add(id)
    }

    // person-to-person ties, read from the far end
    if (item.collection === 'people') {
      const declared =
        (item.data.relations as Array<{ person: string; type: string; note?: string }>) ?? []
      for (const rel of declared) {
        const inverse = INVERSE_RELATION[rel.type]
        if (!inverse || rel.person === id) continue
        push(inverseRelations, rel.person, { person: id, type: inverse, note: rel.note })
      }
    }

    // taxonomies
    for (const rule of rulesFor(item.collection)) {
      if (rule.target.kind !== 'vocab') continue
      const target = rule.target.vocab === 'periods' ? byPeriod : byPlace
      for (const { value } of readRefField(item.data, rule.field)) push(target, value, id)
    }
    for (const tag of (item.data.tags as string[] | undefined) ?? []) push(byTag, tag, id)
  }

  // A person is also implicitly related to every item that points at them,
  // so "related items" on a person page and on an exhibit agree.
  for (const [personId, links] of personToItems) {
    if (!relatedGraph.has(personId)) relatedGraph.set(personId, new Set())
    for (const link of links) relatedGraph.get(personId)!.add(link.itemId)
  }

  // De-duplicate taxonomy lists.
  for (const map of [byPeriod, byPlace, byTag]) {
    for (const [key, list] of map) map.set(key, [...new Set(list)])
  }

  return {
    items,
    byId,
    byCollection,
    personToItems,
    relatedGraph,
    byPeriod,
    byPlace,
    byTag,
    inverseRelations,
  }
}
