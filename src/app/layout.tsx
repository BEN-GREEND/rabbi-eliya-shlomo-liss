import type { Metadata, Viewport } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getSite } from '@/lib/site'
import '@/styles/globals.css'

const site = getSite()

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#f7f4ee',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="label-caps focus:bg-paper focus:text-ink sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:shadow-sm"
        >
          דילוג לתוכן הראשי
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
