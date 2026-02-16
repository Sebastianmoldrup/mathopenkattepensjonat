export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/minside'],
    },
    sitemap: 'https://mathopenkattepensjonat.no/sitemap.xml',
  }
}
