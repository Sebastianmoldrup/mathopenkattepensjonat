export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/minside', '/registrering', '/admin', '/booking'],
    },
    sitemap: 'https://www.mathopenkattepensjonat.no/sitemap.xml',
  }
}
