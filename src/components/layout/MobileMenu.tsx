'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MEMORIAL_LINK, PRIMARY_NAV } from '@/lib/nav'
import { CandleGlyph } from './CandleGlyph'

/**
 * Full-screen navigation on small viewports.
 *
 * Closing is driven by the events that cause it — a link press, the close
 * button, Escape — rather than by watching the pathname from an effect.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('a')?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="label-caps text-ink -me-2 flex items-center gap-2 p-2"
      >
        <span className="flex flex-col gap-[3px]" aria-hidden="true">
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
        </span>
        {open ? 'סגירה' : 'תפריט'}
      </button>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="paper-grain bg-paper fixed inset-0 z-50 overflow-y-auto px-6 pt-24 pb-16"
        >
          <button type="button" onClick={close} className="label-caps absolute end-6 top-7 p-2">
            סגירה
          </button>

          <nav aria-label="ניווט ראשי">
            <ul className="flex flex-col">
              {PRIMARY_NAV.map((link, i) => (
                <li key={link.href} className="border-rule border-b">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display flex items-baseline gap-4 py-4 text-2xl no-underline"
                  >
                    <span className="label-caps numerals text-brass w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={MEMORIAL_LINK.href}
              onClick={() => setOpen(false)}
              className="font-display text-ink mt-10 inline-flex items-center gap-3 text-xl no-underline"
            >
              <CandleGlyph className="text-brass h-6 w-4" />
              {MEMORIAL_LINK.label}
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
