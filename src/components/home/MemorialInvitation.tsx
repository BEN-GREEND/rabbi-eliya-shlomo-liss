import Link from 'next/link'
import { getSite } from '@/lib/site'
import { Container } from '@/components/primitives/Container'

/**
 * The quiet passage to the memorial page.
 *
 * Deliberately the stillest thing on the page: a great deal of space, one
 * drawn flame, one line, one link. No counter, no button, no urgency — the
 * candle itself lives on /memorial.
 */
export function MemorialInvitation() {
  const site = getSite()

  return (
    <section className="border-rule border-t">
      <Container width="narrow" className="py-24 text-center lg:py-32">
        <Link href="/memorial" className="group inline-block no-underline">
          {/* A single flame, drawn. Still by default; it breathes only on approach. */}
          <svg
            viewBox="0 0 24 40"
            aria-hidden="true"
            className="text-brass/70 group-hover:text-brass mx-auto h-16 w-10 transition-colors"
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

          <p className="label-caps text-brass mt-6 tracking-[var(--tracking-wide-label)]">
            {site.memorial.title}
          </p>

          <p className="font-display text-ink mx-auto mt-5 max-w-[26rem] text-2xl leading-relaxed">
            להדלקת נר לזכרו
          </p>

          <span className="label-caps border-brass/40 group-hover:border-brass group-hover:text-brass mt-8 inline-block border-b pb-1 transition-colors">
            לעמוד הזכרון
          </span>
        </Link>
      </Container>
    </section>
  )
}
