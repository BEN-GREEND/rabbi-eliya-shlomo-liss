import type { Metadata } from 'next'
import Link from 'next/link'
import { getById, getBySlug, getInverseRelations, type Item } from '@/lib/content'
import { RELATION_LABELS } from '@/lib/content/references'
import { lifeSpan } from '@/lib/utils/format'
import { Container } from '@/components/primitives/Container'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Numerals } from '@/components/primitives/Numerals'
import { PlaceholderNotice } from '@/components/primitives/PlaceholderNotice'
import { Prose } from '@/components/exhibit/Prose'

export const metadata: Metadata = { title: 'משפחתו והמשך דרכו' }

const SUBJECT = 'rabbi-eliya-shlomo-liss'

/** Which ties belong to which part of the page. */
const HIS_PARENTS_HOUSE = new Set(['father', 'mother', 'brother', 'sister', 'sibling', 'parent'])
const HIS_OWN_HOUSE = new Set([
  'spouse',
  'wife',
  'husband',
  'brother-in-law',
  'sister-in-law',
  'father-in-law',
])
const NEXT_GENERATION = new Set([
  'son',
  'daughter',
  'child',
  'son-in-law',
  'daughter-in-law',
  'grandson',
  'granddaughter',
  'grandchild',
])

interface Tie {
  person: Item
  type: string
  note?: string
}

function PersonEntry({ tie }: { tie: Tie }) {
  const d = tie.person.data as Record<string, unknown>
  const name = (d.displayName as string) || (d.name as string) || tie.person.title
  const years = lifeSpan(d)

  return (
    <li className="border-rule border-s ps-5">
      <p className="label-caps text-brass">{RELATION_LABELS[tie.type] ?? tie.type}</p>
      <Link
        href={tie.person.url}
        className="font-display hover:text-brass mt-1 block text-2xl leading-snug no-underline transition-colors"
      >
        {name}
      </Link>
      {typeof d.maidenName === 'string' && d.maidenName && (
        <p className="label-caps text-ink-faint mt-1">לבית {d.maidenName}</p>
      )}
      {years && (
        <p className="label-caps text-ink-faint mt-1">
          <Numerals>{years}</Numerals>
        </p>
      )}
      {typeof d.shortBio === 'string' && d.shortBio && (
        <p className="text-ink-soft mt-2 text-[0.95rem] leading-relaxed">{d.shortBio}</p>
      )}
      {tie.note && <p className="text-ink-soft mt-1 text-[0.95rem]">{tie.note}</p>}
    </li>
  )
}

function Section({ title, ties, emptyNote }: { title: string; ties: Tie[]; emptyNote: string }) {
  return (
    <section className="border-rule border-t py-14 lg:py-20">
      <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      {ties.length === 0 ? (
        <PlaceholderNotice className="mt-8">{emptyNote}</PlaceholderNotice>
      ) : (
        <ul className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ties.map((tie) => (
            <PersonEntry key={`${tie.person.id}-${tie.type}`} tie={tie} />
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * משפחתו והמשך דרכו.
 *
 * Built entirely from the relation graph — ties read once from the Rabbi's own
 * record and once from everyone who named him. Nothing here is a separate list
 * to maintain, and no name appears that is not a real record elsewhere.
 *
 * Deliberately restrained: names, ties, years. A family section in a heritage
 * archive, not a profile of living people.
 */
export default function FamilyPage() {
  const subject = getById(SUBJECT)
  if (!subject) return null

  const declared =
    (subject.data.relations as Array<{ person: string; type: string; note?: string }>) ?? []
  const declaredIds = new Set(declared.map((r) => r.person))
  const all = [
    ...declared,
    ...getInverseRelations(SUBJECT).filter((r) => !declaredIds.has(r.person)),
  ]

  const ties: Tie[] = all.flatMap((r) => {
    const person = getById(r.person)
    return person ? [{ person, type: r.type, note: r.note }] : []
  })

  const pick = (set: Set<string>) => ties.filter((t) => set.has(t.type))
  const legacy = getBySlug('pages', 'family-legacy')

  return (
    <Container width="wide" className="pt-20 pb-20 lg:pt-28">
      <header className="mb-14">
        <SectionHeading eyebrow="עמוד" title="משפחתו והמשך דרכו" glyph="person" as="h1" />
      </header>

      <Section
        title="בית הוריו"
        ties={pick(HIS_PARENTS_HOUSE)}
        emptyNote="טרם נמסרו פרטים נוספים על בית הוריו"
      />

      <Section title="בית הרב" ties={pick(HIS_OWN_HOUSE)} emptyNote="טרם נמסרו פרטים" />

      <Section
        title="הדור הבא"
        ties={pick(NEXT_GENERATION)}
        emptyNote="טרם נמסרו פרטים על הדור הבא"
      />

      {legacy && (
        <section className="border-rule border-t py-14 lg:py-20">
          <h2 className="font-display text-3xl sm:text-4xl">{legacy.title}</h2>
          <div className="mt-8">
            <Prose source={legacy.body} />
          </div>
        </section>
      )}

      <p className="label-caps border-rule text-ink-faint border-t pt-10">
        פרטי המשפחה מבוססים על החומר שנמסר על ידי המשפחה. שמות שלא נמסרו אינם מופיעים כאן, וצאצאים
        נוספים יתווספו בהמשך.
      </p>
    </Container>
  )
}
