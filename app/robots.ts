export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/minside', '/registrering', '/admin', '/booking'],
    },
    sitemap: 'https://mathopenkattepensjonat.no/sitemap.xml',
  }
}
