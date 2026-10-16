import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      // The add-cat forms allow photos up to 4.4MB, but the actual
      // request also carries ~20 other form fields plus Server Actions'
      // own request framing on top of the raw file bytes -- the previous
      // 4.5mb limit left only a thin margin, so a photo near the client
      // cap could legitimately get the whole request rejected by Next.js
      // itself before any of our code (including the cats insert) ever
      // runs, with no DB row created and an opaque error shown right as
      // submission starts. Widened well past worst-case overhead.
      bodySizeLimit: '8mb',
    },
  },
  cacheComponents: true,
}

export default nextConfig
