import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hf } from '@/lib/hf';

interface AdviceRequest {
  crop: string;
  growth_stage: string;
  soil_type?: string;
  weather_data?: {
    temperature: number[];
    precipitation: number[];
    humidity: number[];
    forecast_days: number;
  };
  risk_factors?: {
    drought: number;
    pest: number;
    disease: number;
    market: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    country?: string;
  };
  language?: string;
  budget_level?: 'low' | 'medium' | 'high';
}

interface AdviceResponse {
  quick_tips: string[];
  plan_low_cost: {
    title: string;
    actions: string[];
    estimated_cost: string;
    timeline: string;
  };
  plan_standard: {
    title: string;
    actions: string[];
    estimated_cost: string;
    timeline: string;
  };
  plan_premium: {
    title: string;
    actions: string[];
    estimated_cost: string;
    timeline: string;
  };
  cautions: string[];
  sources: string[];
  confidence: number;
  generated_at: string;
}

// Agricultural knowledge base for rule-based advice
const AGRICULTURAL_RULES = {
  growth_stages: {
    seedling: {
      priority_actions: ['Ensure adequate moisture', 'Protect from pests', 'Monitor soil temperature'],
      common_issues: ['damping off', 'root rot', 'nutrient deficiency'],
      critical_period: true
    },
    vegetative: {
      priority_actions: ['Balanced fertilization', 'Regular watering', 'Weed control'],
      common_issues: ['nutrient competition', 'water stress', 'pest buildup'],
      critical_period: false
    },
    flowering: {
      priority_actions: ['Reduce nitrogen', 'Increase phosphorus/potassium', 'Monitor pollination'],
      common_issues: ['blossom drop', 'poor pollination', 'calcium deficiency'],
      critical_period: true
    },
    fruiting: {
      priority_actions: ['Consistent watering', 'Support structures', 'Harvest timing'],
      common_issues: ['fruit cracking', 'poor quality', 'storage issues'],
      critical_period: true
    },
    harvest: {
      priority_actions: ['Optimal timing', 'Proper handling', 'Quick processing'],
      common_issues: ['overripening', 'damage during harvest', 'post-harvest losses'],
      critical_period: true
    }
  },
  soil_types: {
    clay: {
      advantages: ['Good nutrient retention', 'Stable structure'],
      challenges: ['Poor drainage', 'Hard when dry', 'Slow warming'],
      recommendations: ['Improve drainage', 'Add organic matter', 'Avoid working when wet']
    },
    sandy: {
      advantages: ['Good drainage', 'Easy to work', 'Quick warming'],
      challenges: ['Poor nutrient retention', 'Requires frequent watering'],
      recommendations: ['Regular fertilization', 'Mulching', 'Organic matter addition']
    },
    loam: {
      advantages: ['Balanced properties', 'Good for most crops'],
      challenges: ['May still need amendments'],
      recommendations: ['Maintain organic matter', 'Regular testing', 'Balanced fertilization']
    },
    silt: {
      advantages: ['Good water retention', 'Fertile'],
      challenges: ['Compaction prone', 'Crusting'],
      recommendations: ['Avoid compaction', 'Surface mulching', 'Gentle cultivation']
    }
  },
  risk_mitigation: {
    drought: {
      preventive: ['Mulching', 'Efficient irrigation', 'Drought-resistant varieties'],
      responsive: ['Deep watering', 'Reduce fertilization', 'Harvest early if needed']
    },
    pest: {
      preventive: ['Beneficial insects', 'Crop rotation', 'Healthy soil'],
      responsive: ['Targeted treatment', 'Monitoring', 'Biological controls']
    },
    disease: {
      preventive: ['Air circulation', 'Resistant varieties', 'Clean cultivation'],
      responsive: ['Remove infected parts', 'Fungicide application', 'Improve conditions']
    },
    market: {
      preventive: ['Diversified crops', 'Contract farming', 'Value addition'],
      responsive: ['Alternative markets', 'Processing options', 'Storage extension']
    }
  }
};

// Agricultural advisor service
class AgriculturalAdvisor {
  static async generateAdvice(request: AdviceRequest): Promise<AdviceResponse> {
    const {
      crop,
      growth_stage,
      soil_type,
      weather_data,
      risk_factors,
      location,
      language = 'en',
      budget_level = 'medium'
    } = request;

    // 1. Generate rule-based baseline advice
    const baselineAdvice = this.generateRuleBasedAdvice(request);

    // 2. Enhance with AI-generated advice
    const aiEnhancedAdvice = await this.enhanceWithAI(baselineAdvice, request, language);

    // 3. Customize by budget level
    const customizedAdvice = this.customizeByBudget(aiEnhancedAdvice, budget_level);

    // 4. Add location-specific recommendations
    const finalAdvice = await this.addLocationSpecificAdvice(customizedAdvice, location);

    return {
      ...finalAdvice,
      sources: [
        'Agricultural extension knowledge base',
        'Local farming best practices',
        language !== 'en' ? 'AI translation service' : '',
        'Weather data integration',
        'Risk assessment models'
      ].filter(Boolean),
      confidence: this.calculateConfidence(request),
      generated_at: new Date().toISOString()
    };
  }

  private static generateRuleBasedAdvice(request: AdviceRequest): Partial<AdviceResponse> {
    const { crop, growth_stage, soil_type, risk_factors } = request;
    
    const stageInfo = AGRICULTURAL_RULES.growth_stages[growth_stage as keyof typeof AGRICULTURAL_RULES.growth_stages];
    const soilInfo = soil_type ? AGRICULTURAL_RULES.soil_types[soil_type as keyof typeof AGRICULTURAL_RULES.soil_types] : null;
    
    const advice: Partial<AdviceResponse> = {
      quick_tips: [],
      cautions: []
    };

    // Stage-based advice
    if (stageInfo) {
      advice.quick_tips!.push(...stageInfo.priority_actions);
      if (stageInfo.critical_period) {
        advice.cautions!.push(`${growth_stage} is a critical growth stage - monitor closely`);
      }
    }

    // Soil-based advice
    if (soilInfo) {
      advice.quick_tips!.push(...soilInfo.recommendations);
      if (soilInfo.challenges.length > 0) {
        advice.cautions!.push(`${soil_type} soil challenges: ${soilInfo.challenges.join(', ')}`);
      }
    }

    // Risk-based advice
    if (risk_factors) {
      Object.entries(risk_factors).forEach(([risk, level]) => {
        if (level > 50) { // High risk threshold
          const riskInfo = AGRICULTURAL_RULES.risk_mitigation[risk as keyof typeof AGRICULTURAL_RULES.risk_mitigation];
          if (riskInfo) {
            advice.quick_tips!.push(...riskInfo.preventive.slice(0, 2)); // Top 2 preventive measures
            advice.cautions!.push(`High ${risk} risk detected - take preventive action`);
          }
        }
      });
    }

    // Basic plans
    advice.plan_low_cost = {
      title: 'Budget-Friendly Approach',
      actions: ['Use organic/local materials', 'Focus on prevention', 'Manual monitoring'],
      estimated_cost: '$50-150 per acre',
      timeline: 'Implement over 2-3 weeks'
    };

    advice.plan_standard = {
      title: 'Standard Management',
      actions: ['Balanced fertilization', 'Integrated pest management', 'Regular monitoring'],
      estimated_cost: '$150-400 per acre',
      timeline: 'Implement over 1-2 weeks'
    };

    advice.plan_premium = {
      title: 'Advanced Management',
      actions: ['Precision agriculture', 'Advanced monitoring', 'Professional consultation'],
      estimated_cost: '$400-800 per acre',
      timeline: 'Implement immediately'
    };

    return advice;
  }

  private static async enhanceWithAI(
    baselineAdvice: Partial<AdviceResponse>,
    request: AdviceRequest,
    language: string
  ): Promise<Partial<AdviceResponse>> {
    try {
      if (!process.env.HUGGINGFACE_API_KEY) {
        console.warn('HF API not available, using baseline advice only');
        return baselineAdvice;
      }

      // Create context for AI enhancement
      const context = `Crop: ${request.crop}, Growth Stage: ${request.growth_stage}, Soil: ${request.soil_type || 'unknown'}`;
      const currentAdvice = baselineAdvice.quick_tips?.join('; ') || '';
      
      // Use AI to enhance and localize advice
      let aiPrompt = `Based on agricultural context: ${context}. Current advice: ${currentAdvice}. `;
      
      if (request.weather_data) {
        const avgTemp = request.weather_data.temperature.reduce((a, b) => a + b, 0) / request.weather_data.temperature.length;
        const totalRain = request.weather_data.precipitation.reduce((a, b) => a + b, 0);
        aiPrompt += `Weather: ${avgTemp}°C average, ${totalRain}mm precipitation expected. `;
      }

      aiPrompt += 'Please provide 3-5 additional specific, actionable farming recommendations.';

      // Get AI enhancement - using mock for now
      const mockAiResponse = {
        success: true,
        data: {
          generated_text: 'Monitor soil moisture daily. Apply balanced fertilizer. Check for early pest signs. Ensure proper drainage.'
        }
      };
      
      if (mockAiResponse.success && mockAiResponse.data?.generated_text) {
        const aiText = mockAiResponse.data.generated_text;
        
        // Parse AI recommendations (simple approach)
        const aiTips = aiText
          .split(/[.!?]/)
          .filter((tip: string) => tip.length > 20 && tip.length < 200)
          .map((tip: string) => tip.trim())
          .slice(0, 3); // Take top 3 AI suggestions

        // Merge with baseline advice
        baselineAdvice.quick_tips = [
          ...(baselineAdvice.quick_tips || []),
          ...aiTips
        ];
      }

      // Handle non-English languages
      if (language !== 'en') {
        baselineAdvice = await this.translateAdvice(baselineAdvice, language);
      }

    } catch (error) {
      console.warn('AI enhancement failed, using baseline advice:', error);
    }

    return baselineAdvice;
  }

  private static async translateAdvice(
    advice: Partial<AdviceResponse>,
    language: string
  ): Promise<Partial<AdviceResponse>> {
    try {
      // Use HF translation capabilities
      const fieldsToTranslate = ['quick_tips', 'cautions'];
      const translatedAdvice = { ...advice };

      for (const field of fieldsToTranslate) {
        if (advice[field as keyof AdviceResponse] && Array.isArray(advice[field as keyof AdviceResponse])) {
          const originalTexts = advice[field as keyof AdviceResponse] as string[];
          const translatedTexts = [];

          for (const text of originalTexts) {
            try {
              // Mock translation for demo - in production would use actual HF translation
              const mockTranslation = await this.mockTranslation(text, language);
              translatedTexts.push(mockTranslation);
            } catch (translationError) {
              console.warn('Translation failed for:', text);
              translatedTexts.push(text); // Fallback to original
            }
          }

          (translatedAdvice as any)[field] = translatedTexts;
        }
      }

      // Translate plan titles and actions
      const plans = ['plan_low_cost', 'plan_standard', 'plan_premium'] as const;
      for (const plan of plans) {
        if (advice[plan]) {
          const originalPlan = advice[plan]!;
          (translatedAdvice as any)[plan] = {
            ...originalPlan,
            title: await this.mockTranslation(originalPlan.title, language),
            actions: await Promise.all(
              originalPlan.actions.map(action => this.mockTranslation(action, language))
            )
          };
        }
      }

      return translatedAdvice;
    } catch (error) {
      console.warn('Translation failed, using original language:', error);
      return advice;
    }
  }

  private static async mockTranslation(text: string, language: string): Promise<string> {
    // Mock translation for demo purposes
    if (language === 'tr') {
      const translations: { [key: string]: string } = {
        'Ensure adequate moisture': 'Yeterli nem sağlayın',
        'Protect from pests': 'Zararlılardan koruyun',
        'Monitor soil temperature': 'Toprak sıcaklığını takip edin',
        'Budget-Friendly Approach': 'Bütçe Dostu Yaklaşım',
        'Standard Management': 'Standart Yönetim',
        'Advanced Management': 'Gelişmiş Yönetim'
      };
      return translations[text] || text;
    }
    return text; // Return original for other languages
  }

  private static customizeByBudget(
    advice: Partial<AdviceResponse>,
    budgetLevel: string
  ): Partial<AdviceResponse> {
    // Adjust recommendations based on budget
    if (budgetLevel === 'low') {
      // Emphasize organic/low-cost solutions
      if (advice.quick_tips) {
        advice.quick_tips = advice.quick_tips.map(tip => {
          if (tip.includes('fertiliz')) return tip.replace('fertiliz', 'compost/organic fertiliz');
          if (tip.includes('pesticide')) return tip.replace('pesticide', 'natural pest control');
          return tip;
        });
      }
    } else if (budgetLevel === 'high') {
      // Add premium recommendations
      if (advice.quick_tips) {
        advice.quick_tips.push('Consider precision agriculture technology');
        advice.quick_tips.push('Professional soil and tissue analysis recommended');
      }
    }

    return advice;
  }

  private static async addLocationSpecificAdvice(
    advice: Partial<AdviceResponse>,
    location?: AdviceRequest['location']
  ): Promise<AdviceResponse> {
    const finalAdvice = advice as AdviceResponse;

    if (location?.country) {
      // Add country-specific considerations
      const countryAdvice = this.getCountrySpecificAdvice(location.country);
      if (countryAdvice.length > 0) {
        finalAdvice.cautions = [...(finalAdvice.cautions || []), ...countryAdvice];
      }
    }

    // Ensure all required fields are present
    finalAdvice.quick_tips = finalAdvice.quick_tips || [];
    finalAdvice.cautions = finalAdvice.cautions || [];
    
    if (!finalAdvice.plan_low_cost) {
      finalAdvice.plan_low_cost = {
        title: 'Basic Care Plan',
        actions: ['Regular monitoring', 'Basic maintenance'],
        estimated_cost: '$50-100',
        timeline: '2-3 weeks'
      };
    }

    if (!finalAdvice.plan_standard) {
      finalAdvice.plan_standard = {
        title: 'Standard Care Plan',
        actions: ['Comprehensive management', 'Regular inputs'],
        estimated_cost: '$150-300',
        timeline: '1-2 weeks'
      };
    }

    if (!finalAdvice.plan_premium) {
      finalAdvice.plan_premium = {
        title: 'Premium Care Plan',
        actions: ['Advanced techniques', 'Professional support'],
        estimated_cost: '$400-600',
        timeline: 'Immediate'
      };
    }

    return finalAdvice;
  }

  private static getCountrySpecificAdvice(country: string): string[] {
    const countrySpecific: { [key: string]: string[] } = {
      'TR': ['Consider Mediterranean climate patterns', 'Check local agricultural extension services'],
      'US': ['Review USDA recommendations', 'Consider regional climate zones'],
      'IN': ['Monitor monsoon patterns', 'Consider local varieties'],
      'BR': ['Account for tropical conditions', 'Consider intercropping systems']
    };

    return countrySpecific[country] || [];
  }

  private static calculateConfidence(request: AdviceRequest): number {
    let confidence = 0.6; // Base confidence

    // Increase confidence based on available data
    if (request.soil_type) confidence += 0.1;
    if (request.weather_data) confidence += 0.15;
    if (request.risk_factors) confidence += 0.1;
    if (request.location) confidence += 0.05;

    return Math.min(0.95, confidence);
  }
}

// POST /api/agri/advice - Generate agricultural advice
export async function POST(request: NextRequest) {
  try {
    const body: AdviceRequest = await request.json();

    if (!body.crop || !body.growth_stage) {
      return NextResponse.json({
        success: false,
        error: 'Crop and growth_stage are required'
      }, { status: 400 });
    }

    // Generate advice
    const advice = await AgriculturalAdvisor.generateAdvice(body);

    // Store advice log in database
    try {
      const saved = await prisma.adviceLog.create({
        data: {
          cropId: 'temp-crop-id', // Would resolve properly in production
          growth_stage: body.growth_stage,
          soil_type: body.soil_type,
          weather_data: body.weather_data as any,
          risk_factors: body.risk_factors as any,
          latitude: body.location?.latitude,
          longitude: body.location?.longitude,
          country_code: body.location?.country,
          language: body.language || 'en',
          quick_tips: advice.quick_tips,
          plan_low_cost: JSON.stringify(advice.plan_low_cost),
          plan_standard: JSON.stringify(advice.plan_standard),
          plan_premium: JSON.stringify(advice.plan_premium),
          cautions: advice.cautions,
          model_used: 'rule_based_ai',
          confidence: advice.confidence
        }
      });

      console.log('Advice log saved:', saved.id);
    } catch (dbError) {
      console.warn('Failed to save advice log:', dbError);
    }

    return NextResponse.json({
      success: true,
      data: advice
    });

  } catch (error) {
    console.error('Agricultural advice error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate agricultural advice',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// GET /api/agri/advice - Get advice history and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop');
    const language = searchParams.get('language');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const where: any = {};
    if (crop) {
      where.crop = {
        OR: [
          { name_en: { contains: crop, mode: 'insensitive' } },
          { name_tr: { contains: crop, mode: 'insensitive' } }
        ]
      };
    }
    if (language) {
      where.language = language;
    }

    const adviceLogs = await prisma.adviceLog.findMany({
      where,
      include: {
        crop: {
          select: {
            name_en: true,
            name_tr: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    const processedLogs = adviceLogs.map(log => ({
      id: log.id,
      crop: log.crop ? {
        name: log.crop.name_en,
        name_tr: log.crop.name_tr,
        category: log.crop.category
      } : null,
      growth_stage: log.growth_stage,
      language: log.language,
      confidence: log.confidence,
      location: log.latitude && log.longitude ? {
        latitude: log.latitude,
        longitude: log.longitude,
        country: log.country_code
      } : null,
      created_at: log.createdAt.toISOString(),
      summary: {
        tips_count: log.quick_tips.length,
        cautions_count: log.cautions.length,
        has_weather_data: !!log.weather_data,
        has_risk_factors: !!log.risk_factors
      }
    }));

    return NextResponse.json({
      success: true,
      data: processedLogs,
      metadata: {
        total: adviceLogs.length,
        by_language: adviceLogs.reduce((acc, log) => {
          acc[log.language] = (acc[log.language] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_growth_stage: adviceLogs.reduce((acc, log) => {
          acc[log.growth_stage] = (acc[log.growth_stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        avg_confidence: adviceLogs.length > 0
          ? adviceLogs.reduce((sum, log) => sum + (log.confidence || 0), 0) / adviceLogs.length
          : 0
      }
    });

  } catch (error) {
    console.error('Advice history error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch advice history',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
