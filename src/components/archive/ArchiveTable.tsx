'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Glyph } from '@/components/primitives/Glyph'
import { cn } from '@/lib/utils/cn'
import { EmptyState } from '@/components/primitives/EmptyState'

export interface ArchiveDoc {
  id: string
  url: string
  title: string
  description: string | null
  date: string | null
  docType: string
  docTypeLabel: string
  assetStatus: string
  preview: { src: string; alt: string } | null
  custodian: { url: string; name: string } | null
  author: { url: string; name: string } | null
  recipient: { url: string; name: string } | null
  source: string | null
}

export interface Drawer {
  id: string
  title: string
  count: number
}

/**
 * What the archive is able to say about each object, and how it looks saying it.
 *
 * These are seven different statements and the site keeps them apart. "held
 * but not scanned" is not "we do not know if it survived", and neither is
 * "gone".
 */
const STATUS: Record<string, { label: string; className: string }> = {
  // Held: brass, the colour of things the archive has.
  present: { label: 'זמין לעיון', className: 'border-brass/40 text-brass bg-brass/[0.07]' },
  'not-digitized': {
    label: 'קיים — טרם נסרק',
    className: 'border-brass/40 text-brass bg-brass/[0.07]',
  },
  'private-archive': {
    label: 'בארכיון משפחתי פרטי',
    className: 'border-brass/40 text-brass bg-brass/[0.07]',
  },
  // Outstanding: quiet, on the hairline.
  awaited: { label: 'טרם הועלה', className: 'border-rule text-ink-faint' },
  located: { label: 'אותר — טרם הושג', className: 'border-rule text-ink-faint' },
  sought: { label: 'טרם אותר', className: 'border-rule text-ink-faint' },
  // Gone: wine, and said once, plainly.
  lost: { label: 'אבד', className: 'border-wine-line/40 text-wine bg-wine/[0.05]' },
}

/** Small, fixed tilts. A drawer of papers, not a carousel. */
const TILT = ['-0.9deg', '0.7deg', '-0.5deg', '1deg', '-1.2deg', '0.4deg']

/**
 * שולחן הארכיון — the archive table.
 *
 * Documents lie on a paper surface at slight angles, each with its own soft
 * shadow, the way papers actually sit when someone has been through them.
 * Hovering lifts a sheet; the tilt straightens. The angle is fixed per
 * position, never random, so the table looks identical on every render and
 * between server and client.
 *
 * An object that is not held is still on the table — that is the point of a
 * catalogue. Its sheet carries its status instead of a scan.
 */
export function ArchiveTable({ docs, drawers }: { docs: ArchiveDoc[]; drawers: Drawer[] }) {
  const [active, setActive] = useState<string | null>(null)

  const shown = useMemo(
    () => (active ? docs.filter((d) => d.docType === active) : docs),
    [docs, active],
  )

  return (
    <>
      <div className="border-rule mb-12 flex flex-wrap items-center gap-x-2 gap-y-3 border-y py-4">
        <span className="label-caps text-ink-faint me-3">מגירות</span>
        <Chip active={active === null} onClick={() => setActive(null)} count={docs.length}>
          הכול
        </Chip>
        {drawers.map((d) => (
          <Chip key={d.id} active={active === d.id} onClick={() => setActive(d.id)} count={d.count}>
            {d.title}
          </Chip>
        ))}
      </div>

      {/* The table surface. */}
      <div className="paper-grain bg-stone/45 border-rule relative border px-5 py-10 shadow-[inset_0_1px_3px_rgba(18,22,31,0.05)] sm:px-10 sm:py-14">
        <ul
          aria-live="polite"
          className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16"
        >
          {shown.map((doc, i) => {
            const status = STATUS[doc.assetStatus] ?? STATUS.sought!
            return (
              <li key={doc.id}>
                <Link
                  href={doc.url}
                  className="group block no-underline"
                  style={{ ['--tilt' as string]: TILT[i % TILT.length] }}
                >
                  <article
                    className={cn(
                      'bg-paper border-rule relative border p-5 sm:p-6',
                      'ease-exhibit shadow-[var(--shadow-rest)]',
                      'transition-[transform,box-shadow,border-color] duration-500',
                      'rotate-[var(--tilt)] group-hover:-translate-y-1.5 group-hover:rotate-0',
                      'group-hover:border-brass-line group-hover:shadow-[var(--shadow-lift)]',
                      'group-focus-visible:rotate-0',
                      doc.assetStatus === 'lost' && 'opacity-70',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="label-caps text-brass flex items-center gap-2">
                        <Glyph name="archive" className="h-4 w-4" />
                        {doc.docTypeLabel}
                      </span>
                      <span
                        className={cn(
                          'label-caps shrink-0 border px-2 py-1 text-[0.625rem]',
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div
                      className={cn(
                        'border-rule bg-paper-deep/60 relative mt-4 aspect-[4/3] overflow-hidden border',
                        doc.assetStatus === 'lost' && 'border-dashed',
                      )}
                    >
                      {doc.preview ? (
                        <Image
                          src={doc.preview.src}
                          alt={doc.preview.alt}
                          fill
                          loading="lazy"
                          sizes="(min-width: 1024px) 28vw, 90vw"
                          className="object-cover"
                        />
                      ) : (
                        <RuledSheet />
                      )}
                    </div>

                    <h2 className="font-display group-hover:text-wine mt-4 text-xl leading-snug transition-colors">
                      {doc.title}
                    </h2>

                    {doc.date && (
                      <p className="label-caps text-ink-faint mt-1.5">
                        <span dir="ltr" className="numerals inline-block">
                          {doc.date}
                        </span>
                      </p>
                    )}

                    {doc.description && (
                      <p className="text-ink-soft mt-3 text-[0.9rem] leading-relaxed">
                        {doc.description}
                      </p>
                    )}

                    {doc.custodian && (
                      <p className="label-caps text-ink-faint mt-3">
                        שמור אצל {doc.custodian.name}
                      </p>
                    )}
                  </article>
                </Link>
              </li>
            )
          })}
        </ul>

        {shown.length === 0 && (
          <EmptyState
            glyph="archive"
            title="מגירה שממתינה למסמך"
            note="במגירה זו טרם נוספו מסמכים. כל פריט שיאותר ייכנס לכאן."
          />
        )}
      </div>
    </>
  )
}

/**
 * A blank sheet, drawn.
 *
 * Stands in for a scan that is not here — ruled lines fading out, which reads
 * as an empty page rather than a broken image. Nothing is fabricated: it is
 * obviously not a document.
 */
function RuledSheet() {
  return (
    <svg
      viewBox="0 0 120 90"
      aria-hidden="true"
      className="text-brass-line/25 absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {[22, 34, 46, 58, 70].map((y, i) => (
        <line
          key={y}
          x1={i % 2 === 0 ? 22 : 30}
          x2={i === 4 ? 74 : 98}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          opacity={1 - i * 0.16}
        />
      ))}
    </svg>
  )
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn('chip', active && 'chip-active')}
    >
      {children}
      <span className="numerals text-ink-faint ms-1.5">{count}</span>
    </button>
  )
}
