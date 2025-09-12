// Agricultural Data Sources Integration
// Provides adapters for real agricultural data sources with fallback mechanisms

interface DataSource {
  name: string;
  status: 'active' | 'error' | 'timeout';
  lastUpdated: string;
  endpoint?: string;
}

interface AgriData {
  type: string;
  data: any;
  source: DataSource;
  timestamp: string;
}

// FAOSTAT API Integration
class FAOSTATAdapter {
  private baseUrl = 'https://fenixservices.fao.org/faostat/api/v1/en';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FAOSTAT_KEY;
  }

  async getProductionData(
    countries: string[] = ['all'],
    items: string[] = ['wheat', 'maize', 'rice'],
    years: number[] = [2023, 2024]
  ): Promise<AgriData> {
    try {
      // Note: This is a simplified example. Real FAOSTAT API requires specific codes
      const response = await fetch(
        `${this.baseUrl}/data/QCL?area=${countries.join(',')}&item=${items.join(',')}&year=${years.join(',')}`,
        {
          headers: this.apiKey ? { 'X-API-Key': this.apiKey } : {},
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(`FAOSTAT API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        type: 'production',
        data: data.data || [],
        source: {
          name: 'FAOSTAT',
          status: 'active',
          lastUpdated: new Date().toISOString(),
          endpoint: 'fenixservices.fao.org'
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.warn('FAOSTAT API unavailable, using fallback data:', error);
      
      return {
        type: 'production',
        data: this.getFallbackProductionData(),
        source: {
          name: 'FAOSTAT',
          status: 'error',
          lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private getFallbackProductionData() {
    return [
      { country: 'China', crop: 'wheat', production: 134250000, year: 2023 },
      { country: 'India', crop: 'wheat', production: 107590000, year: 2023 },
      { country: 'Russia', crop: 'wheat', production: 91400000, year: 2023 },
      { country: 'USA', crop: 'maize', production: 389692000, year: 2023 },
      { country: 'China', crop: 'maize', production: 277200000, year: 2023 }
    ];
  }
}

// Open-Meteo Weather API Integration
class OpenMeteoAdapter {
  private baseUrl = 'https://api.open-meteo.com/v1';

  async getWeatherData(
    latitude: number,
    longitude: number,
    days: number = 7
  ): Promise<AgriData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        forecast_days: days.toString(),
        timezone: 'UTC'
      });

      const response = await fetch(
        `${this.baseUrl}/forecast?${params}`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        type: 'weather',
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          daily: data.daily,
          timezone: data.timezone
        },
        source: {
          name: 'Open-Meteo',
          status: 'active',
          lastUpdated: new Date().toISOString(),
          endpoint: 'api.open-meteo.com'
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.warn('Open-Meteo API unavailable, using fallback data:', error);
      
      return {
        type: 'weather',
        data: this.getFallbackWeatherData(),
        source: {
          name: 'Open-Meteo',
          status: 'error',
          lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private getFallbackWeatherData() {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    return {
      daily: {
        time: dates,
        temperature_2m_max: [22, 24, 26, 25, 23, 21, 20],
        temperature_2m_min: [15, 16, 18, 17, 16, 14, 13],
        precipitation_sum: [0, 2.5, 0, 5.2, 1.1, 0, 0],
        wind_speed_10m_max: [12, 15, 18, 14, 11, 9, 8]
      }
    };
  }
}

// NASA EONET (Earth Observatory Natural Event Tracker) Integration
class EONETAdapter {
  private baseUrl = 'https://eonet.gsfc.nasa.gov/api/v3';

  async getDisasterEvents(
    categories: string[] = ['wildfires', 'floods', 'droughts', 'storms'],
    days: number = 30
  ): Promise<AgriData> {
    try {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - days);
      
      const params = new URLSearchParams({
        category: categories.join(','),
        status: 'open',
        start: sinceDate.toISOString().split('T')[0]
      });

      const response = await fetch(
        `${this.baseUrl}/events?${params}`,
        { signal: AbortSignal.timeout(15000) }
      );

      if (!response.ok) {
        throw new Error(`EONET API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        type: 'disasters',
        data: {
          events: data.events || [],
          eventCount: data.events?.length || 0
        },
        source: {
          name: 'NASA EONET',
          status: 'active',
          lastUpdated: new Date().toISOString(),
          endpoint: 'eonet.gsfc.nasa.gov'
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.warn('NASA EONET API unavailable, using fallback data:', error);
      
      return {
        type: 'disasters',
        data: this.getFallbackDisasterData(),
        source: {
          name: 'NASA EONET',
          status: 'error',
          lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private getFallbackDisasterData() {
    return {
      events: [
        {
          id: 'EONET_001',
          title: 'California Wildfire',
          categories: [{ id: 'wildfires', title: 'Wildfires' }],
          geometry: [{ coordinates: [-120.5, 38.5] }],
          closed: null
        },
        {
          id: 'EONET_002', 
          title: 'Midwest Drought',
          categories: [{ id: 'droughts', title: 'Droughts' }],
          geometry: [{ coordinates: [-95.0, 40.0] }],
          closed: null
        }
      ],
      eventCount: 2
    };
  }
}

// USGS Earthquake API Integration  
class USGSAdapter {
  private baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1';

  async getEarthquakes(
    minMagnitude: number = 4.0,
    days: number = 30
  ): Promise<AgriData> {
    try {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - days);
      
      const params = new URLSearchParams({
        format: 'geojson',
        starttime: startTime.toISOString().split('T')[0],
        endtime: new Date().toISOString().split('T')[0],
        minmagnitude: minMagnitude.toString(),
        orderby: 'magnitude-desc',
        limit: '100'
      });

      const response = await fetch(
        `${this.baseUrl}/query?${params}`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        type: 'earthquakes',
        data: {
          features: data.features || [],
          count: data.metadata?.count || 0
        },
        source: {
          name: 'USGS',
          status: 'active',
          lastUpdated: new Date().toISOString(),
          endpoint: 'earthquake.usgs.gov'
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.warn('USGS API unavailable, using fallback data:', error);
      
      return {
        type: 'earthquakes',
        data: this.getFallbackEarthquakeData(),
        source: {
          name: 'USGS',
          status: 'error',
          lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private getFallbackEarthquakeData() {
    return {
      features: [
        {
          properties: {
            mag: 5.2,
            place: '50km SW of Agricultural Region',
            time: Date.now() - 86400000,
            title: 'M 5.2 - Agricultural Impact Zone'
          },
          geometry: {
            coordinates: [-118.5, 34.2, 10]
          }
        }
      ],
      count: 1
    };
  }
}

// Nominatim Geocoding (OSM) Integration
class NominatimAdapter {
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private userAgent: string;

  constructor() {
    this.userAgent = process.env.NOMINATIM_UA || 'newsai.earth/1.0';
  }

  async geocode(query: string): Promise<AgriData> {
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        addressdetails: '1',
        extratags: '1'
      });

      // Rate limiting: max 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(
        `${this.baseUrl}/search?${params}`,
        {
          headers: {
            'User-Agent': this.userAgent
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        type: 'geocoding',
        data: data || [],
        source: {
          name: 'Nominatim (OSM)',
          status: 'active',
          lastUpdated: new Date().toISOString(),
          endpoint: 'nominatim.openstreetmap.org'
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.warn('Nominatim API unavailable:', error);
      
      return {
        type: 'geocoding',
        data: [],
        source: {
          name: 'Nominatim (OSM)',
          status: 'error',
          lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Unified Agricultural Data Aggregator
export class AgriDataAggregator {
  private faostat: FAOSTATAdapter;
  private openMeteo: OpenMeteoAdapter;
  private eonet: EONETAdapter;
  private usgs: USGSAdapter;
  private nominatim: NominatimAdapter;

  constructor() {
    this.faostat = new FAOSTATAdapter();
    this.openMeteo = new OpenMeteoAdapter();
    this.eonet = new EONETAdapter();
    this.usgs = new USGSAdapter();
    this.nominatim = new NominatimAdapter();
  }

  async getAllData(
    coordinates?: { lat: number; lng: number }
  ): Promise<{
    production: AgriData;
    weather: AgriData;
    disasters: AgriData;
    earthquakes: AgriData;
    sources: DataSource[];
    aggregatedAt: string;
  }> {
    const [production, weather, disasters, earthquakes] = await Promise.all([
      this.faostat.getProductionData(),
      coordinates ? this.openMeteo.getWeatherData(coordinates.lat, coordinates.lng) : this.getDefaultWeather(),
      this.eonet.getDisasterEvents(),
      this.usgs.getEarthquakes()
    ]);

    const sources = [
      production.source,
      weather.source,
      disasters.source,
      earthquakes.source
    ];

    return {
      production,
      weather,
      disasters,
      earthquakes,
      sources,
      aggregatedAt: new Date().toISOString()
    };
  }

  private async getDefaultWeather(): Promise<AgriData> {
    // Default coordinates (global agricultural average)
    return this.openMeteo.getWeatherData(40.0, -95.0);
  }

  // Health check for all data sources
  async healthCheck(): Promise<{
    status: 'healthy' | 'partial' | 'unhealthy';
    sources: Record<string, 'available' | 'error'>;
    lastChecked: string;
  }> {
    const checks = await Promise.allSettled([
      fetch('https://fenixservices.fao.org/faostat/api/v1/en/abbreviations', { signal: AbortSignal.timeout(5000) }),
      fetch('https://api.open-meteo.com/v1/forecast?latitude=40&longitude=-95&current_weather=true', { signal: AbortSignal.timeout(5000) }),
      fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=1', { signal: AbortSignal.timeout(5000) }),
      fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1', { signal: AbortSignal.timeout(5000) })
    ]);

    const sources = {
      faostat: checks[0].status === 'fulfilled' && checks[0].value.ok ? 'available' : 'error',
      openmeteo: checks[1].status === 'fulfilled' && checks[1].value.ok ? 'available' : 'error',
      eonet: checks[2].status === 'fulfilled' && checks[2].value.ok ? 'available' : 'error',
      usgs: checks[3].status === 'fulfilled' && checks[3].value.ok ? 'available' : 'error'
    } as Record<string, 'available' | 'error'>;

    const availableCount = Object.values(sources).filter(status => status === 'available').length;
    const status = availableCount === 4 ? 'healthy' : availableCount > 0 ? 'partial' : 'unhealthy';

    return {
      status,
      sources,
      lastChecked: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const agriData = new AgriDataAggregator();

// Export individual adapters for specific use cases
export {
  FAOSTATAdapter,
  OpenMeteoAdapter,
  EONETAdapter,
  USGSAdapter,
  NominatimAdapter
};

export type { AgriData, DataSource };
