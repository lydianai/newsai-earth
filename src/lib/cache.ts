import { getEnv, hasRedisCache } from "./env";

// Cache interface
export interface CacheAdapter {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

// In-memory cache implementation (fallback)
class MemoryCache implements CacheAdapter {
  private store = new Map<string, { value: any; expires?: number }>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    // Clean up expired items every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async get<T = any>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expires && Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    const expires = ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : undefined;
    this.store.set(key, { value, expires });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      this.store.clear();
      return;
    }
    
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];
    
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.store.delete(key));
  }

  async has(key: string): Promise<boolean> {
    const item = this.store.get(key);
    if (!item) return false;
    
    if (item.expires && Date.now() > item.expires) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (item.expires && now > item.expires) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Redis cache implementation
class RedisCache implements CacheAdapter {
  private baseUrl: string;
  private token: string;

  constructor(url: string, token: string) {
    this.baseUrl = url;
    this.token = token;
  }

  private async request(command: string[], returnType: 'json' | 'text' = 'json'): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${command.join('/')}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Redis request failed: ${response.statusText}`);
    }

    return returnType === 'json' ? response.json() : response.text();
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const result = await this.request(['GET', key]);
      return result.result ? JSON.parse(result.result) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.request(['SETEX', key, ttlSeconds.toString(), serialized]);
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.request(['DEL', key]);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw error;
    }
  }

  async clear(pattern = '*'): Promise<void> {
    try {
      // Get keys matching pattern
      const result = await this.request(['KEYS', pattern]);
      const keys = result.result || [];
      
      if (keys.length > 0) {
        await this.request(['DEL', ...keys]);
      }
    } catch (error) {
      console.error('Redis CLEAR error:', error);
      throw error;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const result = await this.request(['EXISTS', key]);
      return result.result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }
}

// Cache manager with TTL strategies
export class CacheManager {
  private adapter: CacheAdapter;
  
  // TTL presets
  static readonly TTL = {
    SHORT: 300,     // 5 minutes
    MEDIUM: 1800,   // 30 minutes  
    LONG: 3600,     // 1 hour
    DAILY: 86400,   // 24 hours
    WEEKLY: 604800, // 7 days
  } as const;

  constructor(adapter?: CacheAdapter) {
    this.adapter = adapter || this.createDefaultAdapter();
  }

  private createDefaultAdapter(): CacheAdapter {
    if (hasRedisCache()) {
      const env = getEnv();
      try {
        return new RedisCache(env.UPSTASH_REDIS_REST_URL!, env.UPSTASH_REDIS_REST_TOKEN!);
      } catch (error) {
        console.warn('Redis cache initialization failed, falling back to memory cache:', error);
      }
    }
    return new MemoryCache();
  }

  // Core cache operations
  async get<T = any>(key: string): Promise<T | null> {
    return this.adapter.get<T>(key);
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    return this.adapter.set(key, value, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    return this.adapter.delete(key);
  }

  async clear(pattern?: string): Promise<void> {
    return this.adapter.clear(pattern);
  }

  async has(key: string): Promise<boolean> {
    return this.adapter.has(key);
  }

  // Higher level operations
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = CacheManager.TTL.MEDIUM
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  async wrap<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean } = {}
  ): Promise<T> {
    const { ttl = CacheManager.TTL.MEDIUM, forceRefresh = false } = options;

    if (!forceRefresh) {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }
    }

    const value = await fetcher();
    await this.set(key, value, ttl);
    return value;
  }

  // Batch operations
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const results = await Promise.allSettled(
      keys.map(async (key) => ({ key, value: await this.get<T>(key) }))
    );

    const output: Record<string, T | null> = {};
    results.forEach((result, index) => {
      const key = keys[index];
      output[key] = result.status === 'fulfilled' ? result.value.value : null;
    });

    return output;
  }

  async setMultiple(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    await Promise.allSettled(
      entries.map(({ key, value, ttl }) => this.set(key, value, ttl))
    );
  }

  // Specialized cache keys
  createKey(namespace: string, ...parts: (string | number)[]): string {
    return [namespace, ...parts].join(':');
  }

  // News feed caching
  async cacheNewsFeed(
    source: string, 
    category: string | null, 
    data: any, 
    ttl = CacheManager.TTL.MEDIUM
  ): Promise<void> {
    const key = this.createKey('news', source, category || 'all');
    await this.set(key, data, ttl);
  }

  async getCachedNewsFeed(source: string, category: string | null): Promise<any> {
    const key = this.createKey('news', source, category || 'all');
    return this.get(key);
  }

  // API response caching with versioning
  async cacheAPIResponse(
    endpoint: string,
    params: Record<string, any>,
    response: any,
    ttl = CacheManager.TTL.SHORT
  ): Promise<void> {
    const paramsKey = this.hashParams(params);
    const key = this.createKey('api', endpoint, paramsKey);
    
    const cacheEntry = {
      data: response,
      timestamp: Date.now(),
      ttl,
    };
    
    await this.set(key, cacheEntry, ttl);
  }

  async getCachedAPIResponse(endpoint: string, params: Record<string, any>): Promise<any> {
    const paramsKey = this.hashParams(params);
    const key = this.createKey('api', endpoint, paramsKey);
    const cached = await this.get(key);
    
    if (!cached) return null;
    
    // Check if still valid
    if (Date.now() - cached.timestamp > cached.ttl * 1000) {
      await this.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private hashParams(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < sorted.length; i++) {
      const char = sorted.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency?: number }> {
    const testKey = 'health-check';
    const testValue = { timestamp: Date.now() };
    
    try {
      const start = Date.now();
      
      await this.set(testKey, testValue, 10); // 10 seconds TTL
      const retrieved = await this.get(testKey);
      await this.delete(testKey);
      
      const latency = Date.now() - start;
      
      if (retrieved && retrieved.timestamp === testValue.timestamp) {
        return { status: 'healthy', latency };
      }
      
      return { status: 'unhealthy' };
    } catch (error) {
      return { status: 'unhealthy' };
    }
  }
}

// Singleton instance
let _cacheManager: CacheManager | null = null;

export function getCacheManager(): CacheManager {
  if (!_cacheManager) {
    _cacheManager = new CacheManager();
  }
  return _cacheManager;
}

// Cache decorators for functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  options: {
    keyGenerator?: (...args: Parameters<T>) => string;
    ttl?: number;
    namespace?: string;
  } = {}
) {
  return function decorator(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<T>) {
    const method = descriptor.value!;
    const { ttl = CacheManager.TTL.MEDIUM, namespace = 'fn' } = options;
    
    descriptor.value = async function (this: any, ...args: Parameters<T>) {
      const cache = getCacheManager();
      const keyGenerator = options.keyGenerator || ((...args) => JSON.stringify(args));
      const key = cache.createKey(namespace, propertyName, keyGenerator(...args));
      
      const cached = await cache.get(key);
      if (cached !== null) {
        return cached;
      }
      
      const result = await method.apply(this, args);
      await cache.set(key, result, ttl);
      return result;
    } as T;
    
    return descriptor;
  };
}
