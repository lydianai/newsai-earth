import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hf } from '@/lib/hf';

interface SupplyChainEvent {
  id?: string;
  type: 'PORT_DELAY' | 'TRANSPORTATION_DISRUPTION' | 'STORAGE_SHORTAGE' | 'TRADE_RESTRICTION' | 'NATURAL_DISASTER' | 'LABOR_SHORTAGE' | 'FUEL_PRICE_SPIKE' | 'CURRENCY_FLUCTUATION' | 'OTHER';
  location: {
    latitude: number;
    longitude: number;
    name: string;
    country?: string;
  };
  title: string;
  description?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  started_at: string; // ISO date
  ended_at?: string;  // ISO date
  crops_affected?: string[];
  regions_affected?: string[];
  economic_impact?: number; // USD millions
  source: {
    type: 'feed' | 'news' | 'manual';
    url?: string;
    reliability: number; // 0-1
  };
}

// Major global ports and logistics hubs
const MAJOR_PORTS = [
  { name: 'Shanghai', country: 'CN', lat: 31.2304, lon: 121.4737, importance: 1.0 },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198, importance: 0.95 },
  { name: 'Ningbo-Zhoushan', country: 'CN', lat: 29.8683, lon: 121.544, importance: 0.9 },
  { name: 'Rotterdam', country: 'NL', lat: 51.9244, lon: 4.4777, importance: 0.85 },
  { name: 'Hamburg', country: 'DE', lat: 53.5511, lon: 9.9937, importance: 0.8 },
  { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437, importance: 0.85 },
  { name: 'Long Beach', country: 'US', lat: 33.7701, lon: -118.1937, importance: 0.8 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060, importance: 0.8 },
  { name: 'Antwerp', country: 'BE', lat: 51.2194, lon: 4.4025, importance: 0.75 },
  { name: 'Felixstowe', country: 'GB', lat: 51.9640, lon: 1.3518, importance: 0.7 },
  { name: 'Istanbul', country: 'TR', lat: 41.0082, lon: 28.9784, importance: 0.7 },
  { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777, importance: 0.65 }
];

// Supply chain event generator for demonstration
class SupplyEventGenerator {
  static generateDemoEvents(): SupplyChainEvent[] {
    const events: SupplyChainEvent[] = [];
    const now = new Date();
    
    // Generate some realistic demo events
    const scenarios = [
      {
        type: 'PORT_DELAY' as const,
        port: MAJOR_PORTS[0], // Shanghai
        title: 'Port congestion causing delays',
        description: 'Heavy container traffic leading to 3-5 day delays',
        severity: 'MEDIUM' as const,
        days_ago: 2,
        duration_days: 7,
        crops: ['wheat', 'soybeans'],
        regions: ['Asia-Pacific'],
        impact: 125.5
      },
      {
        type: 'FUEL_PRICE_SPIKE' as const,
        port: MAJOR_PORTS[3], // Rotterdam
        title: 'Fuel price increase affects shipping costs',
        description: 'Marine fuel prices up 15% affecting trans-Atlantic routes',
        severity: 'HIGH' as const,
        days_ago: 1,
        duration_days: 14,
        crops: ['corn', 'wheat', 'barley'],
        regions: ['Europe', 'North America'],
        impact: 890.2
      },
      {
        type: 'NATURAL_DISASTER' as const,
        port: MAJOR_PORTS[1], // Singapore
        title: 'Tropical storm disrupts shipping lanes',
        description: 'Storm system causing route diversions in Southeast Asia',
        severity: 'HIGH' as const,
        days_ago: 0,
        duration_days: 5,
        crops: ['rice', 'palm oil'],
        regions: ['Southeast Asia'],
        impact: 450.8
      },
      {
        type: 'LABOR_SHORTAGE' as const,
        port: MAJOR_PORTS[5], // Los Angeles
        title: 'Dock worker shortage slows operations',
        description: 'Staff shortages reducing port capacity by 30%',
        severity: 'MEDIUM' as const,
        days_ago: 5,
        duration_days: 10,
        crops: ['fruits', 'vegetables'],
        regions: ['North America'],
        impact: 275.0
      },
      {
        type: 'TRADE_RESTRICTION' as const,
        port: MAJOR_PORTS[10], // Istanbul
        title: 'New trade documentation requirements',
        description: 'Additional paperwork causing processing delays',
        severity: 'LOW' as const,
        days_ago: 7,
        duration_days: 30,
        crops: ['wheat', 'barley', 'sunflower'],
        regions: ['Europe', 'Middle East'],
        impact: 85.5
      }
    ];

    scenarios.forEach((scenario, index) => {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - scenario.days_ago);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + scenario.duration_days);

      events.push({
        id: `demo-${index}`,
        type: scenario.type,
        location: {
          latitude: scenario.port.lat,
          longitude: scenario.port.lon,
          name: scenario.port.name,
          country: scenario.port.country
        },
        title: scenario.title,
        description: scenario.description,
        severity: scenario.severity,
        started_at: startDate.toISOString(),
        ended_at: endDate > now ? undefined : endDate.toISOString(),
        crops_affected: scenario.crops,
        regions_affected: scenario.regions,
        economic_impact: scenario.impact,
        source: {
          type: 'feed',
          url: `https://demo-source.com/event-${index}`,
          reliability: 0.8 + (Math.random() * 0.15) // 80-95% reliability
        }
      });
    });

    return events;
  }

  static async enrichWithAI(events: SupplyChainEvent[]): Promise<SupplyChainEvent[]> {
    try {
      // Use HF classification to categorize and assess impact
      for (const event of events) {
        if (process.env.HUGGINGFACE_API_KEY && event.description) {
          try {
            // Classify severity impact using HF classification
            const severityLabels = ['minor disruption', 'moderate impact', 'severe disruption', 'critical crisis'];
            const classification = await hf.classify(
              event.description,
              severityLabels
            );
            
            // Update severity based on AI analysis
            const topLabel = classification.data?.labels?.[0] || 'moderate impact';
            if (topLabel === 'critical crisis') event.severity = 'CRITICAL';
            else if (topLabel === 'severe disruption') event.severity = 'HIGH';
            else if (topLabel === 'moderate impact') event.severity = 'MEDIUM';
            else event.severity = 'LOW';
            
          } catch (aiError) {
            console.warn('AI enrichment failed for event:', event.id, aiError);
          }
        }
      }
    } catch (error) {
      console.warn('AI enrichment not available:', error);
    }
    
    return events;
  }
}

// Real-world data source adapters (mock implementations)
class SupplyDataSources {
  // Maritime traffic and port data
  static async fetchPortDelays(): Promise<SupplyChainEvent[]> {
    // In production, would connect to:
    // - MarineTraffic API
    // - Port authority feeds
    // - Shipping line APIs
    
    const demoEvents = SupplyEventGenerator.generateDemoEvents()
      .filter(e => e.type === 'PORT_DELAY');
      
    return demoEvents;
  }

  // News and trade publication monitoring
  static async fetchTradeNews(): Promise<SupplyChainEvent[]> {
    // In production, would use:
    // - Reuters Trade API
    // - Bloomberg Trade feeds
    // - FT.com trade news
    // - Lloyd's List
    
    const demoEvents = SupplyEventGenerator.generateDemoEvents()
      .filter(e => ['TRADE_RESTRICTION', 'FUEL_PRICE_SPIKE'].includes(e.type));
      
    return demoEvents;
  }

  // Weather and natural disaster impacts
  static async fetchWeatherDisruptions(): Promise<SupplyChainEvent[]> {
    // In production, would integrate:
    // - National Weather Service
    // - European Centre for Medium-Range Weather Forecasts
    // - Tropical cyclone tracking
    
    const demoEvents = SupplyEventGenerator.generateDemoEvents()
      .filter(e => e.type === 'NATURAL_DISASTER');
      
    return demoEvents;
  }

  // Labor and industrial action monitoring
  static async fetchLaborEvents(): Promise<SupplyChainEvent[]> {
    // In production, would monitor:
    // - Port labor union announcements
    // - Strike tracking services
    // - Industrial relations feeds
    
    const demoEvents = SupplyEventGenerator.generateDemoEvents()
      .filter(e => e.type === 'LABOR_SHORTAGE');
      
    return demoEvents;
  }
}

// GET /api/agri/supply/events - Fetch supply chain disruption events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Event type filter
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const severity = searchParams.get('severity');
    const active_only = searchParams.get('active_only') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const format = searchParams.get('format') || 'json'; // 'json' | 'geojson'

    // First, try to get events from database
    let dbEvents: any[] = [];
    try {
      const where: any = {};
      
      if (type) where.event_type = type;
      if (severity) where.severity = severity;
      if (country) where.countryId = { country: { iso2: country.toUpperCase() } };
      if (active_only) where.ended_at = null;
      
      dbEvents = await prisma.supplyEvent.findMany({
        where,
        include: {
          country: {
            select: { iso2: true, name_en: true }
          }
        },
        orderBy: { started_at: 'desc' },
        take: limit
      });
    } catch (dbError) {
      console.warn('Database query failed, using demo data:', dbError);
    }

    // If no database events, generate demo events
    let events: SupplyChainEvent[] = [];
    
    if (dbEvents.length === 0) {
      // Fetch from various sources
      const [portDelays, tradeNews, weatherEvents, laborEvents] = await Promise.all([
        SupplyDataSources.fetchPortDelays(),
        SupplyDataSources.fetchTradeNews(),
        SupplyDataSources.fetchWeatherDisruptions(),
        SupplyDataSources.fetchLaborEvents()
      ]);
      
      events = [...portDelays, ...tradeNews, ...weatherEvents, ...laborEvents];
      
      // Apply filters
      if (type) events = events.filter(e => e.type === type);
      if (severity) events = events.filter(e => e.severity === severity);
      if (country) events = events.filter(e => e.location.country === country.toUpperCase());
      if (region) events = events.filter(e => e.regions_affected?.includes(region));
      if (active_only) events = events.filter(e => !e.ended_at);
      
      events = events.slice(0, limit);
      
      // Enrich with AI analysis
      events = await SupplyEventGenerator.enrichWithAI(events);
    } else {
      // Convert database events to our format
      events = dbEvents.map(dbEvent => ({
        id: dbEvent.id,
        type: dbEvent.event_type as any,
        location: {
          latitude: dbEvent.latitude || 0,
          longitude: dbEvent.longitude || 0,
          name: dbEvent.location_name || 'Unknown',
          country: dbEvent.country?.iso2
        },
        title: dbEvent.title,
        description: dbEvent.description || undefined,
        severity: dbEvent.severity as any,
        started_at: dbEvent.started_at.toISOString(),
        ended_at: dbEvent.ended_at?.toISOString(),
        crops_affected: dbEvent.crops_affected,
        regions_affected: dbEvent.regions_affected,
        economic_impact: dbEvent.economic_impact || undefined,
        source: {
          type: dbEvent.source_type as any,
          url: dbEvent.source_url || undefined,
          reliability: dbEvent.source_reliability || 0.7
        }
      }));
    }

    // Return GeoJSON format if requested
    if (format === 'geojson') {
      const features = events.map(event => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.location.longitude, event.location.latitude]
        },
        properties: {
          id: event.id,
          type: event.type,
          title: event.title,
          description: event.description,
          severity: event.severity,
          started_at: event.started_at,
          ended_at: event.ended_at,
          crops_affected: event.crops_affected,
          economic_impact: event.economic_impact,
          source: event.source
        }
      }));

      return NextResponse.json({
        type: 'FeatureCollection',
        features,
        metadata: {
          total: events.length,
          generated_at: new Date().toISOString(),
          filters: { type, country, region, severity, active_only }
        }
      });
    }

    // Regular JSON response
    return NextResponse.json({
      success: true,
      data: events,
      metadata: {
        total: events.length,
        active_events: events.filter(e => !e.ended_at).length,
        by_severity: {
          critical: events.filter(e => e.severity === 'CRITICAL').length,
          high: events.filter(e => e.severity === 'HIGH').length,
          medium: events.filter(e => e.severity === 'MEDIUM').length,
          low: events.filter(e => e.severity === 'LOW').length
        },
        by_type: events.reduce((acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        total_economic_impact: events
          .filter(e => e.economic_impact)
          .reduce((sum, e) => sum + (e.economic_impact || 0), 0),
        filters: { type, country, region, severity, active_only }
      }
    });

  } catch (error) {
    console.error('Supply events API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch supply chain events',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// POST /api/agri/supply/events - Create or import supply chain events (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, source = 'manual' } = body;
    
    // TODO: Add admin authentication
    
    if (!Array.isArray(events)) {
      return NextResponse.json({
        success: false,
        error: 'Events must be an array'
      }, { status: 400 });
    }

    const results = [];
    
    for (const eventData of events) {
      try {
        const created = await prisma.supplyEvent.create({
          data: {
            event_type: eventData.type,
            latitude: eventData.location.latitude,
            longitude: eventData.location.longitude,
            location_name: eventData.location.name,
            title: eventData.title,
            description: eventData.description,
            severity: eventData.severity,
            started_at: new Date(eventData.started_at),
            ended_at: eventData.ended_at ? new Date(eventData.ended_at) : null,
            crops_affected: eventData.crops_affected || [],
            regions_affected: eventData.regions_affected || [],
            economic_impact: eventData.economic_impact,
            source_type: eventData.source?.type || source,
            source_url: eventData.source?.url,
            source_reliability: eventData.source?.reliability || 0.7,
            ...(eventData.location.country && {
              country: {
                connect: {
                  iso2: eventData.location.country.toUpperCase()
                }
              }
            })
          }
        });
        
        results.push(created);
      } catch (eventError) {
        console.error('Failed to create event:', eventData.title, eventError);
        results.push({ error: `Failed to create: ${eventData.title}` } as any);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      imported: results.filter((r: any) => !r.error).length,
      failed: results.filter((r: any) => r.error).length
    });

  } catch (error) {
    console.error('Supply events POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to import supply chain events',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
