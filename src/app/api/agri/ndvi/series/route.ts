import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/agri/ndvi/series - Fetch NDVI time series data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region_key = searchParams.get('region_key');
    const country = searchParams.get('country');
    const bbox = searchParams.get('bbox');
    const format = searchParams.get('format') || 'json'; // 'json' | 'csv'
    const include_anomalies = searchParams.get('include_anomalies') !== 'false';

    // Build query conditions
    const where: any = {};
    if (region_key) {
      where.region_key = region_key;
    } else if (country) {
      where.region_key = { contains: `country:${country.toUpperCase()}` };
    } else if (bbox) {
      where.region_key = { contains: `bbox:${bbox}` };
    }

    // Fetch NDVI series data
    const series = await prisma.nDVITimeSeries.findMany({
      where,
      include: {
        country: {
          select: {
            iso2: true,
            name_en: true,
            latitude: true,
            longitude: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10 // Limit results
    });

    if (series.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No NDVI data found for the specified region'
      }, { status: 404 });
    }

    // Process and format the data
    const processedSeries = series.map(s => {
      const timestamps = s.timestamps.map(t => new Date(t));
      const values = s.ndvi_values;
      
      // Create time-value pairs for easier consumption
      const timeSeries = timestamps.map((t, i) => ({
        date: t.toISOString().split('T')[0], // YYYY-MM-DD format
        ndvi: values[i],
        timestamp: t.toISOString()
      }));

      return {
        id: s.id,
        region_key: s.region_key,
        country: s.country ? {
          iso2: s.country.iso2,
          name: s.country.name_en,
          coordinates: [s.country.latitude, s.country.longitude]
        } : null,
        data: timeSeries,
        statistics: {
          mean: s.mean_value,
          min: s.min_value,
          max: s.max_value,
          points: values.length,
          timespan: {
            start: timestamps[0]?.toISOString().split('T')[0],
            end: timestamps[timestamps.length - 1]?.toISOString().split('T')[0]
          }
        },
        metadata: {
          provider: s.provider,
          resolution: s.resolution,
          bbox: s.bbox,
          last_updated: s.updatedAt.toISOString()
        },
        ...(include_anomalies && {
          anomalies: s.anomalies || []
        })
      };
    });

    // Handle CSV export format
    if (format === 'csv') {
      const csvLines = ['Date,NDVI,Region,Provider'];
      
      processedSeries.forEach(series => {
        series.data.forEach(point => {
          csvLines.push(
            `${point.date},${point.ndvi},${series.region_key},${series.metadata.provider}`
          );
        });
      });
      
      return new Response(csvLines.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="ndvi_series.csv"'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: processedSeries,
      metadata: {
        total_series: series.length,
        total_points: series.reduce((sum, s) => sum + s.ndvi_values.length, 0),
        format,
        include_anomalies
      }
    });

  } catch (error) {
    console.error('NDVI series API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch NDVI series data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// DELETE /api/agri/ndvi/series - Clean up old NDVI data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region_key = searchParams.get('region_key');
    const older_than = searchParams.get('older_than'); // ISO date string
    const confirm = searchParams.get('confirm') === 'true';

    if (!confirm) {
      return NextResponse.json({
        success: false,
        error: 'Please add confirm=true parameter to proceed with deletion'
      }, { status: 400 });
    }

    const where: any = {};
    if (region_key) {
      where.region_key = region_key;
    }
    if (older_than) {
      where.updatedAt = { lte: new Date(older_than) };
    }

    const deleted = await prisma.nDVITimeSeries.deleteMany({
      where
    });

    return NextResponse.json({
      success: true,
      deleted: deleted.count,
      message: `Deleted ${deleted.count} NDVI series records`
    });

  } catch (error) {
    console.error('NDVI deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete NDVI series data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
