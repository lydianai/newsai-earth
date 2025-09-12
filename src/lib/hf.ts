// Hugging Face Inference API Wrapper
// Provides type-safe access to HF models with fallback support

interface HFInferenceOptions {
  timeout?: number;
  maxRetries?: number;
  backoffFactor?: number;
}

interface HFResponse<T = any> {
  data: T;
  model: string;
  processingTime?: number;
  error?: string;
}

interface SentenceEmbeddingInput {
  inputs: string | string[];
  options?: {
    wait_for_model?: boolean;
    use_cache?: boolean;
  };
}

interface ZeroShotClassificationInput {
  inputs: string;
  parameters: {
    candidate_labels: string[];
    hypothesis_template?: string;
  };
}

interface SummarizationInput {
  inputs: string;
  parameters?: {
    max_length?: number;
    min_length?: number;
    do_sample?: boolean;
    temperature?: number;
  };
}

interface QuestionAnsweringInput {
  inputs: {
    question: string;
    context: string;
  };
}

class HuggingFaceInference {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';
  private defaultTimeout = 30000;
  private maxRetries = 3;

  constructor(apiKey?: string, options: HFInferenceOptions = {}) {
    this.apiKey = apiKey || process.env.HUGGINGFACE_API_KEY || '';
    this.defaultTimeout = options.timeout || this.defaultTimeout;
    this.maxRetries = options.maxRetries || this.maxRetries;

    if (!this.apiKey && process.env.NODE_ENV !== 'development') {
      console.warn('Hugging Face API key not found. HF features will be disabled.');
    }
  }

  private async makeRequest<T>(
    model: string,
    payload: any,
    retryCount = 0
  ): Promise<HFResponse<T>> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'newsai-earth/1.0'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle model loading (503) with retry
        if (response.status === 503 && retryCount < this.maxRetries) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return this.makeRequest<T>(model, payload, retryCount + 1);
        }
        
        throw new Error(`HF API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        data,
        model,
        processingTime
      };

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.defaultTimeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown HF API error');
    }
  }

  // Sentence Embeddings (Multi-language)
  async embeddings(
    input: string | string[], 
    model?: string
  ): Promise<HFResponse<number[][] | number[]>> {
    const modelName = model || process.env.HF_SENTENCE_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
    
    return this.makeRequest<number[][] | number[]>(modelName, {
      inputs: input,
      options: {
        wait_for_model: true,
        use_cache: true
      }
    });
  }

  // Zero-shot Classification
  async classify(
    text: string, 
    labels: string[], 
    model?: string,
    template?: string
  ): Promise<HFResponse<{ labels: string[]; scores: number[]; }>> {
    const modelName = model || process.env.HF_ZS_CLASSIFIER || 'facebook/bart-large-mnli';
    
    return this.makeRequest(modelName, {
      inputs: text,
      parameters: {
        candidate_labels: labels,
        hypothesis_template: template || "This text is about {}"
      }
    });
  }

  // Text Summarization (Multi-language)
  async summarize(
    text: string, 
    options: {
      maxLength?: number;
      minLength?: number;
      model?: string;
    } = {}
  ): Promise<HFResponse<{ summary_text: string; }[]>> {
    const modelName = options.model || process.env.HF_SUMMARY_MODEL || 'facebook/bart-large-cnn';
    
    return this.makeRequest(modelName, {
      inputs: text,
      parameters: {
        max_length: options.maxLength || 150,
        min_length: options.minLength || 30,
        do_sample: false
      }
    });
  }

  // Question Answering (Multi-language)
  async questionAnswering(
    question: string,
    context: string,
    model?: string
  ): Promise<HFResponse<{ answer: string; score: number; }>> {
    const modelName = model || process.env.HF_QA_MODEL || 'distilbert-base-cased-distilled-squad';
    
    return this.makeRequest(modelName, {
      inputs: {
        question,
        context
      }
    });
  }

  // Time Series Forecasting (if model available)
  async forecastTimeSeries(
    values: number[],
    periods: number = 7,
    model?: string
  ): Promise<HFResponse<{ forecast: number[]; }>> {
    const modelName = model || process.env.HF_TIMESERIES_MODEL;
    
    if (!modelName) {
      throw new Error('Time series model not configured');
    }
    
    return this.makeRequest(modelName, {
      inputs: values,
      parameters: {
        prediction_length: periods
      }
    });
  }

  // Image Classification (for crop disease/pest detection)
  async classifyImage(
    imageBuffer: Buffer | Uint8Array,
    model?: string
  ): Promise<HFResponse<{ label: string; score: number; }[]>> {
    const modelName = model || process.env.HF_IMAGE_DETECT || 'google/vit-base-patch16-224';
    
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/${modelName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'newsai-earth/1.0'
        },
        body: imageBuffer as BodyInit
      });

      if (!response.ok) {
        throw new Error(`HF Image API Error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        data,
        model: modelName,
        processingTime
      };

    } catch (error) {
      throw new Error(`Image classification failed: ${error}`);
    }
  }

  // Health check for all configured models
  async healthCheck(): Promise<{
    status: 'healthy' | 'partial' | 'unhealthy';
    models: Record<string, 'available' | 'loading' | 'error'>;
  }> {
    const models = {
      sentence: process.env.HF_SENTENCE_MODEL,
      classifier: process.env.HF_ZS_CLASSIFIER,
      summarizer: process.env.HF_SUMMARY_MODEL,
      qa: process.env.HF_QA_MODEL,
      timeseries: process.env.HF_TIMESERIES_MODEL,
      image: process.env.HF_IMAGE_DETECT
    };

    const results: Record<string, 'available' | 'loading' | 'error'> = {};
    let healthyCount = 0;

    for (const [key, model] of Object.entries(models)) {
      if (!model) {
        results[key] = 'error';
        continue;
      }

      try {
        // Quick test request
        await this.makeRequest(model, { inputs: "test" });
        results[key] = 'available';
        healthyCount++;
      } catch (error) {
        if (error instanceof Error && error.message.includes('503')) {
          results[key] = 'loading';
        } else {
          results[key] = 'error';
        }
      }
    }

    const totalConfigured = Object.values(models).filter(Boolean).length;
    const status = healthyCount === totalConfigured 
      ? 'healthy' 
      : healthyCount > 0 
        ? 'partial' 
        : 'unhealthy';

    return { status, models: results };
  }
}

// Singleton instance
export const hf = new HuggingFaceInference();

// Utility functions
export const isHFAvailable = () => !!process.env.HUGGINGFACE_API_KEY;

export const getHFModels = () => ({
  sentence: process.env.HF_SENTENCE_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
  classifier: process.env.HF_ZS_CLASSIFIER || 'facebook/bart-large-mnli',
  summarizer: process.env.HF_SUMMARY_MODEL || 'facebook/bart-large-cnn',
  qa: process.env.HF_QA_MODEL || 'distilbert-base-cased-distilled-squad',
  timeseries: process.env.HF_TIMESERIES_MODEL,
  image: process.env.HF_IMAGE_DETECT || 'google/vit-base-patch16-224'
});

export type { 
  HFResponse, 
  SentenceEmbeddingInput, 
  ZeroShotClassificationInput, 
  SummarizationInput,
  QuestionAnsweringInput 
};
