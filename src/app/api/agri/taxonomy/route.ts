import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/agri/taxonomy - Fetch crops/countries with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const type = searchParams.get('type') || 'crops'; // 'crops' | 'countries' | 'profiles'

    const skip = (page - 1) * limit;

    if (type === 'crops') {
      const where: Prisma.CropWhereInput = {};
      
      if (category) {
        where.category = category as any;
      }
      
      if (search) {
        where.OR = [
          { name_en: { contains: search, mode: 'insensitive' } },
          { name_tr: { contains: search, mode: 'insensitive' } },
          { synonyms: { has: search } },
        ];
      }

      const [crops, total] = await Promise.all([
        prisma.crop.findMany({
          where,
          include: {
            profiles: {
              include: {
                country: {
                  select: { iso2: true, name_en: true }
                }
              },
              take: 3 // Top 3 producing countries
            },
            _count: {
              select: { profiles: true }
            }
          },
          skip,
          take: limit,
          orderBy: { name_en: 'asc' }
        }),
        prisma.crop.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: crops,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    if (type === 'countries') {
      const where: Prisma.CountryWhereInput = {};
      
      if (search) {
        where.OR = [
          { name_en: { contains: search, mode: 'insensitive' } },
          { name_local: { contains: search, mode: 'insensitive' } },
          { iso2: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [countries, total] = await Promise.all([
        prisma.country.findMany({
          where,
          include: {
            _count: {
              select: { profiles: true }
            }
          },
          skip,
          take: limit,
          orderBy: { name_en: 'asc' }
        }),
        prisma.country.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: countries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    if (type === 'profiles') {
      const where: Prisma.CropCountryProfileWhereInput = {};
      
      if (country) {
        where.country = { iso2: country };
      }

      const [profiles, total] = await Promise.all([
        prisma.cropCountryProfile.findMany({
          where,
          include: {
            crop: {
              select: { name_en: true, name_tr: true, category: true }
            },
            country: {
              select: { iso2: true, name_en: true, name_local: true }
            }
          },
          skip,
          take: limit,
          orderBy: [
            { production_avg: 'desc' },
            { area_avg: 'desc' }
          ]
        }),
        prisma.cropCountryProfile.count({ where })
      ]);

      return NextResponse.json({
        success: true,
        data: profiles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type parameter. Use: crops, countries, or profiles'
    }, { status: 400 });

  } catch (error) {
    console.error('Taxonomy API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch taxonomy data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// POST /api/agri/taxonomy - Create crop/country (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // TODO: Add admin authentication check here
    // if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (type === 'crop') {
      const crop = await prisma.crop.create({
        data: {
          name_en: data.name_en,
          name_tr: data.name_tr,
          name_local: data.name_local || {},
          synonyms: data.synonyms || [],
          hs_codes: data.hs_codes || [],
          category: data.category,
          water_need: data.water_need || 'MEDIUM',
          growth_stages: data.growth_stages || [],
          min_temp: data.min_temp,
          max_temp: data.max_temp,
          rainfall_min: data.rainfall_min,
          rainfall_max: data.rainfall_max,
          global_production: data.global_production,
          major_producers: data.major_producers || []
        }
      });

      return NextResponse.json({
        success: true,
        data: crop
      });
    }

    if (type === 'country') {
      const country = await prisma.country.create({
        data: {
          iso2: data.iso2,
          iso3: data.iso3,
          name_en: data.name_en,
          name_local: data.name_local,
          regions: data.regions || [],
          latitude: data.latitude,
          longitude: data.longitude,
          area_km2: data.area_km2,
          climate_zones: data.climate_zones || []
        }
      });

      return NextResponse.json({
        success: true,
        data: country
      });
    }

    if (type === 'profile') {
      const profile = await prisma.cropCountryProfile.create({
        data: {
          cropId: data.cropId,
          countryId: data.countryId,
          area_avg: data.area_avg,
          yield_avg: data.yield_avg,
          production_avg: data.production_avg,
          planting_window: data.planting_window,
          harvest_window: data.harvest_window,
          season_notes: data.season_notes,
          price_avg: data.price_avg,
          export_volume: data.export_volume,
          domestic_use: data.domestic_use
        }
      });

      return NextResponse.json({
        success: true,
        data: profile
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type parameter'
    }, { status: 400 });

  } catch (error) {
    console.error('Taxonomy POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create taxonomy entry',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
