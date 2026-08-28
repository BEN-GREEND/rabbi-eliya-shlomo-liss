import { cn } from '@/lib/utils/cn'

/** A hairline. The only divider this site uses. */
export function Rule({
  className,
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'deep'
}) {
  return (
    <hr
      className={cn(
        'border-0 border-t',
        tone === 'deep' ? 'border-rule-deep' : 'border-rule',
        className,
      )}
    />
  )
}
