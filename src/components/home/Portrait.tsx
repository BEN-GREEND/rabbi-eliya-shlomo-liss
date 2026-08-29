import Image from 'next/image'
import { assetExists } from '@/lib/assets'
import { getSite } from '@/lib/site'
import { Glyph } from '@/components/primitives/Glyph'

/**
 * The portrait plate.
 *
 * A mounted object: a brass hairline offset behind the frame, a paper mat, and
 * the wall label beneath. If the photograph is not here the plate carries
 * corner mounts and a short line — a place prepared for a print, not a broken
 * image and not a fabricated one.
 */
export function Portrait() {
  const site = getSite()
  const present = assetExists(site.portrait)

  return (
    <figure className="relative">
      {/* Offset brass rule, so the frame sits on something. */}
      <div
        aria-hidden="true"
        className="border-brass-line/40 pointer-events-none absolute -top-3 -bottom-3 border-y"
        style={{ insetInlineStart: '0.75rem', insetInlineEnd: '-0.75rem' }}
      />

      <div className="border-rule bg-paper relative border p-3 shadow-[var(--shadow-rest)]">
        <div className="bg-paper-deep border-rule-soft relative aspect-4/5 overflow-hidden border">
          {present ? (
            <Image
              src={site.portrait}
              alt={site.portraitAlt || site.name}
              fill
              priority
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover"
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
                  className={`border-brass-line/50 absolute h-5 w-5 ${pos}`}
                />
              ))}
              <Glyph name="gallery" className="text-brass-line/45 h-8 w-8" />
              <figcaption className="label-caps text-ink-soft text-center">
                תצוגה ממתינה
                <span className="text-ink-faint mt-1 block font-normal tracking-normal">
                  דיוקן טרם הועלה
                </span>
              </figcaption>
            </div>
          )}
        </div>
      </div>

      <div className="border-brass mt-5 border-s-2 ps-4">
        <p className="eyebrow">דיוקן</p>
        <p className="text-ink mt-1.5 text-[0.95rem]">{site.name}</p>
        {present && site.portraitCredit && (
          <p className="label-caps text-ink-faint mt-1.5 text-[0.625rem]">
            מקור: {site.portraitCredit}
          </p>
        )}
      </div>
    </figure>
  )
}
