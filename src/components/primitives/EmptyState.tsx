import { Glyph, type GlyphName } from './Glyph'
import { cn } from '@/lib/utils/cn'

/**
 * A place waiting for an object.
 *
 * Most of this archive is not here yet, and that is the honest state — but it
 * should look prepared, not apologetic. A framed plate, a mark, a short line.
 * The same treatment everywhere, so an empty case reads as part of the design
 * rather than as something missing from it.
 */
export function EmptyState({
  glyph = 'archive',
  title,
  note,
  className,
  size = 'default',
}: {
  glyph?: GlyphName
  title: string
  note?: string
  className?: string
  size?: 'compact' | 'default'
}) {
  return (
    <div
      className={cn(
        'border-brass-line/30 bg-paper-deep/40 relative flex flex-col items-center justify-center',
        'border border-dashed text-center',
        size === 'compact' ? 'gap-2 px-5 py-7' : 'gap-3 px-8 py-14',
        className,
      )}
    >
      {/* Corner ticks — a mounting frame, not a broken box. */}
      {(['start-0 top-0', 'end-0 top-0', 'start-0 bottom-0', 'end-0 bottom-0'] as const).map(
        (pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn('border-brass-line/60 absolute h-2.5 w-2.5 border', pos)}
            style={{ borderWidth: 1 }}
          />
        ),
      )}

      <Glyph
        name={glyph}
        className={cn('text-brass-line/60', size === 'compact' ? 'h-5 w-5' : 'h-7 w-7')}
      />
      <p className="label-caps text-ink-soft">{title}</p>
      {note && (
        <p className="text-ink-faint max-w-[26rem] text-[0.85rem] leading-relaxed">{note}</p>
      )}
    </div>
  )
}
