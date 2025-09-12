import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric') || 'energy';
    const region = searchParams.get('region') || 'global';
    const timeframe = searchParams.get('timeframe') || '24h';
    
    // Mock digital twin data
    const mockDigitalTwinData = {
      energy: [
        {
          country: 'Turkey',
          region: 'Istanbul',
          latitude: 41.0082,
          longitude: 28.9784,
          value: 85.2,
          trend: 'up',
          color: '#10b981',
          label: 'Energy Efficiency: 85.2%',
          timestamp: new Date().toISOString(),
          metadata: {
            renewablePercentage: 45.3,
            carbonFootprint: 'low',
            peakUsage: '18:00-20:00',
            gridStability: 'stable'
          }
        },
        {
          country: 'Germany',
          region: 'Berlin',
          latitude: 52.5200,
          longitude: 13.4050,
          value: 92.5,
          trend: 'stable',
          color: '#059669',
          label: 'Energy Efficiency: 92.5%',
          timestamp: new Date().toISOString(),
          metadata: {
            renewablePercentage: 78.1,
            carbonFootprint: 'very_low',
            peakUsage: '17:30-19:30',
            gridStability: 'stable'
          }
        },
        {
          country: 'United States',
          region: 'New York',
          latitude: 40.7128,
          longitude: -74.0060,
          value: 78.3,
          trend: 'down',
          color: '#fbbf24',
          label: 'Energy Efficiency: 78.3%',
          timestamp: new Date().toISOString(),
          metadata: {
            renewablePercentage: 32.7,
            carbonFootprint: 'medium',
            peakUsage: '19:00-21:00',
            gridStability: 'moderate'
          }
        }
      ],
      weather: [
        {
          country: 'Turkey',
          region: 'Istanbul',
          latitude: 41.0082,
          longitude: 28.9784,
          value: 15.2,
          trend: 'stable',
          color: '#3b82f6',
          label: 'Temperature: 15.2°C',
          timestamp: new Date().toISOString(),
          metadata: {
            humidity: 68,
            windSpeed: 12.4,
            pressure: 1013.2,
            conditions: 'cloudy'
          }
        },
        {
          country: 'Germany',
          region: 'Berlin',
          latitude: 52.5200,
          longitude: 13.4050,
          value: 8.7,
          trend: 'down',
          color: '#06b6d4',
          label: 'Temperature: 8.7°C',
          timestamp: new Date().toISOString(),
          metadata: {
            humidity: 72,
            windSpeed: 8.9,
            pressure: 1018.7,
            conditions: 'rainy'
          }
        }
      ],
      finance: [
        {
          country: 'Global',
          region: 'Markets',
          latitude: 0,
          longitude: 0,
          value: 2.3,
          trend: 'up',
          color: '#22c55e',
          label: 'Market Growth: +2.3%',
          timestamp: new Date().toISOString(),
          metadata: {
            volume: '145B',
            volatility: 'low',
            sector: 'technology',
            sentiment: 'positive'
          }
        }
      ]
    };

    const data = mockDigitalTwinData[metric as keyof typeof mockDigitalTwinData] || [];

    // Add predictions for each data point
    const dataWithPredictions = data.map(item => ({
      ...item,
      predictions: {
        next1h: item.value + (Math.random() - 0.5) * 5,
        next6h: item.value + (Math.random() - 0.5) * 10,
        next24h: item.value + (Math.random() - 0.5) * 20,
        confidence: Math.random() * 0.3 + 0.7 // 70-100%
      }
    }));

    return NextResponse.json({
      metric,
      region,
      timeframe,
      data: dataWithPredictions,
      lastUpdated: new Date().toISOString(),
      globalStats: {
        avgValue: data.reduce((sum, item) => sum + item.value, 0) / data.length,
        totalDataPoints: data.length,
        activeSensors: Math.floor(Math.random() * 1000 + 500),
        coverage: '89.2%'
      }
    });

  } catch (error) {
    console.error('Digital Twin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
