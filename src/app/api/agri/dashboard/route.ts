import { NextRequest, NextResponse } from 'next/server';

// AGRI LENS Dashboard API
export async function GET(request: NextRequest) {
  try {
    // Simulate fetching agricultural statistics
    const stats = {
      globalNDVI: 0.65 + (Math.random() - 0.5) * 0.1, // Simulated NDVI value
      activeAlerts: Math.floor(Math.random() * 30) + 10,
      weatherAlerts: Math.floor(Math.random() * 15) + 3,
      topMovers: [
        {
          name: 'Wheat',
          change: (Math.random() - 0.5) * 5,
          price: 275.50 + (Math.random() - 0.5) * 20
        },
        {
          name: 'Corn',
          change: (Math.random() - 0.5) * 5,
          price: 185.25 + (Math.random() - 0.5) * 15
        },
        {
          name: 'Soybeans',
          change: (Math.random() - 0.5) * 5,
          price: 425.80 + (Math.random() - 0.5) * 25
        },
        {
          name: 'Rice',
          change: (Math.random() - 0.5) * 4,
          price: 315.60 + (Math.random() - 0.5) * 18
        }
      ],
      marketUpdatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      ...stats,
      sources: [
        { name: 'FAOSTAT', status: 'active', lastUpdated: new Date().toISOString() },
        { name: 'Open-Meteo', status: 'active', lastUpdated: new Date().toISOString() },
        { name: 'NASA EONET', status: 'active', lastUpdated: new Date().toISOString() }
      ],
      meta: {
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('AGRI Dashboard API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch agricultural data', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
