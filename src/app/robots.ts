import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/',
          '/tmp/',
          '/*.json$',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/ai-lens/',
          '/',
        ],
        disallow: [
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://newsai.earth/sitemap.xml',
    host: 'https://newsai.earth',
  }
}
