import { cn } from '@/lib/utils/cn'

/**
 * A self-contained run of Latin digits.
 *
 * A year range is two LTR numbers with a neutral dash between them. Inside an
 * RTL block the neutral does not bind them, so the base direction reorders the
 * two numbers and "1901–1963" renders as "1963–1901". Marking the run `dir="ltr"`
 * keeps it internally left-to-right while the surrounding paragraph stays RTL
 * and aligns to the right edge as it should.
 *
 * Use this for anything where digits and punctuation form one unit: life
 * spans, year ranges, catalogue numbers.
 */
export function Numerals({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span dir="ltr" className={cn('numerals inline-block', className)}>
      {children}
    </span>
  )
}
