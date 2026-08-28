import { cn } from '@/lib/utils/cn'

/**
 * Shown wherever content has not been supplied yet.
 *
 * Deliberately visible rather than hidden: an empty exhibit case reads as
 * honest, whereas invented filler would not. Every one of these disappears
 * on its own when the real content lands.
 */
export function PlaceholderNotice({
  children = 'טרם הוזן תוכן',
  className,
}: {
  children?: string
  className?: string
}) {
  return (
    <p
      className={cn(
        'label-caps border-rule inline-flex items-center gap-2 border border-dashed',
        'bg-paper-deep/60 text-ink-faint px-3 py-1.5',
        className,
      )}
    >
      <span aria-hidden="true" className="bg-brass-soft inline-block h-1 w-1 rounded-full" />
      {children}
    </p>
  )
}
