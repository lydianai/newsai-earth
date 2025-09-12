import { NextRequest, NextResponse } from 'next/server';

// AGRI LENS Map Layers API
export async function GET(request: NextRequest) {
  try {
    const layers = [
      {
        id: 'ndvi',
        name: 'NDVI Vegetation Index',
        type: 'satellite',
        enabled: true,
        opacity: 0.8,
        lastUpdated: new Date().toISOString(),
        description: 'Normalized Difference Vegetation Index showing plant health',
        source: 'Copernicus Sentinel-2'
      },
      {
        id: 'weather',
        name: 'Weather Conditions',
        type: 'weather',
        enabled: true,
        opacity: 0.7,
        lastUpdated: new Date().toISOString(),
        description: 'Real-time weather patterns and conditions',
        source: 'Open-Meteo'
      },
      {
        id: 'fires',
        name: 'Active Fires',
        type: 'disaster',
        enabled: false,
        opacity: 0.9,
        lastUpdated: new Date().toISOString(),
        description: 'Active wildfire detection and monitoring',
        source: 'NASA EONET'
      },
      {
        id: 'drought',
        name: 'Drought Conditions',
        type: 'climate',
        enabled: false,
        opacity: 0.6,
        lastUpdated: new Date().toISOString(),
        description: 'Drought monitoring and severity levels',
        source: 'NOAA'
      },
      {
        id: 'earthquakes',
        name: 'Seismic Activity',
        type: 'disaster',
        enabled: false,
        opacity: 0.8,
        lastUpdated: new Date().toISOString(),
        description: 'Recent earthquakes affecting agricultural regions',
        source: 'USGS'
      },
      {
        id: 'ports',
        name: 'Agricultural Logistics',
        type: 'infrastructure',
        enabled: false,
        opacity: 0.7,
        lastUpdated: new Date().toISOString(),
        description: 'Ports and transportation routes for agricultural goods',
        source: 'Global Trade Data'
      }
    ];

    return NextResponse.json({
      layers,
      meta: {
        totalLayers: layers.length,
        enabledLayers: layers.filter(l => l.enabled).length,
        lastUpdated: new Date().toISOString()
      },
      sources: [
        { name: 'Copernicus Sentinel', status: 'active' },
        { name: 'Open-Meteo', status: 'active' },
        { name: 'NASA EONET', status: 'active' },
        { name: 'USGS', status: 'active' }
      ]
    });

  } catch (error) {
    console.error('AGRI Map Layers API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch map layers', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
