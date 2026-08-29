import type { Metadata } from 'next'
import { assetExists } from '@/lib/assets'
import { countPersonItems, getAll, loadVocab } from '@/lib/content'
import { lifeSpan } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { EmptyState } from '@/components/primitives/EmptyState'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import {
  PeopleGallery,
  type CategoryOption,
  type PersonCard,
} from '@/components/people/PeopleGallery'

export const metadata: Metadata = { title: 'אישים' }

export default function PeoplePage() {
  const people: PersonCard[] = getAll('people').map((person) => {
    const d = person.data as Record<string, unknown>
    const image = d.image as { src: string; alt: string } | undefined
    const name = (d.displayName as string) || (d.name as string) || person.title
    return {
      id: person.id,
      url: person.url,
      name,
      years: lifeSpan(d),
      relation: (d.relationToRabbi as string) || null,
      categories: (d.categories as string[]) ?? [],
      count: countPersonItems(person.id),
      image: assetExists(image?.src) && image ? image : null,
      initial: name.replace(/^(הרב|רבי|מרת|פרופ׳|ר')\s*/u, '').charAt(0),
    }
  })

  // Offer only the categories that actually have someone in them, in the order
  // the vocabulary declares.
  const categories: CategoryOption[] = loadVocab()
    .categories.people.map((term) => ({
      id: term.id,
      title: term.title,
      count: people.filter((p) => p.categories.includes(term.id)).length,
    }))
    .filter((c) => c.count > 0)

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="mb-12">
        <SectionHeading eyebrow="אוסף" title="אישים" glyph="person" as="h1" index={people.length} />
        <p className="text-ink-soft mt-6 max-w-[38rem] leading-relaxed">
          כל אדם מוגדר פעם אחת. המוצגים הקשורים אליו נאספים מעצמם מכל רחבי האתר — תמונות, מסמכים,
          אירועים, עדויות ודברי תורה.
        </p>
      </header>

      {people.length === 0 ? (
        <EmptyState glyph="person" title="אולם שממתין לדמויות" note="טרם הוזנו אישים." />
      ) : (
        <PeopleGallery people={people} categories={categories} />
      )}
    </Container>
  )
}
