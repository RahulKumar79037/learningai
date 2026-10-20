import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment or Settings > Secrets panel.');
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return aiInstance;
}

export function isGeminiAvailable(): boolean {
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}
