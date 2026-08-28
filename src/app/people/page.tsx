import type { Metadata } from 'next'
import { assetExists } from '@/lib/assets'
import { countPersonItems, getAll, loadVocab } from '@/lib/content'
import { lifeSpan } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
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
        <p className="label-caps text-brass">אוסף</p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">אישים</h1>
        <p className="text-ink-soft mt-5 max-w-[38rem]">
          כל אדם מוגדר פעם אחת. המוצגים הקשורים אליו נאספים מעצמם מכל רחבי האתר — תמונות, מסמכים,
          אירועים, עדויות ודברי תורה.
        </p>
      </header>

      {people.length === 0 ? (
        <PlaceholderNotice>טרם הוזנו אישים</PlaceholderNotice>
      ) : (
        <PeopleGallery people={people} categories={categories} />
      )}
    </Container>
  )
}
