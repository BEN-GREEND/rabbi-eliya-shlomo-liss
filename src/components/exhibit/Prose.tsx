import { MDXRemote } from 'next-mdx-remote-client/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils/cn'

/**
 * Long-form item body.
 *
 * The reading measure and rhythm live here so every collection's text reads
 * the same, and no page re-styles paragraphs on its own.
 */
export function Prose({ source, className }: { source: string; className?: string }) {
  if (!source.trim()) return null

  return (
    <div
      className={cn(
        'text-ink/90 max-w-[38rem] text-[1.0625rem] leading-[1.85]',
        '[&_p]:mt-5 [&_p:first-child]:mt-0',
        '[&_h2]:font-display [&_h2]:mt-12 [&_h2]:text-2xl',
        '[&_h3]:font-display [&_h3]:mt-9 [&_h3]:text-xl',
        '[&_blockquote]:border-brass/50 [&_blockquote]:font-display [&_blockquote]:text-ink [&_blockquote]:my-8 [&_blockquote]:border-s-2 [&_blockquote]:ps-5 [&_blockquote]:text-xl [&_blockquote]:leading-relaxed',
        '[&_li]:mt-2 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:ps-6',
        '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:ps-6',
        '[&_hr]:border-rule [&_hr]:my-12',
        '[&_a]:text-ink [&_a]:decoration-brass-soft [&_a]:underline',
        className,
      )}
    >
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
          },
        }}
      />
    </div>
  )
}
