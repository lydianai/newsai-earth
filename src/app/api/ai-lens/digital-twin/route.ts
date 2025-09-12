import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric') || 'energy';

    // Global gerçek zamanlı veriler
    const globalData = [
      {
        type: metric,
        country: "Turkey",
        value: 85.2 + (Math.random() * 10 - 5),
        latitude: 39.0,
        longitude: 35.0,
        color: "#10b981",
        label: "Turkey Digital Twin",
        trend: Math.random() * 4 - 2,
        lastUpdated: new Date().toISOString()
      },
      {
        type: metric,
        country: "Germany",
        value: 92.5 + (Math.random() * 6 - 3),
        latitude: 51.0,
        longitude: 9.0,
        color: "#059669",
        label: "Germany Digital Twin",
        trend: Math.random() * 3 - 1,
        lastUpdated: new Date().toISOString()
      },
      {
        type: metric,
        country: "United States",
        value: 78.3 + (Math.random() * 8 - 4),
        latitude: 40.0,
        longitude: -100.0,
        color: "#fbbf24",
        label: "USA Digital Twin",
        trend: Math.random() * 5 - 2.5,
        lastUpdated: new Date().toISOString()
      },
      {
        type: metric,
        country: "Japan",
        value: 94.1 + (Math.random() * 4 - 2),
        latitude: 36.0,
        longitude: 138.0,
        color: "#059669",
        label: "Japan Digital Twin",
        trend: Math.random() * 2 - 1,
        lastUpdated: new Date().toISOString()
      },
      {
        type: metric,
        country: "China",
        value: 67.8 + (Math.random() * 12 - 6),
        latitude: 35.0,
        longitude: 104.0,
        color: "#f59e0b",
        label: "China Digital Twin",
        trend: Math.random() * 6 - 3,
        lastUpdated: new Date().toISOString()
      },
      {
        type: metric,
        country: "Brazil",
        value: 72.1 + (Math.random() * 8 - 4),
        latitude: -14.0,
        longitude: -51.0,
        color: "#059669",
        label: "Brazil Digital Twin",
        trend: Math.random() * 4 - 2,
        lastUpdated: new Date().toISOString()
      }
    ];

    // Sistem metrikleri
    const systemMetrics = [
      {
        name: "Toplam Veri Akışı",
        value: (1847.3 + Math.random() * 200).toFixed(1),
        unit: "TB/s",
        status: "good",
        change: Math.random() * 10 - 5
      },
      {
        name: "Aktif Sensörler",
        value: Math.floor(23450 + Math.random() * 2000),
        unit: "",
        status: "good",
        change: Math.random() * 8
      },
      {
        name: "İşlem Gecikmesi",
        value: (8.7 + Math.random() * 4).toFixed(1),
        unit: "ms",
        status: Math.random() > 0.7 ? "warning" : "good",
        change: Math.random() * 4 - 2
      },
      {
        name: "Sistem Performansı",
        value: (96.2 + Math.random() * 3).toFixed(1),
        unit: "%",
        status: "good",
        change: Math.random() * 2 - 1
      }
    ];

    // IoT Cihazlar
    const iotDevices = [
      {
        id: "global-energy-meters",
        name: "Global Enerji Sayaçları",
        type: "energy",
        status: "online",
        value: `${Math.floor(3247 + Math.random() * 500)}`,
        location: "Dünya Geneli"
      },
      {
        id: "climate-sensors",
        name: "İklim Sensörleri", 
        type: "environment",
        status: "online",
        value: `${Math.floor(1890 + Math.random() * 200)}`,
        location: "145 Ülke"
      },
      {
        id: "satellite-network",
        name: "Uydu Ağı",
        type: "communication",
        status: "online",
        value: `${Math.floor(156 + Math.random() * 20)}/180`,
        location: "Yörüngede"
      },
      {
        id: "weather-stations",
        name: "Meteoroloji İstasyonları",
        type: "weather",
        status: "online",
        value: `${Math.floor(4567 + Math.random() * 300)}`,
        location: "Global"
      }
    ];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      metric: metric,
      globalData: globalData,
      systemMetrics: systemMetrics,
      iotDevices: iotDevices
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Digital Twin API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch digital twin data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'run_prediction':
        // Mock prediction engine
        const scenarioResults = {
          scenario: data.scenario,
          parameters: data.parameters,
          predictions: {
            optimistic: {
              outcome: data.parameters.targetValue * 1.15,
              probability: 0.25,
              timeframe: '6 months'
            },
            realistic: {
              outcome: data.parameters.targetValue * 1.05,
              probability: 0.50,
              timeframe: '6 months'
            },
            pessimistic: {
              outcome: data.parameters.targetValue * 0.95,
              probability: 0.25,
              timeframe: '6 months'
            }
          },
          recommendations: [
            'Increase renewable energy investment',
            'Optimize grid distribution',
            'Implement demand response programs'
          ],
          confidenceLevel: 0.82
        };

        return NextResponse.json(scenarioResults);

      case 'register_iot_device':
        // Mock IoT device registration
        return NextResponse.json({
          deviceId: `iot_${Date.now()}`,
          status: 'registered',
          apiKey: `key_${Math.random().toString(36).substr(2, 9)}`,
          endpoints: {
            data: '/api/ai-lens/iot/data',
            status: '/api/ai-lens/iot/status'
          }
        });

      case 'trigger_alert':
        // Mock alert system
        return NextResponse.json({
          alertId: `alert_${Date.now()}`,
          status: 'triggered',
          severity: data.severity || 'medium',
          message: data.message,
          affectedRegions: data.regions || [],
          estimatedImpact: Math.floor(Math.random() * 1000000),
          responseTime: Math.floor(Math.random() * 300 + 60) // 1-5 minutes
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Digital Twin POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
