import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ESGMetricsRequest {
  region_key?: string;
  country?: string;
  crop?: string;
  area_hectares?: number;
  calculation_method?: 'modeled' | 'measured' | 'satellite' | 'hybrid';
}

interface ESGMetrics {
  water_use: {
    total_m3: number;
    per_hectare: number;
    per_tonne: number;
    efficiency_rating: 'poor' | 'fair' | 'good' | 'excellent';
    sources: string[];
  };
  carbon_footprint: {
    total_kg_co2: number;
    per_hectare: number;
    per_tonne: number;
    breakdown: {
      fertilizers: number;
      machinery: number;
      transportation: number;
      land_use_change: number;
      other: number;
    };
    sequestration_potential: number;
  };
  soil_health: {
    index_score: number; // 0-100
    organic_matter_pct: number;
    erosion_risk: 'low' | 'medium' | 'high' | 'critical';
    biodiversity_score: number; // 0-100
    ph_level: number;
    nutrient_balance: 'deficit' | 'balanced' | 'excess';
  };
  sustainability_score: number; // 0-100 composite
  benchmarks: {
    regional_average: number;
    industry_best: number;
    global_target: number;
  };
  recommendations: string[];
  data_quality: {
    confidence: number; // 0-1
    completeness: number; // 0-1
    sources: string[];
    assumptions: string[];
  };
}

// ESG calculation models and coefficients
const ESG_MODELS = {
  water_use: {
    // Water use coefficients by crop (liters per kg)
    // Water use coefficients by crop (liters per kg)
    crop_coefficients: {
      'rice': 2500,
      'wheat': 1350,
      'corn': 900,
      'soybeans': 2000,
      'cotton': 2700,
      'sugarcane': 200,
      'tomato': 25,
      'potato': 25,
      'default': 1000
    } as Record<string, number>,
    // Regional adjustment factors
    climate_factors: {
      'arid': 1.5,
      'semi-arid': 1.3,
      'temperate': 1.0,
      'tropical': 0.8,
      'default': 1.0
    } as Record<string, number>,
    // Irrigation efficiency factors
    irrigation_efficiency: {
      'flood': 0.6,
      'sprinkler': 0.8,
      'drip': 0.9,
      'deficit': 0.95,
      'default': 0.7
    } as Record<string, number>
  },
  carbon_footprint: {
    // CO2 equivalent emissions (kg CO2e per hectare)
    crop_emissions: {
      'rice': 6800, // Methane from flooded fields
      'wheat': 1200,
      'corn': 1800,
      'soybeans': 800, // N-fixing crop
      'cotton': 2400,
      'sugarcane': 900,
      'tomato': 3200,
      'potato': 1600,
      'default': 1500
    } as Record<string, number>,
    // Input-specific emissions (kg CO2e per kg input)
    input_emissions: {
      'nitrogen': 5.9,
      'phosphorus': 1.2,
      'potassium': 0.7,
      'pesticides': 4.6,
      'diesel': 3.2,
      'electricity': 0.5
    } as Record<string, number>,
    // Carbon sequestration rates (kg CO2 per hectare per year)
    sequestration_rates: {
      'no-till': 400,
      'cover_crops': 600,
      'agroforestry': 1200,
      'organic': 300,
      'default': 0
    } as Record<string, number>
  },
  soil_health: {
    // Soil health indicators by soil type
    baseline_scores: {
      'clay': { om: 3.5, erosion: 'low', biodiversity: 65, ph: 6.8 },
      'sandy': { om: 2.0, erosion: 'medium', biodiversity: 45, ph: 6.2 },
      'loam': { om: 4.2, erosion: 'low', biodiversity: 75, ph: 6.5 },
      'silt': { om: 3.8, erosion: 'medium', biodiversity: 70, ph: 6.6 },
      'default': { om: 3.0, erosion: 'medium', biodiversity: 60, ph: 6.5 }
    } as Record<string, any>,
    // Management practice modifiers
    practice_modifiers: {
      'organic': { om: 0.8, erosion: -1, biodiversity: 15, ph: 0.2 },
      'no-till': { om: 0.5, erosion: -1, biodiversity: 10, ph: 0 },
      'cover_crops': { om: 0.6, erosion: -1, biodiversity: 12, ph: 0.1 },
      'crop_rotation': { om: 0.3, erosion: 0, biodiversity: 8, ph: 0 },
      'intensive': { om: -0.4, erosion: 1, biodiversity: -10, ph: -0.1 }
    } as Record<string, any>
  }
};

// ESG metrics calculator
class ESGCalculator {
  static async calculateMetrics(request: ESGMetricsRequest): Promise<ESGMetrics> {
    const { region_key, country, crop, area_hectares = 1 } = request;
    
    // Get baseline crop and regional data
    const cropData = await this.getCropData(crop);
    const regionalData = await this.getRegionalData(country, region_key);
    
    // Calculate individual metrics
    const waterUse = this.calculateWaterUse(crop, area_hectares, regionalData);
    const carbonFootprint = this.calculateCarbonFootprint(crop, area_hectares, regionalData);
    const soilHealth = this.calculateSoilHealth(regionalData);
    
    // Calculate composite sustainability score
    const sustainabilityScore = this.calculateSustainabilityScore(waterUse, carbonFootprint, soilHealth);
    
    // Get benchmarks
    const benchmarks = await this.getBenchmarks(crop, country);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(waterUse, carbonFootprint, soilHealth);
    
    return {
      water_use: waterUse,
      carbon_footprint: carbonFootprint,
      soil_health: soilHealth,
      sustainability_score: sustainabilityScore,
      benchmarks,
      recommendations,
      data_quality: {
        confidence: 0.7, // Mock confidence level
        completeness: 0.8,
        sources: ['FAO statistics', 'IPCC coefficients', 'Regional studies'],
        assumptions: [
          'Average crop yields assumed',
          'Standard irrigation practices assumed',
          'Regional climate data approximated'
        ]
      }
    };
  }

  private static async getCropData(crop?: string) {
    if (!crop) return null;
    
    try {
      return await prisma.crop.findFirst({
        where: {
          OR: [
            { name_en: { equals: crop, mode: 'insensitive' } },
            { name_tr: { equals: crop, mode: 'insensitive' } },
            { synonyms: { has: crop } }
          ]
        },
        include: {
          profiles: {
            take: 5,
            orderBy: { production_avg: 'desc' }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to get crop data:', error);
      return null;
    }
  }

  private static async getRegionalData(country?: string, regionKey?: string) {
    const defaultData = {
      climate_zone: 'temperate',
      soil_type: 'loam',
      irrigation_method: 'sprinkler',
      management_practices: ['conventional']
    };

    if (!country) return defaultData;
    
    try {
      const countryData = await prisma.country.findFirst({
        where: { iso2: country.toUpperCase() },
        select: { climate_zones: true }
      });
      
      return {
        ...defaultData,
        climate_zone: countryData?.climate_zones?.[0]?.toLowerCase() || 'temperate'
      };
    } catch (error) {
      console.warn('Failed to get regional data:', error);
      return defaultData;
    }
  }

  private static calculateWaterUse(crop?: string, area: number = 1, regional?: any) {
    const cropCoeff = ESG_MODELS.water_use.crop_coefficients[crop?.toLowerCase() || 'default'];
    const climateCoeff = ESG_MODELS.water_use.climate_factors[regional?.climate_zone || 'default'];
    const irrigationEff = ESG_MODELS.water_use.irrigation_efficiency[regional?.irrigation_method || 'default'];
    
    // Assume 3 tonnes per hectare average yield
    const yieldTonnes = 3;
    const totalYield = area * yieldTonnes;
    
    // Calculate water use (liters to cubic meters)
    const waterPerTonne = cropCoeff * climateCoeff / irrigationEff;
    const totalWaterM3 = (totalYield * waterPerTonne) / 1000; // Convert to m³
    const waterPerHectare = totalWaterM3 / area;
    
    // Efficiency rating
    let efficiency: 'poor' | 'fair' | 'good' | 'excellent';
    if (waterPerTonne > 2000) efficiency = 'poor';
    else if (waterPerTonne > 1500) efficiency = 'fair';
    else if (waterPerTonne > 800) efficiency = 'good';
    else efficiency = 'excellent';

    return {
      total_m3: Math.round(totalWaterM3),
      per_hectare: Math.round(waterPerHectare),
      per_tonne: Math.round(waterPerTonne),
      efficiency_rating: efficiency,
      sources: ['FAO AQUASTAT', 'Crop water requirements database']
    };
  }

  private static calculateCarbonFootprint(crop?: string, area: number = 1, regional?: any) {
    const cropEmissions = ESG_MODELS.carbon_footprint.crop_emissions[crop?.toLowerCase() || 'default'];
    const totalCropEmissions = area * cropEmissions;
    
    // Typical input usage (simplified)
    const inputEmissions = {
      fertilizers: area * 200 * 5.9, // 200 kg N per hectare
      machinery: area * 150, // Diesel usage
      transportation: area * 50,
      land_use_change: 0, // Assume no LUC
      other: area * 100
    };
    
    const totalEmissions = totalCropEmissions + Object.values(inputEmissions).reduce((a, b) => a + b, 0);
    
    // Calculate per unit metrics (assume 3 tonnes per hectare)
    const yieldTonnes = 3;
    const totalYield = area * yieldTonnes;
    
    // Sequestration potential
    const practices = regional?.management_practices || ['conventional'];
    let sequestration = 0;
    practices.forEach((practice: string) => {
      sequestration += ESG_MODELS.carbon_footprint.sequestration_rates[practice] || 0;
    });
    sequestration *= area;

    return {
      total_kg_co2: Math.round(totalEmissions),
      per_hectare: Math.round(totalEmissions / area),
      per_tonne: Math.round(totalEmissions / totalYield),
      breakdown: {
        fertilizers: Math.round(inputEmissions.fertilizers),
        machinery: Math.round(inputEmissions.machinery),
        transportation: Math.round(inputEmissions.transportation),
        land_use_change: Math.round(inputEmissions.land_use_change),
        other: Math.round(inputEmissions.other)
      },
      sequestration_potential: Math.round(sequestration)
    };
  }

  private static calculateSoilHealth(regional?: any) {
    const soilType = regional?.soil_type || 'default';
    const baseline = ESG_MODELS.soil_health.baseline_scores[soilType];
    const practices = regional?.management_practices || ['conventional'];
    
    let modifiedScores = { ...baseline };
    
    // Apply practice modifiers
    practices.forEach((practice: string) => {
      const modifier = ESG_MODELS.soil_health.practice_modifiers[practice];
      if (modifier) {
        modifiedScores.om += modifier.om;
        modifiedScores.biodiversity = Math.max(0, Math.min(100, modifiedScores.biodiversity + modifier.biodiversity));
        modifiedScores.ph += modifier.ph;
        // Erosion risk adjustment logic would go here
      }
    });
    
    // Calculate composite index (0-100)
    const indexScore = Math.round(
      (modifiedScores.om / 6 * 30) + // Organic matter weight: 30%
      (modifiedScores.biodiversity * 0.4) + // Biodiversity weight: 40%
      ((7 - Math.abs(modifiedScores.ph - 6.5)) / 1.5 * 30) // pH weight: 30%
    );
    
    // Determine nutrient balance (simplified)
    let nutrientBalance: 'deficit' | 'balanced' | 'excess';
    if (practices.includes('organic')) nutrientBalance = 'balanced';
    else if (practices.includes('intensive')) nutrientBalance = 'excess';
    else nutrientBalance = 'deficit';

    return {
      index_score: Math.max(0, Math.min(100, indexScore)),
      organic_matter_pct: Math.round(modifiedScores.om * 10) / 10,
      erosion_risk: baseline.erosion,
      biodiversity_score: Math.max(0, Math.min(100, Math.round(modifiedScores.biodiversity))),
      ph_level: Math.round(modifiedScores.ph * 10) / 10,
      nutrient_balance: nutrientBalance
    };
  }

  private static calculateSustainabilityScore(waterUse: any, carbonFootprint: any, soilHealth: any): number {
    // Water efficiency score (0-100)
    const waterScore = waterUse.efficiency_rating === 'excellent' ? 90 :
                      waterUse.efficiency_rating === 'good' ? 70 :
                      waterUse.efficiency_rating === 'fair' ? 50 : 30;
    
    // Carbon score - lower emissions per tonne = higher score
    const carbonScore = Math.max(0, 100 - (carbonFootprint.per_tonne / 50)); // Scale based on 5000 kg CO2e being poor
    
    // Soil health is already 0-100
    const soilScore = soilHealth.index_score;
    
    // Weighted composite score
    const composite = (waterScore * 0.3) + (carbonScore * 0.4) + (soilScore * 0.3);
    
    return Math.round(composite);
  }

  private static async getBenchmarks(crop?: string, country?: string) {
    // Mock benchmarks - in production would come from database/research
    return {
      regional_average: 65,
      industry_best: 85,
      global_target: 75
    };
  }

  private static generateRecommendations(waterUse: any, carbonFootprint: any, soilHealth: any): string[] {
    const recommendations: string[] = [];
    
    // Water recommendations
    if (waterUse.efficiency_rating === 'poor' || waterUse.efficiency_rating === 'fair') {
      recommendations.push('Consider upgrading to more efficient irrigation systems (drip or precision sprinklers)');
      recommendations.push('Implement soil moisture monitoring to optimize irrigation timing');
    }
    
    // Carbon recommendations
    if (carbonFootprint.per_tonne > 2000) {
      recommendations.push('Reduce fertilizer application through precision agriculture');
      recommendations.push('Consider renewable energy sources for operations');
    }
    
    if (carbonFootprint.sequestration_potential < 500) {
      recommendations.push('Implement carbon sequestering practices like cover crops or agroforestry');
    }
    
    // Soil health recommendations
    if (soilHealth.index_score < 60) {
      recommendations.push('Increase organic matter through compost or cover crops');
      recommendations.push('Consider crop rotation to improve soil biodiversity');
    }
    
    if (soilHealth.erosion_risk === 'high' || soilHealth.erosion_risk === 'critical') {
      recommendations.push('Implement erosion control measures (terracing, contour plowing)');
    }
    
    if (soilHealth.nutrient_balance === 'excess') {
      recommendations.push('Reduce fertilizer inputs and consider nutrient management planning');
    }
    
    // General sustainability recommendations
    recommendations.push('Monitor and track sustainability metrics regularly');
    recommendations.push('Consider certification programs (organic, sustainable agriculture standards)');
    
    return recommendations.slice(0, 8); // Limit to most important recommendations
  }
}

// GET /api/agri/esg/metrics - Calculate and return ESG metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region_key = searchParams.get('region_key');
    const country = searchParams.get('country');
    const crop = searchParams.get('crop');
    const area_hectares = searchParams.get('area_hectares') ? parseFloat(searchParams.get('area_hectares')!) : 1;
    const calculation_method = searchParams.get('calculation_method') as 'modeled' | 'measured' | 'satellite' | 'hybrid' || 'modeled';

    const requestParams: ESGMetricsRequest = {
      region_key: region_key || undefined,
      country: country || undefined,
      crop: crop || undefined,
      area_hectares,
      calculation_method
    };

    // Calculate ESG metrics
    const metrics = await ESGCalculator.calculateMetrics(requestParams);

    // Store snapshot in database
    try {
      const snapshot = await prisma.eSGSnapshot.create({
        data: {
          region_key: region_key || `${country || 'global'}:${crop || 'mixed'}`,
          water_use_m3: metrics.water_use.per_hectare,
          co2_intensity: metrics.carbon_footprint.per_tonne,
          soil_health_index: metrics.soil_health.index_score,
          calculation_method: calculation_method,
          data_sources: metrics.data_quality.sources,
          assumptions: metrics.data_quality.assumptions,
          confidence: metrics.data_quality.confidence,
          measurement_year: new Date().getFullYear(),
          measurement_season: getCurrentSeason(),
          ...(country && {
            country: {
              connect: {
                iso2: country.toUpperCase()
              }
            }
          })
        }
      });

      console.log('ESG snapshot saved:', snapshot.id);
    } catch (dbError) {
      console.warn('Failed to save ESG snapshot:', dbError);
    }

    return NextResponse.json({
      success: true,
      data: metrics,
      metadata: {
        calculation_method,
        area_hectares,
        region_key: region_key || `${country || 'global'}:${crop || 'mixed'}`,
        calculated_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }
    });

  } catch (error) {
    console.error('ESG metrics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate ESG metrics',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }

}

// Helper function
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// POST /api/agri/esg/metrics - Batch calculate metrics for multiple scenarios
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarios } = body;

    if (!Array.isArray(scenarios)) {
      return NextResponse.json({
        success: false,
        error: 'Scenarios must be an array'
      }, { status: 400 });
    }

    const results = [];
    
    for (const scenario of scenarios) {
      try {
        const metrics = await ESGCalculator.calculateMetrics(scenario);
        results.push({
          scenario: scenario,
          metrics: metrics,
          success: true
        });
      } catch (scenarioError) {
        results.push({
          scenario: scenario,
          error: scenarioError,
          success: false
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      data: results,
      summary: {
        total_scenarios: scenarios.length,
        successful,
        failed,
        completion_rate: successful / scenarios.length
      }
    });

  } catch (error) {
    console.error('ESG batch calculation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate batch ESG metrics',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
