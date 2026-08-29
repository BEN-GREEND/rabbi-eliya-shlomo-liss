import { cn } from '@/lib/utils/cn'

/**
 * The icon set.
 *
 * Drawn for this site: one weight, one grid, square ends, no fills. They mark
 * what a thing IS — a document, a photograph, a voice, a year — so a reader can
 * tell an archive item from a testimony at a glance without reading a label.
 *
 * Deliberately not a general-purpose icon library: eight marks, each of which
 * the site actually needs, so nothing generic creeps in.
 */
export type GlyphName =
  | 'timeline'
  | 'torah'
  | 'gallery'
  | 'archive'
  | 'testimony'
  | 'activity'
  | 'person'
  | 'source'
  | 'arrow'
  | 'search'
  | 'quote'

const PATHS: Record<GlyphName, React.ReactNode> = {
  // A thread with a mark on it — the timeline's own motif.
  timeline: (
    <>
      <path d="M12 2.5v19" />
      <circle cx="12" cy="8" r="2.2" />
      <path d="M14.5 15.5h5" />
      <path d="M4.5 15.5h5" />
    </>
  ),
  // An open volume.
  torah: (
    <>
      <path d="M12 6.5v13" />
      <path d="M12 6.5C10 5 7.5 4.5 4 4.8v12.9c3.5-.3 6 .2 8 1.8" />
      <path d="M12 6.5c2-1.5 4.5-2 8-1.7v12.9c-3.5-.3-6 .2-8 1.8" />
    </>
  ),
  // A frame with a horizon and a sun — a photograph, not a picture icon.
  gallery: (
    <>
      <rect x="3" y="4.5" width="18" height="15" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M3 16l5-4.5 4 3.5 3-2.5 6 5" />
    </>
  ),
  // A sheet with a folded corner.
  archive: (
    <>
      <path d="M6 2.5h8.5L19 7v14.5H6z" />
      <path d="M14.5 2.5V7H19" />
      <path d="M9 12h7M9 15.5h7" />
    </>
  ),
  // Speech, for a voice from the period.
  testimony: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </>
  ),
  // A building front — an institution, a post.
  activity: (
    <>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 9.5v10M12 9.5v10M19 9.5v10" />
      <path d="M2.5 19.5h19" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.5c1.4-3.9 4.1-5.9 7.5-5.9s6.1 2 7.5 5.9" />
    </>
  ),
  // A bookmark — where a claim came from.
  source: (
    <>
      <path d="M6.5 3h11v18l-5.5-4.2L6.5 21z" />
    </>
  ),
  // Points along the reading direction; flipped for RTL by the caller.
  arrow: (
    <>
      <path d="M19 12H5" />
      <path d="M11 5.5 4.5 12l6.5 6.5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 20.5 20.5" />
    </>
  ),
  // A single opening quotation mark, drawn rather than typed.
  quote: (
    <>
      <path d="M9.5 5.5C6 7 4 9.8 4 13.2V18h6v-6H7.2c.2-2.3 1.2-4 2.9-5z" />
      <path d="M19.5 5.5C16 7 14 9.8 14 13.2V18h6v-6h-2.8c.2-2.3 1.2-4 2.9-5z" />
    </>
  ),
}

export function Glyph({
  name,
  className,
  label,
}: {
  name: GlyphName
  className?: string
  /** Give a label only when the mark carries meaning on its own. */
  label?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cn('h-5 w-5 shrink-0', className)}
    >
      {PATHS[name]}
    </svg>
  )
}

/** Which mark belongs to which collection. */
export const COLLECTION_GLYPH: Record<string, GlyphName> = {
  timeline: 'timeline',
  torah: 'torah',
  gallery: 'gallery',
  archive: 'archive',
  testimonies: 'testimony',
  activities: 'activity',
  people: 'person',
  sources: 'source',
}
