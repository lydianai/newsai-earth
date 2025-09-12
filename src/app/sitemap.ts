import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://newsai.earth'
  const currentDate = new Date().toISOString()

  // AI HUB - NEWS modül sayfaları
  const aiLensPages = [
    'earthbrief',
    'digital-twin', 
    'quantum',
    'metaverse',
    'research',
    'knowledge',
    'agents',
    'iot',
    'dashboard',
    'agri',
    'agri/map',
    'agri/markets'
  ].map(page => ({
    url: `${baseUrl}/ai-lens/${page}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // AGRI LENS v2 özel sayfalar
  const agriPages = [
    'taxonomy',
    'harvest',
    'ndvi',
    'yield',
    'supply',
    'health',
    'advice',
    'esg'
  ].map(page => ({
    url: `${baseUrl}/agri/${page}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Diğer ana sayfalar
  const staticPages = [
    '',
    'about',
    'contact', 
    'decisions',
    'login',
    'register',
    'settings',
    'agriculture',
    'biology',
    'chemistry',
    'climate',
    'elements',
    'history',
    'news',
    'chat'
  ].map(page => ({
    url: `${baseUrl}${page ? `/${page}` : ''}`,
    lastModified: currentDate,
    changeFrequency: page === '' ? 'daily' as const : 'weekly' as const,
    priority: page === '' ? 1.0 : 0.6,
  }))

  return [
    ...staticPages,
    ...aiLensPages,
    ...agriPages,
    // API dokümantasyon sayfaları
    {
      url: `${baseUrl}/api-docs`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    }
  ]
}
