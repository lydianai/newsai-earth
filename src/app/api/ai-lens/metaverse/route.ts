import { NextRequest, NextResponse } from 'next/server';

// Metaverse Metrics Interface
interface MetaverseMetrics {
  active_users: number;
  virtual_worlds: number;
  nft_transactions: number;
  avatar_interactions: number;
  vr_sessions: number;
  ar_overlays: number;
  blockchain_gas: number;
  network_latency: number;
}

// Virtual World Interface
interface VirtualWorld {
  id: string;
  name: string;
  type: string;
  users: number;
  capacity: number;
  status: 'active' | 'maintenance' | 'full';
  location: string;
  activities: string[];
  creation_date: string;
  last_updated: string;
}

// XR Device Interface
interface XRDevice {
  id: string;
  type: 'VR' | 'AR' | 'MR';
  model: string;
  battery: number;
  status: 'online' | 'offline' | 'low_battery';
  user_count: number;
  refresh_rate: number;
  resolution: string;
  tracking_quality: number;
}

export async function GET() {
  try {
    // Generate live metaverse metrics
    const metrics: MetaverseMetrics = {
      active_users: Math.floor(Math.random() * 50000 + 150000),
      virtual_worlds: Math.floor(Math.random() * 20 + 45),
      nft_transactions: Math.floor(Math.random() * 1000 + 5000),
      avatar_interactions: Math.floor(Math.random() * 10000 + 25000),
      vr_sessions: Math.floor(Math.random() * 5000 + 12000),
      ar_overlays: Math.floor(Math.random() * 8000 + 18000),
      blockchain_gas: Number((Math.random() * 50 + 20).toFixed(1)),
      network_latency: Math.floor(Math.random() * 30 + 15)
    };

    // Generate virtual worlds data
    const worldTypes = [
      'Gaming Arena', 'Social Hub', 'Educational Space', 'Business Center',
      'Art Gallery', 'Concert Venue', 'Shopping Mall', 'Sports Stadium',
      'Conference Room', 'Creative Studio', 'Healthcare Center', 'Museum'
    ];

    const locations = [
      'North America', 'Europe', 'Asia Pacific', 'South America',
      'Middle East', 'Africa', 'Australia', 'Antarctica'
    ];

    const activities = [
      'Virtual Meetings', 'Gaming Sessions', 'Art Exhibitions', 'Live Concerts',
      'Educational Workshops', 'Social Gatherings', 'Business Presentations',
      'Sports Events', 'Shopping Experience', 'Creative Collaboration',
      'Healthcare Consultations', 'Cultural Tours', 'Training Simulations'
    ];

    const worlds: VirtualWorld[] = Array.from({ length: 12 }, (_, i) => {
      const capacity = Math.floor(Math.random() * 500 + 100);
      const users = Math.floor(Math.random() * capacity * 0.8);
      const status = users >= capacity * 0.95 ? 'full' : 
                   Math.random() > 0.9 ? 'maintenance' : 'active';
      
      return {
        id: `world_${i + 1}_${Date.now()}`,
        name: `${worldTypes[i % worldTypes.length]} ${i + 1}`,
        type: worldTypes[i % worldTypes.length],
        users,
        capacity,
        status,
        location: locations[i % locations.length],
        activities: activities.slice(i % 3, (i % 3) + 3 + Math.floor(Math.random() * 3)),
        creation_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString()
      };
    });

    // Generate XR devices data
    const deviceModels = {
      VR: ['Meta Quest 3', 'HTC Vive Pro 2', 'PlayStation VR2', 'Pico 4', 'Varjo Aero'],
      AR: ['Microsoft HoloLens 2', 'Magic Leap 2', 'Apple Vision Pro', 'Nreal Air', 'Vuzix Blade'],
      MR: ['Meta Quest Pro', 'Varjo XR-3', 'Lynx R1', 'Pico 4 Enterprise', 'HTC Vive XR Elite']
    };

    const devices: XRDevice[] = Array.from({ length: 15 }, (_, i) => {
      const types: ('VR' | 'AR' | 'MR')[] = ['VR', 'AR', 'MR'];
      const type = types[i % types.length];
      const models = deviceModels[type];
      const battery = Math.floor(Math.random() * 100);
      const status = battery < 20 ? 'low_battery' : 
                    Math.random() > 0.85 ? 'offline' : 'online';
      
      return {
        id: `device_${type}_${i + 1}`,
        type,
        model: models[i % models.length],
        battery,
        status,
        user_count: status === 'online' ? Math.floor(Math.random() * 100 + 10) : 0,
        refresh_rate: type === 'VR' ? (Math.random() > 0.5 ? 90 : 120) : 
                     type === 'AR' ? 60 : 72,
        resolution: type === 'VR' ? '2880x1700' : 
                   type === 'AR' ? '1920x1080' : '2560x2560',
        tracking_quality: Number((Math.random() * 20 + 80).toFixed(1))
      };
    });

    // Generate blockchain data
    const blockchainData = {
      total_nfts: Math.floor(Math.random() * 100000 + 500000),
      active_contracts: Math.floor(Math.random() * 1000 + 5000),
      daily_volume: Number((Math.random() * 1000000 + 2000000).toFixed(2)),
      gas_price_trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
      network_congestion: Number((Math.random() * 100).toFixed(1))
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics,
      worlds,
      devices,
      blockchain: blockchainData,
      server_info: {
        region: 'Global CDN',
        uptime: '99.97%',
        active_servers: Math.floor(Math.random() * 50 + 100),
        load_balancing: 'Optimal'
      },
      status: 'Metaverse Active'
    });

  } catch (error) {
    console.error('Metaverse API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch metaverse data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, worldId, deviceId, settings } = body;

    let response;

    switch (action) {
      case 'join_world':
        response = {
          action: 'join_world',
          world_id: worldId,
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          spawn_point: {
            x: Math.random() * 100,
            y: Math.random() * 100,
            z: Math.random() * 100
          },
          avatar_id: `avatar_${Math.random().toString(36).substr(2, 9)}`,
          permissions: ['move', 'interact', 'voice_chat', 'gesture'],
          world_settings: {
            physics_enabled: true,
            voice_proximity: true,
            max_participants: 500,
            interaction_radius: 10
          }
        };
        break;

      case 'create_world':
        response = {
          action: 'create_world',
          world_id: `custom_world_${Date.now()}`,
          creation_time: new Date().toISOString(),
          settings: settings || {
            name: 'Custom World',
            type: 'Social Hub',
            capacity: 100,
            privacy: 'public',
            physics: true,
            voice_chat: true
          },
          world_url: `metaverse://world/custom_world_${Date.now()}`,
          invite_code: Math.random().toString(36).substr(2, 8).toUpperCase()
        };
        break;

      case 'connect_device':
        response = {
          action: 'connect_device',
          device_id: deviceId,
          connection_status: 'connected',
          calibration: {
            tracking_quality: Number((Math.random() * 20 + 80).toFixed(1)),
            latency: Math.floor(Math.random() * 20 + 5),
            frame_rate: 90,
            resolution: '2880x1700'
          },
          available_features: [
            'hand_tracking',
            'eye_tracking',
            'spatial_audio',
            'haptic_feedback',
            'room_scale_tracking'
          ]
        };
        break;

      case 'update_avatar':
        response = {
          action: 'update_avatar',
          avatar_changes: settings?.avatar || {},
          customization_options: [
            'appearance', 'clothing', 'accessories', 'animations', 'voice'
          ],
          nft_integration: {
            available: true,
            verified_collections: ['BoredApeYachtClub', 'CryptoPunks', 'Azuki'],
            ownership_verified: Math.random() > 0.5
          }
        };
        break;

      default:
        response = {
          action: 'unknown',
          error: 'Unknown action type',
          available_actions: ['join_world', 'create_world', 'connect_device', 'update_avatar']
        };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      response,
      status: 'Action Processed'
    });

  } catch (error) {
    console.error('Metaverse Action Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process metaverse action',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
