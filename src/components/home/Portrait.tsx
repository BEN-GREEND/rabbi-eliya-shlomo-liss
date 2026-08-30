import Image from 'next/image'
import { assetExists } from '@/lib/assets'
import { getSite } from '@/lib/site'
import { cn } from '@/lib/utils/cn'
import { Glyph } from '@/components/primitives/Glyph'

/**
 * The portrait plate.
 *
 * A mounted object: a brass hairline offset behind the frame, a paper mat, and
 * the wall label beneath. `onDeep` puts the same plate on a petrol ground —
 * the mat goes dark, the label turns ivory and brass, and the offset rule
 * brightens, so the object still reads as mounted rather than pasted on.
 *
 * If the photograph is not here the plate carries corner mounts and a short
 * line — a place prepared for a print, not a broken image and not a
 * fabricated one.
 */
export function Portrait({ onDeep = false }: { onDeep?: boolean }) {
  const site = getSite()
  const present = assetExists(site.portrait)

  return (
    <figure className="group relative">
      {/* Offset brass rule, so the frame sits on something. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-4 -bottom-4 border-y',
          onDeep ? 'border-brass-line/70' : 'border-brass-line/40',
        )}
        style={{ insetInlineStart: '0.875rem', insetInlineEnd: '-0.875rem' }}
      />

      <div
        className={cn(
          'relative border p-3',
          onDeep
            ? 'border-brass-line/45 bg-navy-soft shadow-[var(--shadow-deep)]'
            : 'border-rule bg-paper shadow-[var(--shadow-rest)]',
        )}
      >
        <div
          className={cn(
            'relative aspect-4/5 overflow-hidden border',
            onDeep ? 'border-navy-line bg-navy-deep' : 'border-rule-soft bg-paper-deep',
          )}
        >
          {present ? (
            <Image
              src={site.portrait}
              alt={site.portraitAlt || site.name}
              fill
              priority
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="plate-image group-hover:plate-image-hover object-cover"
            />
          ) : (
            <div className="paper-grain absolute inset-0 flex flex-col items-center justify-center gap-3">
              {/* Photo corner mounts. */}
              {(
                [
                  'start-3 top-3 border-t border-s',
                  'end-3 top-3 border-t border-e',
                  'start-3 bottom-3 border-b border-s',
                  'end-3 bottom-3 border-b border-e',
                ] as const
              ).map((pos) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={cn(
                    'absolute h-5 w-5',
                    onDeep ? 'border-brass-line/70' : 'border-brass-line/50',
                    pos,
                  )}
                />
              ))}
              <Glyph
                name="gallery"
                className={cn('h-8 w-8', onDeep ? 'text-brass-line/70' : 'text-brass-line/45')}
              />
              <figcaption
                className={cn('label-caps text-center', onDeep ? 'text-paper/75' : 'text-ink-soft')}
              >
                תצוגה ממתינה
                <span
                  className={cn(
                    'mt-1 block font-normal tracking-normal',
                    onDeep ? 'text-paper/55' : 'text-ink-faint',
                  )}
                >
                  דיוקן טרם הועלה
                </span>
              </figcaption>
            </div>
          )}
        </div>
      </div>

      <div className={cn('mt-5 border-s-2 ps-4', onDeep ? 'border-brass-soft' : 'border-brass')}>
        <p className={cn('eyebrow', onDeep && 'text-brass-soft')}>דיוקן</p>
        <p className={cn('mt-1.5 text-[0.95rem]', onDeep ? 'text-paper' : 'text-ink')}>
          {site.name}
        </p>
        {present && site.portraitCredit && (
          <p
            className={cn(
              'label-caps mt-1.5 text-[0.625rem]',
              onDeep ? 'text-paper/60' : 'text-ink-faint',
            )}
          >
            מקור: {site.portraitCredit}
          </p>
        )}
      </div>
    </figure>
  )
}
