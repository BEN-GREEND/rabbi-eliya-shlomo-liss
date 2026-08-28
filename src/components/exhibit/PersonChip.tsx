import Link from 'next/link'
import { getById } from '@/lib/content'

/**
 * A person's name, always as a link to their page.
 *
 * Call sites pass an id, never a name — the display name is resolved here, so
 * correcting a spelling in one file corrects it everywhere it appears.
 */
export function PersonChip({ id }: { id: string }) {
  const person = getById(id)
  if (!person) return null

  const data = person.data as { displayName?: string; name?: string }
  return (
    <Link
      href={person.url}
      className="decoration-brass-soft/70 hover:text-brass underline underline-offset-4 transition-colors"
    >
      {data.displayName || data.name || person.title}
    </Link>
  )
}

/** An inline, comma-separated run of linked names. */
export function PersonList({ ids, label }: { ids: string[]; label?: string }) {
  if (!ids.length) return null
  return (
    <p className="text-ink-soft text-[0.95rem]">
      {label && <span className="label-caps me-2">{label}</span>}
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && <span aria-hidden="true">, </span>}
          <PersonChip id={id} />
        </span>
      ))}
    </p>
  )
}
