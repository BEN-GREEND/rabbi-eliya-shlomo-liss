import { cn } from '@/lib/utils/cn'

/**
 * A year set at exhibition scale, sitting behind the content.
 * Decorative by definition — hidden from assistive technology, because the
 * same year is always present as real text in the item it belongs to.
 */
export function YearMark({
  year,
  className,
  size = 'lg',
}: {
  year: number | string
  className?: string
  size?: 'md' | 'lg' | 'xl'
}) {
  const sizes = {
    md: 'text-[7rem] sm:text-[10rem]',
    lg: 'text-[10rem] sm:text-[16rem]',
    xl: 'text-[13rem] sm:text-[22rem]',
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'numerals font-display pointer-events-none leading-none font-light select-none',
        'text-brass/[0.09]',
        sizes[size],
        className,
      )}
    >
      {year}
    </span>
  )
}
