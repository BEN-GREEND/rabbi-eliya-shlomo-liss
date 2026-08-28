import type { Metadata } from 'next'
import Link from 'next/link'
import { countPersonItems, getAll } from '@/lib/content'
import { lifeSpan } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Numerals } from '@/components/primitives/Numerals'
import { Rule } from '@/components/primitives/Rule'

export const metadata: Metadata = { title: 'אישים' }

function PersonRow({ person }: { person: ReturnType<typeof getAll>[number] }) {
  const d = person.data as Record<string, unknown>
  const years = lifeSpan(d)
  const count = countPersonItems(person.id)

  return (
    <li>
      <Link
        href={person.url}
        className="group border-rule hover:border-brass flex flex-wrap items-baseline gap-x-6 gap-y-1 border-s py-3 ps-5 no-underline transition-colors"
      >
        <span className="font-display group-hover:text-brass text-xl transition-colors">
          {(d.displayName as string) || (d.name as string) || person.title}
        </span>
        {years && (
          <span className="label-caps text-ink-faint">
            <Numerals>{years}</Numerals>
          </span>
        )}
        {typeof d.relationToRabbi === 'string' && d.relationToRabbi && (
          <span className="text-ink-soft text-[0.95rem]">{d.relationToRabbi}</span>
        )}
        {count > 0 && (
          <span className="label-caps numerals text-brass ms-auto">{count} מוצגים</span>
        )}
      </Link>
    </li>
  )
}

export default function PeoplePage() {
  const all = getAll('people')
  const established = all.filter((p) => !p.data.researchCandidate)
  const candidates = all.filter((p) => p.data.researchCandidate)

  return (
    <Container width="wide" className="py-20 lg:py-28">
      <header className="mb-14">
        <p className="label-caps text-brass">אוסף</p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">אישים</h1>
        <p className="text-ink-soft mt-5 max-w-[38rem]">
          כל אדם מוגדר פעם אחת. המוצגים הקשורים אליו נאספים מעצמם מכל רחבי האתר — תמונות, מסמכים,
          אירועים, עדויות ודברי תורה.
        </p>
      </header>

      {established.length === 0 ? (
        <PlaceholderNotice>טרם הוזנו אישים</PlaceholderNotice>
      ) : (
        <ul className="grid gap-x-14 gap-y-1 lg:grid-cols-2">
          {established.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </ul>
      )}

      {candidates.length > 0 && (
        <section className="mt-20" aria-labelledby="candidates-heading">
          <Rule />
          <h2 id="candidates-heading" className="label-caps text-brass mt-6">
            מועמדי מחקר
          </h2>
          <p className="text-ink-soft mt-3 max-w-[42rem] text-[0.95rem] leading-relaxed">
            שמות המופיעים במקור כקשורים לרב ליס, אך הקשר עצמו{' '}
            <strong className="font-semibold">טרם אומת</strong>. הם מוצגים בנפרד בכוונה, ולא
            כתלמידיו או כעמיתיו, עד שכל אחד ייבדק לגופו.
          </p>
          <ul className="mt-6 grid gap-x-14 gap-y-1 lg:grid-cols-2">
            {candidates.map((person) => (
              <PersonRow key={person.id} person={person} />
            ))}
          </ul>
        </section>
      )}
    </Container>
  )
}
