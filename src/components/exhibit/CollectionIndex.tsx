import { COLLECTION_LABELS, getAll, type Collection } from '@/lib/content'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { YearMark } from '@/components/primitives/YearMark'
import { ExhibitCard } from './ExhibitCard'

/**
 * Shared listing for a collection.
 *
 * Stage 2 scaffolding: it renders real content through the real design
 * system, so navigation and the pipeline are exercised end to end. Each
 * collection gets its own designed page in stage 4 (the museum gallery
 * composition, the archive table, the timeline spine).
 */
export function CollectionIndex({ collection, intro }: { collection: Collection; intro?: string }) {
  const items = getAll(collection)

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="relative mb-16">
        <div className="pointer-events-none absolute end-0 -top-16 -z-10 hidden sm:block">
          <YearMark year={items.length} size="md" />
        </div>
        <p className="label-caps text-brass">אוסף</p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">{COLLECTION_LABELS[collection]}</h1>
        {intro && <p className="text-ink-soft mt-5 max-w-[38rem]">{intro}</p>}
      </header>

      {items.length === 0 ? (
        <PlaceholderNotice>האוסף ריק — טרם הוזנו פריטים</PlaceholderNotice>
      ) : (
        <ul className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.id}>
              <ExhibitCard item={item} index={i} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
