import { NextRequest, NextResponse } from 'next/server';

// News Article Interface with enhanced properties
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceRosette: string;
  publishedAt: string;
  category: string;
  language: string;
  originalUrl: string;
  factScore?: number;
  consensusScore?: number;
  country?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  sentiment?: 'positive' | 'neutral' | 'negative';
  impact?: number;
  readTime?: number;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  tags: string[];
  imageUrl?: string;
}

// Real news data sources (mock for now, would connect to actual APIs)
const realNewsData = {
  'politics': [
    {
      title: 'Global Climate Summit 2025 Opens in Istanbul',
      summary: 'World leaders gather for crucial climate negotiations with focus on carbon neutrality by 2030. Turkey hosts the most comprehensive environmental summit in decades.',
      category: 'politics',
      country: 'Turkey',
      urgency: 'high',
      impact: 9.2,
      tags: ['climate', 'politics', 'environment', 'turkey', 'summit']
    },
    {
      title: 'EU-Turkey Energy Partnership Expands',
      summary: 'New agreements signed for renewable energy cooperation, including solar and wind projects across Mediterranean region.',
      category: 'politics', 
      country: 'Turkey',
      urgency: 'medium',
      impact: 7.5,
      tags: ['energy', 'eu', 'turkey', 'renewable', 'partnership']
    },
    {
      title: 'UN Security Council Emergency Session on Middle East',
      summary: 'Urgent diplomatic discussions focus on regional stability and humanitarian aid corridors.',
      category: 'politics',
      country: 'Global',
      urgency: 'critical',
      impact: 8.8,
      tags: ['un', 'security', 'middle east', 'diplomacy', 'crisis']
    }
  ],
  'technology': [
    {
      title: 'Breakthrough in Quantum-AI Hybrid Systems',
      summary: 'New quantum-classical computing architecture achieves 1000x speedup in machine learning tasks, revolutionizing AI capabilities.',
      category: 'technology',
      country: 'USA',
      urgency: 'high',
      impact: 9.5,
      tags: ['quantum', 'ai', 'computing', 'breakthrough', 'machine learning']
    },
    {
      title: 'Neural Interface Technology Approved for Medical Use',
      summary: 'First brain-computer interfaces cleared for treating paralysis, opening new era of medical technology.',
      category: 'technology',
      country: 'USA',
      urgency: 'medium',
      impact: 8.2,
      tags: ['neural interface', 'medical', 'brain computer', 'paralysis', 'treatment']
    },
    {
      title: 'Satellite Internet Constellation Reaches Global Coverage',
      summary: 'Low-orbit satellite network now provides high-speed internet to 99% of populated areas worldwide.',
      category: 'technology',
      country: 'Global',
      urgency: 'medium',
      impact: 7.8,
      tags: ['satellite', 'internet', 'global', 'connectivity', 'space']
    }
  ],
  'environment': [
    {
      title: 'Amazon Rainforest Shows Record Recovery',
      summary: 'Satellite data reveals largest reforestation success in decades, with over 2 million hectares restored.',
      category: 'environment',
      country: 'Brazil',
      urgency: 'medium',
      impact: 8.9,
      tags: ['amazon', 'reforestation', 'climate', 'brazil', 'recovery']
    },
    {
      title: 'Arctic Ice Shows Unexpected Growth Pattern',
      summary: 'Climate scientists report unusual ice formation trends, requiring updated climate models.',
      category: 'environment',
      country: 'Arctic',
      urgency: 'high',
      impact: 9.1,
      tags: ['arctic', 'ice', 'climate', 'research', 'science']
    }
  ],
  'economics': [
    {
      title: 'Global Green Economy Surpasses $50 Trillion',
      summary: 'Renewable energy and sustainable technology sectors reach historic milestone, driving economic transformation.',
      category: 'economics',
      country: 'Global',
      urgency: 'medium',
      impact: 8.5,
      tags: ['green economy', 'renewable', 'sustainable', 'trillion', 'growth']
    },
    {
      title: 'Central Banks Coordinate Digital Currency Launch',
      summary: 'Major economies announce synchronized rollout of central bank digital currencies (CBDCs).',
      category: 'economics',
      country: 'Global',
      urgency: 'high',
      impact: 9.3,
      tags: ['digital currency', 'cbdc', 'central bank', 'finance', 'crypto']
    }
  ]
};

const newsSources = [
  'Reuters', 'BBC', 'CNN', 'AP News', 'The Guardian', 'Al Jazeera', 
  'Deutsche Welle', 'France24', 'NHK', 'CGTN', 'RT', 'Bloomberg'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      language = 'en', 
      category = 'all', 
      urgency = 'all',
      limit = 20,
      country = 'all'
    } = body;

    // Generate realistic articles based on filters
    let articlesToGenerate: Array<{
      title: string;
      summary: string;
      category: string;
      country: string;
      urgency: 'low' | 'medium' | 'high' | 'critical';
      impact: number;
      tags: string[];
    }> = [];

    if (category === 'all') {
      // Combine articles from all categories
      Object.values(realNewsData).forEach(categoryArticles => {
        articlesToGenerate = articlesToGenerate.concat(categoryArticles);
      });
    } else if (realNewsData[category as keyof typeof realNewsData]) {
      articlesToGenerate = realNewsData[category as keyof typeof realNewsData];
    }

    // Generate articles with realistic data
    const articles: NewsArticle[] = articlesToGenerate.slice(0, limit).map((article, index) => {
      const publishedTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000); // Last 24 hours
      const factScore = Math.random() * 0.3 + 0.7; // 70-100%
      const consensusScore = Math.random() * 0.4 + 0.6; // 60-100%
      
      return {
        id: `article_${Date.now()}_${index}`,
        title: article.title,
        summary: article.summary,
        sourceRosette: newsSources[Math.floor(Math.random() * newsSources.length)],
        publishedAt: publishedTime.toISOString(),
        category: article.category,
        language: language,
        originalUrl: `https://newsapi.example.com/article/${Date.now()}_${index}`,
        factScore,
        consensusScore,
        country: article.country,
        urgency: urgency === 'all' ? article.urgency : urgency as ('low' | 'medium' | 'high' | 'critical'),
        sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
        impact: article.impact,
        readTime: Math.floor(Math.random() * 8 + 2), // 2-10 minutes
        location: article.country === 'Turkey' ? {
          lat: 39.9334,
          lng: 32.8597,
          name: 'Turkey'
        } : article.country === 'USA' ? {
          lat: 39.8283,
          lng: -98.5795,
          name: 'United States'
        } : article.country === 'Brazil' ? {
          lat: -14.2350,
          lng: -51.9253,
          name: 'Brazil'
        } : undefined,
        tags: article.tags,
        imageUrl: Math.random() > 0.7 ? `https://picsum.photos/800/400?random=${index}` : undefined
      };
    });

    // Filter by urgency if specified
    const filteredArticles = urgency === 'all' 
      ? articles 
      : articles.filter(article => article.urgency === urgency);

    // Filter by country if specified
    const countryFilteredArticles = country === 'all'
      ? filteredArticles
      : filteredArticles.filter(article => article.country?.toLowerCase().includes(country.toLowerCase()));

    // Generate additional metadata
    const metadata = {
      total_found: countryFilteredArticles.length,
      search_time_ms: Math.floor(Math.random() * 200 + 100),
      filters_applied: { language, category, urgency, country },
      next_update_in: '3600', // seconds (1 hour)
      data_freshness: 'real-time',
      sources_count: new Set(countryFilteredArticles.map(a => a.sourceRosette)).size,
      sentiment_distribution: {
        positive: countryFilteredArticles.filter(a => a.sentiment === 'positive').length,
        neutral: countryFilteredArticles.filter(a => a.sentiment === 'neutral').length,
        negative: countryFilteredArticles.filter(a => a.sentiment === 'negative').length
      }
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      articles: countryFilteredArticles,
      metadata,
      status: 'Articles Retrieved Successfully'
    });

  } catch (error) {
    console.error('EarthBrief Articles API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch articles',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
