import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI HUB - NEWS | Advanced Agricultural Intelligence Platform',
    short_name: 'AI HUB - NEWS',
    description: 'AI HUB - NEWS - Revolutionary AI platform featuring AGRI LENS v2 agricultural intelligence, crop forecasting, yield prediction, plant health detection, ESG tracking, and comprehensive agricultural analytics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e17',
    theme_color: '#7CC8FF',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    categories: [
      'agriculture', 'artificial intelligence', 'technology', 'sustainability',
      'farming', 'crop forecasting', 'environmental monitoring', 'precision agriculture'
    ],
    lang: 'tr-TR',
    orientation: 'portrait-primary',
    scope: '/',
    id: 'ai-hub-news-newsai-earth',
  }
}
