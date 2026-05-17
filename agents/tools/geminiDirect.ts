// Gemini Direct API client - for using multiple Google AI Studio API keys with rotational fallback
// NOTE: This runs in Edge Functions or Trigger.dev, never in browser

import { ChatMessage, ChatOptions, ChatResponse } from './openrouter';

// Define Gemini-specific model types (higher models than those available via OpenRouter)
// Gemini 3.x is the latest generation from Google DeepMind (2025-2026)
export type GeminiModel =
  | 'gemini-3.1-pro-preview'       // Latest flagship (Feb 2026) - best reasoning
  | 'gemini-3-flash'               // GA, fast + frontier quality (Dec 2025)
  | 'gemini-3.1-flash-lite-preview' // Lowest latency 3.x (Mar 2026)
  | 'gemini-3-deep-think'          // Extended reasoning for science/math
  | 'gemini-2.5-pro-preview'       // Previous gen pro
  | 'gemini-2.5-flash-preview'     // Previous gen flash
  | 'gemini-2.0-flash'             // Fallback high-volume model
  | 'gemini-2.0-flash-lite'        // Lowest latency fallback
  | string;                        // Allow any future model name

export interface GeminiChatOptions extends Omit<ChatOptions, 'model'> {
  model?: GeminiModel;
}

export interface GeminiChatResponse extends ChatResponse {}

// Configuration for multiple API keys
export interface GeminiDirectConfig {
  defaultModel?: GeminiModel;
  temperature?: number;
  maxOutputTokens?: number;
}

// Class to manage multiple Gemini API keys with rotation
export class GeminiDirect {
  private apiKeys: string[];
  private currentKeyIndex: number;
  private defaultModel: GeminiModel;
  private temperature: number;
  private maxOutputTokens: number;

  constructor(config: GeminiDirectConfig = {}) {
    this.apiKeys = [];
    this.collectKeys();
    this.currentKeyIndex = 0;
    this.defaultModel = config.defaultModel ?? 'gemini-3.1-pro-preview';
    this.temperature = config.temperature ?? 0.7;
    this.maxOutputTokens = config.maxOutputTokens ?? 4096;
  }

  private collectKeys() {
    const defaultKey = process.env.GEMINI_API_KEY;
    if (defaultKey) {
      this.apiKeys.push(defaultKey);
    }

    let i = 1;
    while (true) {
      const key = process.env[`GEMINI_API_KEY_${i}`];
      if (!key) break;
      if (!this.apiKeys.includes(key)) {
        this.apiKeys.push(key);
      }
      i++;
    }
  }

  get keyCount() {
    return this.apiKeys.length;
  }

  private getCurrentKey(): string {
    return this.apiKeys[this.currentKeyIndex];
  }

  private rotateKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
  }

  async generateContent(
    prompt: string | ChatMessage[],
    options: GeminiChatOptions = {}
  ): Promise<string> {
    if (this.apiKeys.length === 0) {
      throw new Error('No GEMINI_API_KEY_N environment variables configured');
    }

    const model = options.model ?? this.defaultModel;
    const temperature = options.temperature ?? this.temperature;
    const maxOutputTokens = options.maxOutputTokens ?? this.maxOutputTokens;

    // Build the request body in accordance with Gemini API specifications
    let requestBody: any;

    if (Array.isArray(prompt)) {
      const systemMsg = prompt.find(msg => msg.role === 'system');
      const chatMsgs = prompt.filter(msg => msg.role !== 'system');
      
      const contents = chatMsgs.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      requestBody = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens,
        }
      };

      if (systemMsg) {
        requestBody.systemInstruction = {
          parts: [{ text: systemMsg.content }]
        };
      }
    } else {
      requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens,
        }
      };
    }

    let retries = this.apiKeys.length;
    while (retries > 0) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.getCurrentKey()}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          if (response.status === 429 || response.status === 403) {
            console.warn(`[GeminiDirect] Key ${this.currentKeyIndex + 1} failed (${response.status}), rotating...`);
            this.rotateKey();
            retries--;
            continue;
          }
          const errorText = await response.text();
          throw new Error(`Gemini API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0) {
          return data.candidates[0].content.parts[0].text;
        }
        
        throw new Error('Invalid response format from Gemini API');
      } catch (error) {
        if (error.message.includes('429') || error.message.includes('403') || 
            error.message.includes('API key') || error.message.includes('quota')) {
          this.rotateKey();
          retries--;
          continue;
        }
        throw error;
      }
    }
    
    throw new Error(`All ${this.apiKeys.length} Gemini API keys exhausted`);
  }

  // Reset rotation to start from the first key
  resetRotation() {
    this.currentKeyIndex = 0;
  }
}

// Lazy singleton - only created when first used
let _geminiDirectInstance: GeminiDirect | null = null;

export function getGeminiDirectInstance(): GeminiDirect {
  if (!_geminiDirectInstance) {
    _geminiDirectInstance = new GeminiDirect();
  }
  return _geminiDirectInstance;
}

export async function generateGeminiContent(
  prompt: string | ChatMessage[],
  options: GeminiChatOptions = {}
): Promise<string> {
  return getGeminiDirectInstance().generateContent(prompt, options);
}