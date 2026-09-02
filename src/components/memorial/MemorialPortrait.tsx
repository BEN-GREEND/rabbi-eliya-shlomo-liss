import Image from 'next/image'

/** What the page resolved on the server. Null when the print is not here yet. */
export interface PortraitPlate {
  src: string
  alt: string
  credit: string
}

/**
 * The photograph the candle stands in front of.
 *
 * This is the arrangement a yahrzeit candle actually has in a house: the
 * picture on the shelf, the flame in front of it. So the plate is mounted on
 * the dark wall of the room and the candle overlaps its lower edge — the two
 * read as one scene rather than as two images stacked on a page.
 *
 * The light is the reason it earns its place here. Unlit, the face is in
 * shadow — held back and cooled, but never so far that he stops being
 * recognisable; a memorial should not hide the man it is for. When the server
 * confirms a flame,
 * the portrait comes up to full over the same second and a half as the rest of
 * the room, and a warm wash rises from the bottom edge — the light arrives
 * from where the candle is, not from everywhere.
 *
 * The plain print is used rather than the framed one from the header: a second
 * gilt frame a hundred pixels below the first reads as duplication, and the
 * site's own mount is the language of every other object here.
 *
 * The file is resolved on the server and handed down: this component sits
 * under a client boundary, so it must not touch the content layer itself.
 */
export function MemorialPortrait({
  portrait,
  burning,
}: {
  portrait: PortraitPlate
  burning: boolean
}) {
  return (
    <figure className="relative">
      {/* Offset brass rule, so the plate hangs on something. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -bottom-3 border-y transition-colors duration-[1400ms]"
        style={{
          insetInlineStart: '0.75rem',
          insetInlineEnd: '-0.75rem',
          borderColor: burning ? 'var(--color-brass-soft)' : 'rgba(168,129,63,0.45)',
        }}
      />

      <div
        className="bg-navy-soft relative border p-2.5 shadow-[var(--shadow-deep)] transition-colors duration-[1400ms]"
        style={{ borderColor: burning ? 'var(--color-brass-line)' : 'rgba(53,96,111,0.9)' }}
      >
        <div className="border-navy-line relative aspect-4/5 overflow-hidden border">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority
            sizes="(min-width: 640px) 240px, 200px"
            className="object-cover transition-[filter] duration-[1400ms]"
            style={{ filter: burning ? 'none' : 'brightness(0.78) saturate(0.88)' }}
          />

          {/* The candle's light, arriving from below. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms]"
            style={{
              opacity: burning ? 1 : 0,
              background:
                'linear-gradient(to top, rgba(226,182,96,0.22) 0%, rgba(226,182,96,0.07) 38%, transparent 68%)',
            }}
          />
        </div>
      </div>

      {portrait.credit && (
        <figcaption className="label-caps text-paper/45 mt-3 text-[0.625rem]">
          מקור: {portrait.credit}
        </figcaption>
      )}
    </figure>
  )
}
