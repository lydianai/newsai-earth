import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface HarvestCalendarParams {
  country?: string;
  crop?: string;
  region?: string;
}

interface SeasonWindow {
  start: string; // Month-day format: "03-15"
  end: string;   // Month-day format: "05-30"
  phase: 'planting' | 'growing' | 'harvest';
  notes?: string;
}

interface HarvestData {
  crop: string;
  country: string;
  planting_window: SeasonWindow[];
  harvest_window: SeasonWindow[];
  notes: string;
  confidence: number; // 0-1 data reliability
  sources: string[];
}

// Köppen-Geiger climate zone mappings for fallback
const CLIMATE_FALLBACKS: { [key: string]: { [crop: string]: Partial<HarvestData> } } = {
  'Csa': { // Mediterranean hot-summer
    wheat: {
      crop: 'wheat',
      country: 'generic',
      planting_window: [{ start: '10-01', end: '12-31', phase: 'planting' }],
      harvest_window: [{ start: '06-01', end: '07-31', phase: 'harvest' }],
      notes: 'Winter wheat pattern for Mediterranean climate',
      confidence: 0.6,
      sources: ['climate-heuristic']
    },
    olive: {
      crop: 'olive',
      country: 'generic', 
      planting_window: [{ start: '03-01', end: '05-31', phase: 'planting' }],
      harvest_window: [{ start: '10-01', end: '12-31', phase: 'harvest' }],
      notes: 'Mediterranean olive cultivation pattern',
      confidence: 0.7,
      sources: ['climate-heuristic']
    }
  },
  'Cfb': { // Oceanic climate
    wheat: {
      crop: 'wheat',
      country: 'generic',
      planting_window: [{ start: '09-01', end: '11-30', phase: 'planting' }],
      harvest_window: [{ start: '07-01', end: '09-30', phase: 'harvest' }],
      notes: 'Temperate oceanic wheat pattern',
      confidence: 0.6,
      sources: ['climate-heuristic']
    }
  },
  'BSk': { // Cold semi-arid
    barley: {
      crop: 'barley',
      country: 'generic',
      planting_window: [{ start: '03-01', end: '05-31', phase: 'planting' }],
      harvest_window: [{ start: '07-01', end: '09-30', phase: 'harvest' }],
      notes: 'Semi-arid barley cultivation',
      confidence: 0.5,
      sources: ['climate-heuristic']
    }
  }
};

// GET /api/agri/harvest - Fetch harvest calendar data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const crop = searchParams.get('crop');
    const region = searchParams.get('region');

    if (!country && !crop) {
      return NextResponse.json({
        success: false,
        error: 'Either country or crop parameter is required'
      }, { status: 400 });
    }

    // Query database for specific crop-country profiles
    const profiles = await prisma.cropCountryProfile.findMany({
      where: {
        ...(country && {
          country: {
            iso2: country.toUpperCase()
          }
        }),
        ...(crop && {
          crop: {
            OR: [
              { name_en: { contains: crop, mode: 'insensitive' } },
              { name_tr: { contains: crop, mode: 'insensitive' } },
              { synonyms: { has: crop } }
            ]
          }
        })
      },
      include: {
        crop: {
          select: {
            name_en: true,
            name_tr: true,
            synonyms: true,
            category: true,
            growth_stages: true,
            water_need: true
          }
        },
        country: {
          select: {
            iso2: true,
            name_en: true,
            climate_zones: true,
            latitude: true,
            longitude: true
          }
        }
      },
      orderBy: {
        production_avg: 'desc'
      },
      take: 20
    });

    const results: HarvestData[] = [];

    // Process database results
    for (const profile of profiles) {
      if (profile.planting_window || profile.harvest_window) {
        const harvestData: HarvestData = {
          crop: profile.crop.name_en,
          country: profile.country.name_en,
          planting_window: parseSeasonWindow(profile.planting_window, 'planting'),
          harvest_window: parseSeasonWindow(profile.harvest_window, 'harvest'),
          notes: profile.season_notes || '',
          confidence: 0.8, // High confidence for database data
          sources: ['faostat', 'database']
        };
        results.push(harvestData);
      }
    }

    // If no database results, try climate-based fallbacks
    if (results.length === 0 && country && crop) {
      const countryData = await prisma.country.findFirst({
        where: { iso2: country.toUpperCase() },
        select: { climate_zones: true, name_en: true }
      });

      if (countryData?.climate_zones.length) {
        for (const zone of countryData.climate_zones) {
          const fallback = CLIMATE_FALLBACKS[zone]?.[crop.toLowerCase()];
          if (fallback) {
            results.push({
              ...fallback,
              country: countryData.name_en,
              crop: crop,
              notes: `${fallback.notes} (Climate zone: ${zone})`,
            } as HarvestData);
            break; // Use first matching fallback
          }
        }
      }
    }

    // If still no results, provide generic seasonal advice
    if (results.length === 0) {
      results.push({
        crop: crop || 'generic',
        country: country || 'global',
        planting_window: [{ start: '03-01', end: '05-31', phase: 'planting' }],
        harvest_window: [{ start: '08-01', end: '10-31', phase: 'harvest' }],
        notes: 'Generic seasonal pattern. Consult local agricultural extension services for specific guidance.',
        confidence: 0.3,
        sources: ['generic-fallback']
      });
    }

    return NextResponse.json({
      success: true,
      data: results,
      metadata: {
        total: results.length,
        has_specific_data: profiles.length > 0,
        fallback_used: profiles.length === 0 && results.length > 0
      }
    });

  } catch (error) {
    console.error('Harvest calendar API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch harvest calendar data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// Helper function to parse season windows from string format
function parseSeasonWindow(windowStr: string | null, phase: 'planting' | 'harvest'): SeasonWindow[] {
  if (!windowStr) return [];
  
  try {
    // Handle formats like "March-May", "September-November", "Oct-Dec"
    const months: { [key: string]: string } = {
      'january': '01', 'jan': '01',
      'february': '02', 'feb': '02', 
      'march': '03', 'mar': '03',
      'april': '04', 'apr': '04',
      'may': '05',
      'june': '06', 'jun': '06',
      'july': '07', 'jul': '07',
      'august': '08', 'aug': '08',
      'september': '09', 'sep': '09', 'sept': '09',
      'october': '10', 'oct': '10',
      'november': '11', 'nov': '11',
      'december': '12', 'dec': '12'
    };

    const parts = windowStr.toLowerCase().split('-');
    if (parts.length >= 2) {
      const startMonth = months[parts[0].trim()] || '01';
      const endMonth = months[parts[1].trim()] || '12';
      
      return [{
        start: `${startMonth}-01`,
        end: `${endMonth}-28`, // Conservative end date
        phase,
        notes: `Typical ${phase} season`
      }];
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing season window:', windowStr, error);
    return [];
  }
}

// POST /api/agri/harvest - Bulk import harvest data (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    // TODO: Add admin authentication
    
    const results = [];
    
    for (const item of data) {
      // Update or create crop-country profile with season data
      const updated = await prisma.cropCountryProfile.upsert({
        where: {
          cropId_countryId: {
            cropId: item.cropId,
            countryId: item.countryId
          }
        },
        update: {
          planting_window: item.planting_window,
          harvest_window: item.harvest_window,
          season_notes: item.season_notes
        },
        create: {
          cropId: item.cropId,
          countryId: item.countryId,
          planting_window: item.planting_window,
          harvest_window: item.harvest_window,
          season_notes: item.season_notes,
          area_avg: item.area_avg,
          yield_avg: item.yield_avg,
          production_avg: item.production_avg
        }
      });
      
      results.push(updated);
    }

    return NextResponse.json({
      success: true,
      data: results,
      imported: results.length
    });

  } catch (error) {
    console.error('Harvest POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to import harvest data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
