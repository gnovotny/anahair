const FALLBACK_WEBSITE_URL = 'https://www.ananovotny.ch'

module.exports = {
  siteUrl: process.env.WEBSITE_URL || FALLBACK_WEBSITE_URL,
  generateRobotsTxt: true, // (optional)
  exclude: ['/404', '/500', '/de/404', '/de/500'],
  generateIndexSitemap: false,
  alternateRefs: [
    {
      href: process.env.WEBSITE_URL || FALLBACK_WEBSITE_URL,
      hreflang: 'en',
    },
    {
      href: `${process.env.WEBSITE_URL || FALLBACK_WEBSITE_URL}/de`,
      hreflang: 'de',
    },
  ],
  // Custom transform function to de-duplicate path locale strings in alternateRefs
  // Without this we get things like https://<domain>/es/es/about rather than https://<domain>/es/about
  // NOTE: This is made to work for path-based localisation scheme (https://<domain>/<locale>/<path>). It may not
  // work if you're using subdomains or separate domains for localisation.
  transform: async (config, path) => {
    // Remove the locale part of the path (e.g. /es/about -> /about)
    const extractLocaleIndependentPath = (path) => {
      const matches = config.alternateRefs.map((alt) =>
        `${config.siteUrl}${path}`.replace(alt.href, '').replace(/\/$/, '')
      )
      return matches.sort((a, b) => a.length - b.length)[0]
    }

    const localeIndependentPath = extractLocaleIndependentPath(path)

    // Map the locale independent path onto the locale paths
    const alternateRefs = config.alternateRefs.map((alt) => {
      return { ...alt, href: `${alt.href}${localeIndependentPath}`, hrefIsAbsolute: true }
    })

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        [process.env.VERCEL_ENV !== 'preview' && process.env.VERCEL_ENV !== 'development' ? 'allow' : 'disallow']: '/',
      },
    ],
  },
}
