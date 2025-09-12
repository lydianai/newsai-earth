import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const language = searchParams.get('lang') || 'tr';
    const category = searchParams.get('category') || 'all';
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Mock EarthBrief news data for now
    const mockNews = [
      {
        id: '1',
        title: query.includes('iklim') ? 'Küresel İklim Zirvesi Başladı' : 'AI Teknolojisinde Yeni Gelişmeler',
        summary: query.includes('iklim') 
          ? 'Dünya liderleri İstanbul\'da iklim değişikliği konusunda önemli kararlar aldı.'
          : 'Yapay zeka alanında son gelişmeler sektörü hızla değiştiriyor.',
        content: 'Detailed news content...',
        originalUrl: 'https://example.com/news/1',
        sourceRosette: 'Reuters',
        category: 'environment',
        language: language,
        publishedAt: new Date().toISOString(),
        factScore: 0.92,
        consensusScore: 0.87,
        country: 'Turkey',
        latitude: 41.0082,
        longitude: 28.9784,
        tags: ['iklim', 'çevre', 'politika'],
        imageUrl: null
      },
      {
        id: '2',
        title: 'Türkiye\'de Yenilenebilir Enerji Atılımı',
        summary: 'Rüzgar ve güneş enerjisinden elde edilen elektrik üretimi %35 arttı.',
        content: 'Detailed energy content...',
        originalUrl: 'https://example.com/news/2',
        sourceRosette: 'BBC',
        category: 'energy',
        language: language,
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        factScore: 0.89,
        consensusScore: 0.84,
        country: 'Turkey',
        latitude: 39.9334,
        longitude: 32.8597,
        tags: ['enerji', 'yenilenebilir', 'türkiye'],
        imageUrl: null
      }
    ];

    const filteredNews = category === 'all' 
      ? mockNews 
      : mockNews.filter(news => news.category === category);

    return NextResponse.json({
      articles: filteredNews,
      total: filteredNews.length,
      query,
      language,
      category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('EarthBrief API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'verify_fact':
        // Mock fact verification
        return NextResponse.json({
          factScore: Math.random() * 0.3 + 0.7, // 70-100%
          consensusScore: Math.random() * 0.3 + 0.6, // 60-90%
          sources: ['Reuters', 'BBC', 'Guardian'],
          verificationDetails: {
            claim: data.claim,
            evidence: ['Supporting evidence 1', 'Supporting evidence 2'],
            contradictions: [],
            confidence: 'high'
          }
        });

      case 'translate_article':
        // Mock translation
        return NextResponse.json({
          translatedTitle: `[${data.targetLang}] ${data.title}`,
          translatedSummary: `[Translated to ${data.targetLang}] ${data.summary}`,
          originalLanguage: data.sourceLang,
          targetLanguage: data.targetLang
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('EarthBrief POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
