import { NextRequest, NextResponse } from 'next/server';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    country: string;
  };
  eventType: 'breaking' | 'ongoing' | 'scheduled' | 'resolved';
  category: 'natural' | 'political' | 'economic' | 'social' | 'technology' | 'health';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  lastUpdate: string;
  sources: string[];
  affectedPeople?: number;
  economicImpact?: number;
  tags: string[];
  status: 'active' | 'monitoring' | 'resolved';
  confidence: number;
  mediaUrls?: string[];
}

// Global live events data
const globalEvents: LiveEvent[] = [
  // Natural Events
  {
    id: 'event_earthquake_turkey_2025',
    title: '5.2 Magnitude Earthquake Near Izmir',
    description: 'Moderate earthquake detected, no significant damage reported. Seismic monitoring continues.',
    location: { lat: 38.4237, lng: 27.1428, name: 'Izmir', country: 'Turkey' },
    eventType: 'resolved',
    category: 'natural',
    severity: 'medium',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sources: ['USGS', 'AFAD', 'Turkish Seismic Network'],
    affectedPeople: 50000,
    tags: ['earthquake', 'turkey', 'seismic', 'izmir'],
    status: 'resolved',
    confidence: 0.95,
  },
  {
    id: 'event_hurricane_atlantic_2025',
    title: 'Hurricane Formation in Atlantic',
    description: 'Tropical system developing into Category 2 hurricane, expected to affect Caribbean islands.',
    location: { lat: 18.2208, lng: -66.5901, name: 'Caribbean Sea', country: 'International Waters' },
    eventType: 'ongoing',
    category: 'natural',
    severity: 'high',
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    sources: ['NOAA', 'Hurricane Center', 'Caribbean Weather'],
    affectedPeople: 2000000,
    economicImpact: 500000000,
    tags: ['hurricane', 'caribbean', 'weather', 'storm'],
    status: 'active',
    confidence: 0.92,
  },

  // Political Events
  {
    id: 'event_summit_istanbul_2025',
    title: 'Climate Summit Opening Ceremony',
    description: 'World leaders gathering for COP31 Climate Summit in Istanbul with major announcements expected.',
    location: { lat: 41.0082, lng: 28.9784, name: 'Istanbul', country: 'Turkey' },
    eventType: 'ongoing',
    category: 'political',
    severity: 'medium',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    sources: ['UN News', 'Reuters', 'AP News'],
    tags: ['climate', 'summit', 'istanbul', 'politics', 'environment'],
    status: 'active',
    confidence: 1.0,
  },
  {
    id: 'event_elections_brazil_2025',
    title: 'Municipal Elections Underway',
    description: 'Local elections in major Brazilian cities showing record voter turnout.',
    location: { lat: -15.7942, lng: -47.8822, name: 'Brasília', country: 'Brazil' },
    eventType: 'ongoing',
    category: 'political',
    severity: 'medium',
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    sources: ['TSE Brazil', 'Globo', 'Folha'],
    affectedPeople: 30000000,
    tags: ['elections', 'brazil', 'democracy', 'voting'],
    status: 'active',
    confidence: 1.0,
  },

  // Economic Events
  {
    id: 'event_market_crash_asia_2025',
    title: 'Asian Markets Show Volatility',
    description: 'Major stock exchanges experiencing fluctuations due to tech sector concerns.',
    location: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', country: 'Japan' },
    eventType: 'ongoing',
    category: 'economic',
    severity: 'medium',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    sources: ['Nikkei', 'Bloomberg', 'Reuters'],
    economicImpact: 2000000000,
    tags: ['markets', 'asia', 'stocks', 'economy', 'volatility'],
    status: 'monitoring',
    confidence: 0.88,
  },

  // Technology Events
  {
    id: 'event_ai_breakthrough_2025',
    title: 'Major AI Breakthrough Announced',
    description: 'Silicon Valley company announces quantum-AI hybrid system with 1000x performance improvement.',
    location: { lat: 37.4419, lng: -122.1430, name: 'Palo Alto', country: 'USA' },
    eventType: 'breaking',
    category: 'technology',
    severity: 'high',
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    sources: ['TechCrunch', 'Wired', 'MIT Technology Review'],
    economicImpact: 10000000000,
    tags: ['ai', 'quantum', 'technology', 'breakthrough', 'silicon valley'],
    status: 'active',
    confidence: 0.94,
  },

  // Health Events
  {
    id: 'event_medical_breakthrough_2025',
    title: 'Neural Interface Therapy Approved',
    description: 'FDA approves first brain-computer interface treatment for paralysis patients.',
    location: { lat: 38.9072, lng: -77.0369, name: 'Washington D.C.', country: 'USA' },
    eventType: 'breaking',
    category: 'health',
    severity: 'medium',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    sources: ['FDA', 'New England Journal', 'Science'],
    affectedPeople: 100000,
    tags: ['medical', 'fda', 'neural interface', 'paralysis', 'treatment'],
    status: 'active',
    confidence: 1.0,
  },

  // Social Events
  {
    id: 'event_protests_europe_2025',
    title: 'Climate Protests Across European Cities',
    description: 'Coordinated environmental demonstrations in major European capitals.',
    location: { lat: 52.5200, lng: 13.4050, name: 'Berlin', country: 'Germany' },
    eventType: 'ongoing',
    category: 'social',
    severity: 'medium',
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    sources: ['DW', 'BBC Europe', 'Euronews'],
    affectedPeople: 500000,
    tags: ['protests', 'climate', 'europe', 'environment', 'activism'],
    status: 'monitoring',
    confidence: 0.91,
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      category = 'all',
      severity = 'all',
      eventType = 'all',
      country = 'all',
      limit = 50
    } = body;

    let filteredEvents = [...globalEvents];

    // Apply filters
    if (category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    if (severity !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.severity === severity);
    }

    if (eventType !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.eventType === eventType);
    }

    if (country !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        event.location.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    // Limit results
    const limitedEvents = filteredEvents.slice(0, limit);

    // Generate real-time statistics
    const statistics = {
      total_events: limitedEvents.length,
      by_category: {
        natural: limitedEvents.filter(e => e.category === 'natural').length,
        political: limitedEvents.filter(e => e.category === 'political').length,
        economic: limitedEvents.filter(e => e.category === 'economic').length,
        social: limitedEvents.filter(e => e.category === 'social').length,
        technology: limitedEvents.filter(e => e.category === 'technology').length,
        health: limitedEvents.filter(e => e.category === 'health').length,
      },
      by_severity: {
        low: limitedEvents.filter(e => e.severity === 'low').length,
        medium: limitedEvents.filter(e => e.severity === 'medium').length,
        high: limitedEvents.filter(e => e.severity === 'high').length,
        critical: limitedEvents.filter(e => e.severity === 'critical').length,
      },
      by_status: {
        active: limitedEvents.filter(e => e.status === 'active').length,
        monitoring: limitedEvents.filter(e => e.status === 'monitoring').length,
        resolved: limitedEvents.filter(e => e.status === 'resolved').length,
      },
      total_affected_people: limitedEvents
        .filter(e => e.affectedPeople)
        .reduce((sum, e) => sum + (e.affectedPeople || 0), 0),
      total_economic_impact: limitedEvents
        .filter(e => e.economicImpact)
        .reduce((sum, e) => sum + (e.economicImpact || 0), 0),
      average_confidence: limitedEvents.length > 0 
        ? limitedEvents.reduce((sum, e) => sum + e.confidence, 0) / limitedEvents.length 
        : 0,
    };

    // Add some dynamic events based on time
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 17) {
      // Business hours - add more economic events
      const dynamicEconomicEvent: LiveEvent = {
        id: `dynamic_market_${Date.now()}`,
        title: 'Real-time Market Analysis Available',
        description: 'Live trading session with automated market insights and AI-powered predictions.',
        location: { lat: 40.7589, lng: -73.9851, name: 'New York', country: 'USA' },
        eventType: 'ongoing',
        category: 'economic',
        severity: 'low',
        startTime: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        sources: ['NYSE', 'AI-Lens Market Analysis'],
        tags: ['markets', 'real-time', 'ai-analysis', 'trading'],
        status: 'active',
        confidence: 1.0,
      };
      
      if (category === 'all' || category === 'economic') {
        limitedEvents.unshift(dynamicEconomicEvent);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      events: limitedEvents,
      statistics,
      filters_applied: { category, severity, eventType, country },
      next_update_in: '1800', // 30 minutes
      status: 'Live Events Retrieved Successfully'
    });

  } catch (error) {
    console.error('EarthBrief Events API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch live events',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
