import { COLLECTION_LABELS, getAll, type Collection } from '@/lib/content'
import { Container } from '@/components/primitives/Container'
import { EmptyState } from '@/components/primitives/EmptyState'
import { YearMark } from '@/components/primitives/YearMark'
import { COLLECTION_GLYPH } from '@/components/primitives/Glyph'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { ExhibitCard } from './ExhibitCard'

/**
 * Shared listing for a collection.
 *
 * Stage 2 scaffolding: it renders real content through the real design
 * system, so navigation and the pipeline are exercised end to end. Each
 * collection gets its own designed page in stage 4 (the museum gallery
 * composition, the archive table, the timeline spine).
 */
export function CollectionIndex({
  collection,
  intro,
  heading,
  as: Heading = 'h1',
}: {
  collection: Collection
  intro?: string
  /** Override the collection's own label — e.g. when the page already has an h1. */
  heading?: string
  as?: 'h1' | 'h2'
}) {
  const items = getAll(collection)

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="relative mb-16">
        <div className="pointer-events-none absolute end-0 -top-16 -z-10 hidden sm:block">
          <YearMark year={items.length} size="md" />
        </div>
        <SectionHeading
          as={Heading}
          eyebrow="אוסף"
          title={heading ?? COLLECTION_LABELS[collection]}
          glyph={COLLECTION_GLYPH[collection]}
          index={items.length || undefined}
        />
        {intro && <p className="text-ink-soft mt-6 max-w-[38rem] leading-relaxed">{intro}</p>}
      </header>

      {items.length === 0 ? (
        <EmptyState title="אולם שממתין למוצג" note="האוסף הזה טרם קיבל את פריטיו." />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
