import { NextResponse } from "next/server";
import { fetchDecisions } from "./fetcher";
import OpenAI from "openai";

let _openaiClient: OpenAI | null = null;
function getOpenAI() {
  try {
    if (_openaiClient) return _openaiClient;
    if (!process.env.OPENAI_API_KEY) return null;
    _openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _openaiClient;
  } catch (e) {
    console.warn('getOpenAI init failed', e);
    return null;
  }
}

// Cache management
let cachedData: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 1800000; // 30 minutes

// OpenAI çeviri fonksiyonu - geliştirilmiş
async function translateOpenAI(text: string, targetLang: string, sourceLanguage: string): Promise<string> {
  const client = getOpenAI();
  if (!client) return text;
  
  // Çeviri gerekli mi kontrol et
  if (sourceLanguage === targetLang) return text;
  
  try {
    const langNames = {
      'tr': 'Turkish',
      'en': 'English', 
      'de': 'German',
      'fr': 'French',
      'es': 'Spanish',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic'
    };

    const targetLangName = langNames[targetLang as keyof typeof langNames] || targetLang;
    const prompt = `Translate the following government policy text to ${targetLangName}. Keep technical terms accurate and maintain formal tone: "${text}"`;
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.3
    });
    
    return completion.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.warn('Translation failed:', error);
    return text;
  }
}

// Batch translation for better performance
async function batchTranslate(decisions: any[], targetLang: string): Promise<any[]> {
  const client = getOpenAI();
  if (!client || targetLang === 'tr') return decisions;

  try {
    // Group by source language for efficient translation
    const groupedByLang = decisions.reduce((acc, decision) => {
      if (!acc[decision.language]) acc[decision.language] = [];
      acc[decision.language].push(decision);
      return acc;
    }, {});

    const translatedDecisions = [];

    for (const [sourceLang, langDecisions] of Object.entries(groupedByLang) as any[]) {
      if (sourceLang === targetLang) {
        translatedDecisions.push(...langDecisions);
        continue;
      }

      // Batch process translations
      const batchSize = 5;
      for (let i = 0; i < langDecisions.length; i += batchSize) {
        const batch = langDecisions.slice(i, i + batchSize);
        const translationPromises = batch.map(async (decision: any) => ({
          ...decision,
          subject: await translateOpenAI(decision.subject, targetLang, sourceLang),
          description: await translateOpenAI(decision.description, targetLang, sourceLang),
          language: targetLang
        }));

        const translatedBatch = await Promise.all(translationPromises);
        translatedDecisions.push(...translatedBatch);
      }
    }

    return translatedDecisions;
  } catch (error) {
    console.warn('Batch translation failed:', error);
    return decisions;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const ministry = searchParams.get("ministry");
  const type = searchParams.get("type");
  const lang = searchParams.get("lang") || "tr";
  const forceRefresh = searchParams.get("refresh") === "true";

  try {
    // Cache management
    const now = Date.now();
    let decisions;

    if (!forceRefresh && cachedData && (now - cacheTime) < CACHE_DURATION) {
      decisions = cachedData;
    } else {
      decisions = await fetchDecisions();
      cachedData = decisions;
      cacheTime = now;
    }

    // Apply filters
    let filteredDecisions = [...decisions];
    
    if (country) {
      filteredDecisions = filteredDecisions.filter(d => 
        d.country.toLowerCase().includes(country.toLowerCase()) ||
        d.country === country
      );
    }
    
    if (ministry) {
      filteredDecisions = filteredDecisions.filter(d => 
        d.ministry.toLowerCase().includes(ministry.toLowerCase()) ||
        d.ministry === ministry
      );
    }
    
    if (type) {
      filteredDecisions = filteredDecisions.filter(d => 
        d.type.toLowerCase().includes(type.toLowerCase()) ||
        d.type === type
      );
    }

    // Apply translations
    const translatedDecisions = await batchTranslate(filteredDecisions, lang);

    // Sort by date (most recent first)
    const sortedDecisions = translatedDecisions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Add metadata
    const response = {
      decisions: sortedDecisions,
      metadata: {
        total: sortedDecisions.length,
        countries: [...new Set(sortedDecisions.map(d => d.country))].length,
        ministries: [...new Set(sortedDecisions.map(d => d.ministry))].length,
        types: [...new Set(sortedDecisions.map(d => d.type))].length,
        lastUpdated: new Date(cacheTime).toISOString(),
        fromCache: !forceRefresh && (now - cacheTime) < CACHE_DURATION,
        language: lang,
        filters: {
          country: country || null,
          ministry: ministry || null,
          type: type || null
        }
      }
    };

    // Set appropriate cache headers
    const headers = new Headers();
    headers.set('Cache-Control', forceRefresh ? 'no-cache' : 'public, max-age=1800'); // 30 minutes
    headers.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Decisions API error:', error);
    
    return NextResponse.json({ 
      error: "Failed to fetch decisions", 
      details: process.env.NODE_ENV === 'development' ? error : undefined,
      decisions: [],
      metadata: {
        total: 0,
        error: true,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// Optional: POST endpoint for manual cache refresh
export async function POST(request: Request) {
  try {
    // Force refresh cache
    const decisions = await fetchDecisions();
    cachedData = decisions;
    cacheTime = Date.now();

    return NextResponse.json({ 
      message: "Cache refreshed successfully",
      count: decisions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache refresh error:', error);
    return NextResponse.json({ 
      error: "Failed to refresh cache" 
    }, { status: 500 });
  }
}
