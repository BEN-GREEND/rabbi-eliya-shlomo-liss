import Link from 'next/link'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'
import { ButtonLink } from '@/components/primitives/Button'

/**
 * The quiet passage to the memorial page.
 *
 * The page ends in a dark room. A great deal of space, one drawn flame
 * throwing a little light onto the petrol behind it, one line and one action.
 * No counter and no urgency — the candle itself lives on /memorial — but the
 * band is unmistakably a door, not a footnote.
 */
export function MemorialInvitation() {
  const site = getSite()

  return (
    <section className="ground-deep paper-grain relative isolate overflow-hidden">
      {/* The flame's own light on the wall behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(circle at center, rgba(226,182,96,0.16) 0%, rgba(226,182,96,0.05) 40%, transparent 70%)',
        }}
      />
      <Container width="narrow" className="py-28 text-center lg:py-36">
        <Link href="/memorial" className="group inline-block no-underline">
          {/* A single flame, drawn. Still by default; it breathes only on approach. */}
          <svg
            viewBox="0 0 24 40"
            aria-hidden="true"
            className="text-brass-soft/80 group-hover:text-brass-soft mx-auto h-20 w-12 transition-colors"
            fill="none"
          >
            <ellipse cx="12" cy="12" rx="9" ry="12" fill="currentColor" opacity="0.07" />
            <path
              d="M12 3c2.9 3.7 4.6 6.2 4.6 8.7A4.6 4.6 0 0 1 12 16.3a4.6 4.6 0 0 1-4.6-4.6C7.4 9.2 9.1 6.7 12 3Z"
              fill="currentColor"
              opacity="0.55"
            />
            <path
              d="M12 7.4c1.4 1.9 2.2 3.2 2.2 4.4a2.2 2.2 0 1 1-4.4 0c0-1.2.8-2.5 2.2-4.4Z"
              fill="currentColor"
            />
            <path d="M12 16.5v3" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          </svg>

          <p className="label-caps text-brass-soft mt-7 tracking-[var(--tracking-wide-label)]">
            {site.memorial.title}
          </p>

          <p className="font-display text-paper mx-auto mt-5 max-w-[26rem] text-3xl leading-relaxed sm:text-4xl">
            להדלקת נר לזכרו
          </p>
        </Link>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/memorial" variant="onDeep" arrow>
            לעמוד הזכרון
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
