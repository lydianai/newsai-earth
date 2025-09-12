import { z } from "zod";

// Environment validation schema
const envSchema = z.object({
  // Core Settings
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SITE_URL: z.string().url().default("https://newsai.earth"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("tr"),
  
  // Database
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  VECTOR_BACKEND: z.enum(["pgvector", "pinecone", "weaviate"]).default("pgvector"),
  
  // Redis Cache
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // LLM Providers (at least one required)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(), 
  MISTRAL_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  
  // News & Data APIs
  NEWSAPI_KEY: z.string().optional(),
  MEDIASTACK_KEY: z.string().optional(),
  GUARDIAN_API_KEY: z.string().optional(),
  
  // Financial Data
  ALPHAVANTAGE_KEY: z.string().optional(),
  TWELVEDATA_KEY: z.string().optional(),
  
  // External Services
  ELEVENLABS_API_KEY: z.string().optional(), // TTS
  IBM_Q_API_KEY: z.string().optional(), // Quantum
  
  // Social & Reddit
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional(),
  REDDIT_REDIRECT_URI: z.string().url().optional(),
  
  // Features Flags
  HN_ENABLED: z.string().transform(val => val === "true").default("true"),
  XR_ENABLE: z.string().transform(val => val === "true").default("true"),
  DIGITALTWIN_ENABLE: z.string().transform(val => val === "true").default("true"),
  
  // Translation
  TRANSLATE_PROVIDER: z.enum(["openai", "gemini", "mistral"]).default("openai"),
  TRANSLATE_API_KEY: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),
  
  // User Agent
  WIKIPEDIA_UA: z.string().default("newsai.earth/1.0"),
});

type Env = z.infer<typeof envSchema>;

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentError";
  }
}

let _validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (_validatedEnv) return _validatedEnv;
  
  try {
    _validatedEnv = envSchema.parse(process.env);
    return _validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `Environment validation failed:\n${error.errors
        .map(err => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n')}`;
      
      console.error(errorMessage);
      throw new EnvironmentError(errorMessage);
    }
    throw error;
  }
}

// Helper functions for specific checks
export function hasLLMProvider(): boolean {
  const env = getEnv();
  return !!(
    env.OPENAI_API_KEY || 
    env.ANTHROPIC_API_KEY || 
    env.MISTRAL_API_KEY || 
    env.GEMINI_API_KEY || 
    env.GROQ_API_KEY
  );
}

export function hasNewsAPI(): boolean {
  const env = getEnv();
  return !!(env.NEWSAPI_KEY || env.MEDIASTACK_KEY || env.GUARDIAN_API_KEY);
}

export function hasRedisCache(): boolean {
  const env = getEnv();
  return !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === "development";
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}

// Export types
export type { Env };
export { EnvironmentError };

// Environment status check
export function checkEnvironmentHealth(): {
  status: "healthy" | "degraded" | "unhealthy";
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  try {
    const env = getEnv();
    
    // Critical checks
    if (!env.DATABASE_URL) issues.push("DATABASE_URL missing");
    if (!hasLLMProvider()) issues.push("No LLM provider configured");
    
    // Warning checks  
    if (!hasNewsAPI()) warnings.push("No news API configured - will use fallback data");
    if (!hasRedisCache()) warnings.push("Redis cache not configured - performance may be slower");
    if (!env.SENTRY_DSN) warnings.push("Error tracking not configured");
    
    const status = issues.length > 0 ? "unhealthy" : warnings.length > 0 ? "degraded" : "healthy";
    
    return { status, issues, warnings };
    
  } catch (error) {
    issues.push(`Environment validation failed: ${error instanceof Error ? error.message : String(error)}`);
    return { status: "unhealthy", issues, warnings };
  }
}
