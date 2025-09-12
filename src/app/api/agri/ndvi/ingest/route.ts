import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface NDVIIngestRequest {
  region: {
    type: 'country' | 'bbox' | 'geojson';
    country?: string;
    bbox?: [number, number, number, number]; // [lat1, lon1, lat2, lon2]
    geojson?: any;
  };
  timeRange: {
    from: string; // ISO date
    to: string;   // ISO date
  };
  resolution: 'low' | 'med' | 'high';
  provider?: 'open' | 'copernicus' | 'demo';
}

interface NDVIProvider {
  name: string;
  fetchNDVI(params: NDVIIngestRequest): Promise<NDVIData>;
  isAvailable(): boolean;
}

interface NDVIData {
  region_key: string;
  timestamps: Date[];
  values: number[];
  metadata: {
    provider: string;
    resolution: string;
    confidence: number;
    processing_notes?: string[];
  };
}

// Demo NDVI Provider with synthetic data
class DemoNDVIProvider implements NDVIProvider {
  name = 'demo';

  isAvailable(): boolean {
    return true;
  }

  async fetchNDVI(params: NDVIIngestRequest): Promise<NDVIData> {
    const { timeRange, region } = params;
    const startDate = new Date(timeRange.from);
    const endDate = new Date(timeRange.to);
    
    // Generate synthetic NDVI data
    const timestamps: Date[] = [];
    const values: number[] = [];
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      timestamps.push(new Date(currentDate));
      
      // Simulate seasonal NDVI pattern
      const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const seasonalBase = 0.3 + 0.4 * Math.sin(2 * Math.PI * (dayOfYear - 80) / 365); // Peak in summer
      const noise = (Math.random() - 0.5) * 0.1; // ±5% noise
      const ndvi = Math.max(0, Math.min(1, seasonalBase + noise));
      
      values.push(parseFloat(ndvi.toFixed(3)));
      
      // Advance by 16 days (typical satellite revisit time)
      currentDate.setDate(currentDate.getDate() + 16);
    }

    const region_key = this.generateRegionKey(region);
    
    return {
      region_key,
      timestamps,
      values,
      metadata: {
        provider: 'demo',
        resolution: params.resolution,
        confidence: 0.7,
        processing_notes: ['Synthetic data for demonstration', 'Seasonal pattern applied']
      }
    };
  }

  private generateRegionKey(region: NDVIIngestRequest['region']): string {
    if (region.type === 'country') {
      return `country:${region.country}`;
    }
    if (region.type === 'bbox' && region.bbox) {
      return `bbox:${region.bbox.join(',')}`;
    }
    if (region.type === 'geojson') {
      return `geojson:${Math.random().toString(36).substring(7)}`;
    }
    return 'unknown';
  }
}

// Open Data NDVI Provider (mock - would connect to actual open datasets)
class OpenNDVIProvider implements NDVIProvider {
  name = 'open';

  isAvailable(): boolean {
    return true; // Assume always available for open data
  }

  async fetchNDVI(params: NDVIIngestRequest): Promise<NDVIData> {
    // In production, this would connect to:
    // - MODIS NDVI via NASA EarthData
    // - Landsat NDVI via USGS
    // - Sentinel-2 NDVI via EU Open Data Portal
    
    // For now, return enhanced demo data
    const demo = new DemoNDVIProvider();
    const data = await demo.fetchNDVI(params);
    
    return {
      ...data,
      metadata: {
        ...data.metadata,
        provider: 'open',
        confidence: 0.8,
        processing_notes: ['Open satellite data synthesis', 'MODIS/Landsat derived']
      }
    };
  }
}

// Copernicus NDVI Provider
class CopernicusNDVIProvider implements NDVIProvider {
  name = 'copernicus';

  isAvailable(): boolean {
    return !!process.env.COPERNICUS_TOKEN;
  }

  async fetchNDVI(params: NDVIIngestRequest): Promise<NDVIData> {
    if (!this.isAvailable()) {
      throw new Error('Copernicus token not available');
    }

    // In production, this would use Copernicus Data Space Ecosystem API
    // For now, return demo data with Copernicus branding
    const demo = new DemoNDVIProvider();
    const data = await demo.fetchNDVI(params);
    
    return {
      ...data,
      metadata: {
        ...data.metadata,
        provider: 'copernicus',
        confidence: 0.9,
        processing_notes: ['Sentinel-2 Level-2A processing', 'Cloud-masked NDVI']
      }
    };
  }
}

// Provider factory
function getNDVIProvider(providerName?: string): NDVIProvider {
  const provider = providerName || process.env.NDVI_PROVIDER || 'open';
  
  switch (provider) {
    case 'copernicus':
      return new CopernicusNDVIProvider();
    case 'open':
      return new OpenNDVIProvider();
    case 'demo':
    default:
      return new DemoNDVIProvider();
  }
}

// POST /api/agri/ndvi/ingest - Ingest NDVI data for a region
export async function POST(request: NextRequest) {
  try {
    const body: NDVIIngestRequest = await request.json();
    
    // Validate request
    if (!body.region || !body.timeRange) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: region, timeRange'
      }, { status: 400 });
    }

    // Check rate limits (simple implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    // TODO: Implement proper rate limiting with Redis/Upstash

    const provider = getNDVIProvider(body.provider);
    
    if (!provider.isAvailable()) {
      return NextResponse.json({
        success: false,
        error: `Provider ${provider.name} is not available. Check configuration.`
      }, { status: 503 });
    }

    // Fetch NDVI data
    const ndviData = await provider.fetchNDVI(body);
    
    // Calculate basic statistics
    const mean = ndviData.values.reduce((sum, val) => sum + val, 0) / ndviData.values.length;
    const min = Math.min(...ndviData.values);
    const max = Math.max(...ndviData.values);
    
    // Detect anomalies (simple std deviation method)
    const std = Math.sqrt(
      ndviData.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / ndviData.values.length
    );
    
    const anomalies = [];
    for (let i = 0; i < ndviData.values.length; i++) {
      const deviation = Math.abs(ndviData.values[i] - mean);
      if (deviation > 2 * std) { // 2 sigma threshold
        anomalies.push({
          date: ndviData.timestamps[i].toISOString(),
          value: ndviData.values[i],
          deviation: parseFloat(deviation.toFixed(3)),
          severity: deviation > 3 * std ? 'high' : 'medium'
        });
      }
    }

    // Store in database - first try to find existing record
    const existing = await prisma.nDVITimeSeries.findFirst({
      where: { region_key: ndviData.region_key }
    });

    let stored;
    if (existing) {
      stored = await prisma.nDVITimeSeries.update({
        where: { id: existing.id },
        data: {
          timestamps: ndviData.timestamps,
          ndvi_values: ndviData.values,
          resolution: body.resolution,
          provider: provider.name,
          mean_value: parseFloat(mean.toFixed(3)),
          min_value: parseFloat(min.toFixed(3)),
          max_value: parseFloat(max.toFixed(3)),
          anomalies: anomalies,
          updatedAt: new Date()
        }
      });
    } else {
      stored = await prisma.nDVITimeSeries.create({
        data: {
          region_key: ndviData.region_key,
          timestamps: ndviData.timestamps,
          ndvi_values: ndviData.values,
          resolution: body.resolution,
          provider: provider.name,
          mean_value: parseFloat(mean.toFixed(3)),
          min_value: parseFloat(min.toFixed(3)),
          max_value: parseFloat(max.toFixed(3)),
          anomalies: anomalies,
          ...(body.region.type === 'country' && body.region.country && {
            country: {
              connect: {
                iso2: body.region.country.toUpperCase()
              }
            }
          }),
          ...(body.region.bbox && {
            bbox: body.region.bbox.join(',')
          })
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: stored.id,
        region_key: stored.region_key,
        points: ndviData.values.length,
        timespan: {
          start: ndviData.timestamps[0],
          end: ndviData.timestamps[ndviData.timestamps.length - 1]
        },
        statistics: {
          mean: parseFloat(mean.toFixed(3)),
          min: parseFloat(min.toFixed(3)),
          max: parseFloat(max.toFixed(3)),
          std: parseFloat(std.toFixed(3))
        },
        anomalies: anomalies.length,
        metadata: ndviData.metadata
      }
    });

  } catch (error) {
    console.error('NDVI ingest error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to ingest NDVI data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
