import Image from 'next/image'
import Link from 'next/link'
import { assetExists } from '@/lib/assets'
import { getReal } from '@/lib/content'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { HomeSection } from './HomeSection'

/**
 * Selected photographs, in a museum composition rather than a uniform grid.
 *
 * The `emphasis` field on each image decides how much wall it gets, so the
 * arrangement is driven by the content and not hardcoded here.
 */
const SPANS: Record<string, string> = {
  full: 'sm:col-span-6',
  large: 'sm:col-span-4',
  medium: 'sm:col-span-3',
  small: 'sm:col-span-2',
}

const RATIOS: Record<string, string> = {
  full: 'aspect-[16/9]',
  large: 'aspect-[4/3]',
  medium: 'aspect-[3/4]',
  small: 'aspect-square',
}

export function SelectedGallery({ index }: { index: number }) {
  const all = getReal('gallery')
  const items = (
    all.filter((i) => i.data.featured).length ? all.filter((i) => i.data.featured) : all
  ).slice(0, 5)

  return (
    <HomeSection
      index={index}
      glyph="gallery"
      ground="stone"
      title="גלריה נבחרת"
      href="/gallery"
      empty={items.length === 0}
    >
      <ul className="grid gap-6 sm:grid-cols-6">
        {items.map((item) => {
          const d = item.data as Record<string, unknown>
          const image = d.image as { src: string; alt: string }
          const emphasis = (d.emphasis as string) ?? 'medium'
          const date = formatDate(d)

          return (
            <li key={item.id} className={cn(SPANS[emphasis] ?? SPANS.medium)}>
              <Link href={item.url} className="group block no-underline">
                <figure>
                  <div
                    className={cn(
                      'border-rule bg-paper-deep relative overflow-hidden border',
                      RATIOS[emphasis] ?? RATIOS.medium,
                    )}
                  >
                    {assetExists(image?.src) ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 640px) 40vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-exhibit)] group-hover:scale-[1.02]"
                      />
                    ) : (
                      <span className="label-caps text-ink-faint absolute inset-0 flex items-center justify-center">
                        תמונה טרם הועלתה
                      </span>
                    )}
                  </div>
                  <figcaption className="border-rule group-hover:border-brass mt-3 border-s ps-3 transition-colors">
                    <span className="font-display block text-[1.0625rem] leading-snug">
                      {item.title}
                    </span>
                    {date && <span className="label-caps text-ink-faint mt-1 block">{date}</span>}
                  </figcaption>
                </figure>
              </Link>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
