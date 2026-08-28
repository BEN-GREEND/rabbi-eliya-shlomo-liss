import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Historical scans and photographs. AVIF first, WebP fallback.
    formats: ['image/avif', 'image/webp'],
  },
  // Content lives outside src/ and is read with fs at build time.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
}

export default nextConfig
