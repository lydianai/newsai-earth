import { NextRequest, NextResponse } from 'next/server';

// System Self-Test API - Tests all AGRI LENS endpoints
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const startTime = Date.now();
    
    // Define all endpoints to test
    const endpoints = [
      { name: 'Health Check', path: '/api/healthz', expectedStatus: [200, 503] },
      { name: 'AGRI Dashboard', path: '/api/agri/dashboard', expectedStatus: [200] },
      { name: 'AGRI Map Layers', path: '/api/agri/map/layers', expectedStatus: [200] },
      { name: 'AGRI Markets', path: '/api/agri/markets', expectedStatus: [200] },
      { name: 'Decisions API', path: '/api/decisions', expectedStatus: [200] },
      { name: 'Auth Me', path: '/api/auth/me', expectedStatus: [200, 401] }
    ];

    // Test all endpoints
    const testResults = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const testStart = Date.now();
        
        try {
          const response = await fetch(`${baseUrl}${endpoint.path}`, {
            method: 'GET',
            signal: AbortSignal.timeout(10000), // 10 second timeout
            headers: {
              'User-Agent': 'AI-NEWS-HUB-SelfTest/1.0'
            }
          });

          const responseTime = Date.now() - testStart;
          const isSuccess = endpoint.expectedStatus.includes(response.status);
          
          let responseData: any = null;
          try {
            const text = await response.text();
            responseData = text ? JSON.parse(text) : null;
          } catch (parseError) {
            // Non-JSON response is ok for some endpoints
            responseData = { note: 'Non-JSON response received' };
          }

          return {
            endpoint: endpoint.name,
            path: endpoint.path,
            status: isSuccess ? 'pass' : 'fail',
            httpStatus: response.status,
            expectedStatus: endpoint.expectedStatus,
            responseTime: `${responseTime}ms`,
            hasData: responseData !== null && Object.keys(responseData).length > 0,
            dataKeys: responseData ? Object.keys(responseData).slice(0, 5) : [], // First 5 keys only
            error: null
          };

        } catch (error) {
          const responseTime = Date.now() - testStart;
          
          return {
            endpoint: endpoint.name,
            path: endpoint.path,
            status: 'fail',
            httpStatus: null,
            expectedStatus: endpoint.expectedStatus,
            responseTime: `${responseTime}ms`,
            hasData: false,
            dataKeys: [],
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Process results
    const results = testResults.map(result => 
      result.status === 'fulfilled' ? result.value : {
        endpoint: 'Unknown',
        path: 'Unknown',
        status: 'error',
        error: (result as PromiseRejectedResult).reason
      }
    );

    // Calculate summary statistics
    const totalTests = results.length;
    const passedTests = results.filter(r => r.status === 'pass').length;
    const failedTests = results.filter(r => r.status === 'fail').length;
    const errorTests = results.filter(r => r.status === 'error').length;
    
    const avgResponseTime = results
      .filter((r: any) => r.responseTime && typeof r.responseTime === 'string' && !r.responseTime.includes('NaN'))
      .map((r: any) => parseInt(r.responseTime.replace('ms', '')))
      .reduce((sum, time, _, arr) => sum + time / arr.length, 0);

    const totalTime = Date.now() - startTime;

    const summary = {
      status: passedTests === totalTests ? 'all-pass' : failedTests > totalTests / 2 ? 'mostly-fail' : 'partial-pass',
      timestamp: new Date().toISOString(),
      totalExecutionTime: `${totalTime}ms`,
      statistics: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        errors: errorTests,
        passRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`,
        avgResponseTime: avgResponseTime ? `${Math.round(avgResponseTime)}ms` : 'N/A'
      },
      details: results
    };

    // Add environment info
    const environment = {
      nodeEnv: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      baseUrl,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      selfTest: summary,
      environment,
      recommendations: generateRecommendations(results)
    }, { 
      status: summary.status === 'all-pass' ? 200 : 206 // 206 Partial Content for partial failures
    });

  } catch (error) {
    console.error('Self-test error:', error);
    return NextResponse.json({
      selfTest: {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Self-test failed',
        statistics: { total: 0, passed: 0, failed: 0, errors: 1 }
      }
    }, { status: 500 });
  }
}

function generateRecommendations(results: any[]): string[] {
  const recommendations: string[] = [];
  
  const slowEndpoints = results.filter((r: any) => {
    if (!r.responseTime || typeof r.responseTime !== 'string') return false;
    const time = parseInt(r.responseTime.replace('ms', ''));
    return time > 2000; // Slower than 2 seconds
  });

  if (slowEndpoints.length > 0) {
    recommendations.push(`Consider optimizing slow endpoints: ${slowEndpoints.map(e => e.path).join(', ')}`);
  }

  const failedEndpoints = results.filter(r => r.status === 'fail');
  if (failedEndpoints.length > 0) {
    recommendations.push(`Failed endpoints need attention: ${failedEndpoints.map(e => e.path).join(', ')}`);
  }

  const errorEndpoints = results.filter(r => r.status === 'error');
  if (errorEndpoints.length > 0) {
    recommendations.push(`Error endpoints require immediate fixing: ${errorEndpoints.map(e => e.path).join(', ')}`);
  }

  if (recommendations.length === 0) {
    recommendations.push('All systems operating normally. No immediate action required.');
  }

  return recommendations;
}
