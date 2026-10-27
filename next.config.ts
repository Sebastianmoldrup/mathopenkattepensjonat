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
      // Next.js rejects a Server Action request outright (before any of
      // our code runs, with a generic error) if the request's Origin
      // header doesn't exactly match the app's own host -- a CSRF guard.
      // The canonical domain is www.mathopenkattepensjonat.no, but the
      // bare apex domain likely also reaches this same deployment --
      // anyone landing on the apex form (a bookmark, a shared link,
      // address-bar autocomplete dropping the "www") would otherwise get
      // every Server Action silently rejected, 100% consistently for
      // them, with nothing wrong on their account/data/connection at all.
      // See the 2026-10-19 FIXLOG entry -- this matches the exact
      // "always fails in Safari, always works after switching to Chrome"
      // pattern reported, since browsers differ in how aggressively they
      // normalize/autocomplete a typed-or-bookmarked bare domain.
      allowedOrigins: [
        'www.mathopenkattepensjonat.no',
        'mathopenkattepensjonat.no',
      ],
    },
  },
  cacheComponents: true,
}

export default nextConfig
