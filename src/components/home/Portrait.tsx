import Image from 'next/image'
import { assetExists } from '@/lib/assets'
import { getSite } from '@/lib/site'

/**
 * The portrait plate.
 *
 * If the photograph is on disk it is shown. If it is not, the plate stands
 * empty behind its label — the way a case waits for the object that belongs
 * in it. No stand-in image is ever generated.
 */
export function Portrait() {
  const site = getSite()
  const present = assetExists(site.portrait)

  return (
    <figure className="relative">
      <div className="border-rule bg-paper-deep relative aspect-[4/5] overflow-hidden border">
        {present ? (
          <Image
            src={site.portrait}
            alt={site.portraitAlt || site.name}
            fill
            priority
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="paper-grain absolute inset-0 flex flex-col items-center justify-center gap-3">
            {/* A drawn frame corner, not an icon: the plate reads as empty, not broken. */}
            <svg
              viewBox="0 0 48 60"
              aria-hidden="true"
              className="text-brass/25 h-14 w-11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="0.5" y="0.5" width="47" height="59" />
              <path d="M0.5 44 L16 28 L28 40 L36 33 L47.5 44" />
              <circle cx="33" cy="16" r="5" />
            </svg>
            <figcaption className="label-caps text-ink-faint text-center">
              תצוגה ממתינה
              <span className="mt-1 block font-normal tracking-normal">דיוקן טרם הועלה</span>
            </figcaption>
          </div>
        )}
      </div>

      {/* Wall label under the plate — the same grammar every exhibit uses. */}
      <div className="border-rule mt-4 border-s ps-4">
        <p className="label-caps text-brass">דיוקן</p>
        <p className="text-ink-soft mt-1 text-[0.95rem]">{site.name}</p>
        {present && site.portraitCredit && (
          <p className="label-caps text-ink-faint mt-1.5 text-[0.625rem]">
            מקור: {site.portraitCredit}
          </p>
        )}
      </div>
    </figure>
  )
}
