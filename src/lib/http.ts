import { getEnv, isDevelopment } from "./env";

// HTTP Client with retry, backoff, and circuit breaker functionality
export class HTTPError extends Error {
  constructor(
    message: string, 
    public status: number, 
    public response?: Response,
    public data?: any
  ) {
    super(message);
    this.name = "HTTPError";
  }
}

export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerError";
  }
}

// Circuit breaker states
type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number; // milliseconds
  monitoringPeriod: number; // milliseconds
}

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failures = 0;
  private lastFailureTime = 0;
  private successes = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime < this.config.resetTimeout) {
        throw new CircuitBreakerError("Circuit breaker is open");
      }
      this.state = "half-open";
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.successes++;
    if (this.state === "half-open") {
      this.state = "closed";
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.config.failureThreshold) {
      this.state = "open";
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Retry configuration
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  jitter: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  jitter: true,
};

// HTTP Client configuration
interface HTTPClientConfig {
  baseURL?: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
  retry: RetryConfig;
  circuitBreaker: CircuitBreakerConfig;
}

const DEFAULT_HTTP_CONFIG: HTTPClientConfig = {
  timeout: 30000, // 30 seconds
  defaultHeaders: {
    "Content-Type": "application/json",
    "User-Agent": "newsai.earth/1.0",
  },
  retry: DEFAULT_RETRY_CONFIG,
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 60000, // 1 minute
    monitoringPeriod: 10000, // 10 seconds
  },
};

export class HTTPClient {
  private config: HTTPClientConfig;
  private circuitBreakers = new Map<string, CircuitBreaker>();

  constructor(config: Partial<HTTPClientConfig> = {}) {
    this.config = { ...DEFAULT_HTTP_CONFIG, ...config };
  }

  private getCircuitBreaker(url: string): CircuitBreaker {
    const domain = new URL(url).hostname;
    if (!this.circuitBreakers.has(domain)) {
      this.circuitBreakers.set(
        domain,
        new CircuitBreaker(this.config.circuitBreaker)
      );
    }
    return this.circuitBreakers.get(domain)!;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    delay = Math.min(delay, config.maxDelay);
    
    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5); // 50-100% of calculated delay
    }
    
    return delay;
  }

  private shouldRetry(error: any, attempt: number): boolean {
    if (attempt >= this.config.retry.maxAttempts) return false;
    
    // Retry on network errors
    if (error instanceof TypeError) return true;
    
    // Retry on HTTP errors
    if (error instanceof HTTPError) {
      // Retry on 5xx errors and 429 (rate limit)
      return error.status >= 500 || error.status === 429;
    }
    
    return false;
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const result = await operation();
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async request<T = any>(
    url: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<T> {
    const fullUrl = this.config.baseURL ? `${this.config.baseURL}${url}` : url;
    const timeout = options.timeout || this.config.timeout;
    const circuitBreaker = this.getCircuitBreaker(fullUrl);

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.defaultHeaders,
        ...options.headers,
      },
    };

    return circuitBreaker.execute(async () => {
      let lastError: any;
      
      for (let attempt = 1; attempt <= this.config.retry.maxAttempts; attempt++) {
        try {
          const response = await this.executeWithTimeout(
            () => fetch(fullUrl, requestOptions),
            timeout
          );

          if (!response.ok) {
            const errorData = await response.text().catch(() => "Unknown error");
            const error = new HTTPError(
              `HTTP ${response.status}: ${response.statusText}`,
              response.status,
              response,
              errorData
            );
            
            if (!this.shouldRetry(error, attempt)) {
              throw error;
            }
            lastError = error;
          } else {
            // Success - parse response
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
              return await response.json();
            }
            return await response.text() as T;
          }
        } catch (error) {
          lastError = error;
          
          if (!this.shouldRetry(error, attempt)) {
            throw error;
          }
          
          if (isDevelopment()) {
            console.warn(`Request attempt ${attempt} failed:`, error);
          }
        }

        // Wait before retry (except for last attempt)
        if (attempt < this.config.retry.maxAttempts) {
          const delay = this.calculateDelay(attempt, this.config.retry);
          await this.sleep(delay);
        }
      }

      throw lastError;
    });
  }

  // Convenience methods
  async get<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  async post<T = any>(
    url: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(
    url: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }

  // Circuit breaker status
  getCircuitBreakerStatus(url?: string) {
    if (url) {
      const domain = new URL(url).hostname;
      const breaker = this.circuitBreakers.get(domain);
      return breaker ? { domain, state: breaker.getState() } : null;
    }
    
    return Array.from(this.circuitBreakers.entries()).map(([domain, breaker]) => ({
      domain,
      state: breaker.getState(),
    }));
  }
}

// Singleton instance
let _httpClient: HTTPClient | null = null;

export function getHTTPClient(): HTTPClient {
  if (!_httpClient) {
    const env = getEnv();
    _httpClient = new HTTPClient({
      defaultHeaders: {
        "Content-Type": "application/json",
        "User-Agent": env.WIKIPEDIA_UA,
      },
    });
  }
  return _httpClient;
}

// Safe JSON parsing utility
export function safeJSONParse<T = any>(text: string, fallback: T): T {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
