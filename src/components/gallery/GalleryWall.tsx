'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Glyph } from '@/components/primitives/Glyph'
import { cn } from '@/lib/utils/cn'
import { EmptyState } from '@/components/primitives/EmptyState'

export interface GalleryPerson {
  id: string
  url: string
  name: string
}

export interface GalleryPhoto {
  id: string
  url: string
  title: string
  description: string | null
  date: string | null
  place: string | null
  photographer: string | null
  source: string | null
  credit: string | null
  copyright: string | null
  categories: string[]
  emphasis: 'small' | 'medium' | 'large' | 'full'
  assetStatus: string
  image: { src: string; alt: string } | null
  people: GalleryPerson[]
}

export interface Filter {
  id: string
  title: string
  count: number
}

/** Emphasis is content, not layout code: each photograph declares its own weight. */
const SPAN: Record<string, string> = {
  full: 'sm:col-span-6',
  large: 'sm:col-span-4',
  medium: 'sm:col-span-3',
  small: 'sm:col-span-2',
}

const RATIO: Record<string, string> = {
  full: 'aspect-[16/9]',
  large: 'aspect-[4/3]',
  medium: 'aspect-[3/4]',
  small: 'aspect-square',
}

const ASSET_NOTE: Record<string, string> = {
  awaited: 'התצלום טרם הועלה',
  'not-digitized': 'התצלום קיים וטרם נסרק',
  'private-archive': 'בארכיון משפחתי פרטי',
  located: 'אותר — טרם הושג',
  sought: 'טרם אותר',
  lost: 'אבד',
  unavailable: 'אינו זמין',
}

/**
 * The gallery wall.
 *
 * Not a uniform grid: photographs take different widths and proportions
 * according to the `emphasis` field on each item, so the wall reads as a hung
 * arrangement rather than a contact sheet.
 *
 * A photograph whose file has not arrived is still hung. Its plate stands
 * empty with its status on it, and every other part of the label — date,
 * place, who is in it, credit — is already there. When the file lands, the
 * plate fills and nothing else changes.
 */
export function GalleryWall({ photos, filters }: { photos: GalleryPhoto[]; filters: Filter[] }) {
  const [active, setActive] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const shown = useMemo(
    () => (active ? photos.filter((p) => p.categories.includes(active)) : photos),
    [photos, active],
  )

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? null : (i + delta + shown.length) % shown.length)),
    [shown.length],
  )

  return (
    <>
      <div className="border-rule mb-12 flex flex-wrap items-center gap-x-2 gap-y-3 border-y py-4">
        <span className="label-caps text-ink-faint me-3">סינון</span>
        <Chip active={active === null} onClick={() => setActive(null)} count={photos.length}>
          הכול
        </Chip>
        {filters.map((f) => (
          <Chip key={f.id} active={active === f.id} onClick={() => setActive(f.id)} count={f.count}>
            {f.title}
          </Chip>
        ))}
      </div>

      <ul aria-live="polite" className="grid gap-x-6 gap-y-12 sm:grid-cols-6">
        {shown.map((photo, i) => (
          <li key={photo.id} className={cn(SPAN[photo.emphasis] ?? SPAN.medium)}>
            <figure>
              <PlateButton photo={photo} onOpen={() => setOpenIndex(i)} />
              <figcaption className="border-rule group-hover:border-brass mt-4 border-s-2 ps-4 transition-colors">
                <Link
                  href={photo.url}
                  className="font-display hover:text-wine block text-lg leading-snug no-underline transition-colors"
                >
                  {photo.title}
                </Link>
                {photo.date && (
                  <span className="label-caps text-ink-faint mt-1 block">
                    <span dir="ltr" className="numerals inline-block">
                      {photo.date}
                    </span>
                  </span>
                )}
                {photo.people.length > 0 && (
                  <span className="text-ink-soft mt-1 block text-[0.85rem] leading-snug">
                    מופיעים בתמונה:{' '}
                    {photo.people.map((p, n) => (
                      <span key={p.id}>
                        {n > 0 && <span aria-hidden="true">, </span>}
                        <Link
                          href={p.url}
                          className="decoration-brass-soft/70 hover:text-brass underline underline-offset-4"
                        >
                          {p.name}
                        </Link>
                      </span>
                    ))}
                  </span>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <EmptyState
          glyph="gallery"
          title="מקום שממתין לתצלום"
          note="בקטגוריה זו טרם נוספו תמונות. כשיימצאו — כאן הן ייתלו."
        />
      )}

      {openIndex !== null && shown[openIndex] && (
        <Lightbox
          photo={shown[openIndex]}
          hasSiblings={shown.length > 1}
          onClose={close}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      )}
    </>
  )
}

function PlateButton({ photo, onOpen }: { photo: GalleryPhoto; onOpen: () => void }) {
  const plate = (
    <div
      className={cn(
        'border-rule bg-paper-deep relative overflow-hidden border',
        'shadow-[var(--shadow-rest)] transition-[box-shadow,border-color] duration-500',
        'group-hover:border-brass-line group-hover:shadow-[var(--shadow-lift)]',
        RATIO[photo.emphasis] ?? RATIO.medium,
      )}
    >
      {photo.image ? (
        <Image
          src={photo.image.src}
          alt={photo.image.alt}
          fill
          loading="lazy"
          sizes="(min-width: 640px) 45vw, 100vw"
          className="ease-exhibit object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4 text-center">
          <Glyph name="gallery" className="text-brass-line/45 h-7 w-7" />
          <span className="label-caps text-ink-soft">
            {ASSET_NOTE[photo.assetStatus] ?? 'אינו זמין'}
          </span>
        </span>
      )}
    </div>
  )

  // Only a plate with an actual image opens the lightbox.
  if (!photo.image) return <div className="group">{plate}</div>

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`הגדלת התמונה: ${photo.title}`}
      className="group block w-full cursor-zoom-in text-start"
    >
      {plate}
    </button>
  )
}

function Lightbox({
  photo,
  hasSiblings,
  onClose,
  onPrev,
  onNext,
}: {
  photo: GalleryPhoto
  hasSiblings: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // In RTL, ArrowLeft moves forward.
      if (e.key === 'ArrowLeft') onNext()
      if (e.key === 'ArrowRight') onPrev()
      if (e.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNext, onPrev])

  const facts = [photo.date, photo.place, photo.photographer].filter(Boolean)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      ref={panelRef}
      className="bg-deep/97 exhibit-enter fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="mx-auto flex min-h-full w-full max-w-[86rem] flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:gap-16 lg:px-16">
        <div className="relative min-h-[40vh] flex-1 lg:min-h-[70vh]">
          {photo.image && (
            <Image
              src={photo.image.src}
              alt={photo.image.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-contain"
              priority
            />
          )}
        </div>

        <div className="text-paper w-full lg:w-[24rem] lg:shrink-0">
          <p className="label-caps text-brass-soft tracking-[var(--tracking-wide-label)]">מוצג</p>
          <h2 className="font-display mt-3 text-3xl leading-tight">{photo.title}</h2>

          {facts.length > 0 && (
            <p className="label-caps text-paper/70 mt-4">
              <span dir="ltr" className="numerals inline-block">
                {facts.join(' · ')}
              </span>
            </p>
          )}

          {photo.description && (
            <p className="text-paper/75 mt-5 leading-relaxed">{photo.description}</p>
          )}

          {photo.people.length > 0 && (
            <p className="text-paper/75 mt-5 text-[0.95rem]">
              <span className="label-caps text-paper/60 block">מופיעים בתמונה</span>
              {photo.people.map((p, n) => (
                <span key={p.id}>
                  {n > 0 && <span aria-hidden="true">, </span>}
                  <Link
                    href={p.url}
                    className="decoration-brass-soft hover:text-brass-soft underline underline-offset-4"
                  >
                    {p.name}
                  </Link>
                </span>
              ))}
            </p>
          )}

          {(photo.source || photo.credit || photo.copyright) && (
            <p className="label-caps text-paper/60 mt-6">
              {[photo.credit ?? photo.source, photo.copyright].filter(Boolean).join(' · ')}
            </p>
          )}

          <div className="mt-8 flex items-center gap-6">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="label-caps border-paper/40 hover:border-brass-soft hover:text-brass-soft border-b pb-1 transition-colors"
            >
              סגירה
            </button>
            <Link
              href={photo.url}
              className="label-caps text-paper/70 hover:text-paper no-underline transition-colors"
            >
              לעמוד המוצג
            </Link>
            {hasSiblings && (
              <span className="ms-auto flex gap-4">
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="המוצג הקודם"
                  className="label-caps text-paper/70 hover:text-paper transition-colors"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="המוצג הבא"
                  className="label-caps text-paper/70 hover:text-paper transition-colors"
                >
                  ‹
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
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
