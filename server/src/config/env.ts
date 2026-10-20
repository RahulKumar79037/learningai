import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

function cleanEnvString(val: string | undefined): string {
  if (!val) return '';
  let str = val.trim();
  while (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

function cleanExpiresIn(val: string | undefined): string {
  let str = cleanEnvString(val);
  if (!str) return '7d';
  // If user pasted "JWT_EXPIRES_IN=30d" or similar key=val in the secret box
  if (str.includes('=')) {
    str = str.split('=').pop()!.trim();
  }
  while (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  // Validate timespan format (e.g. 30d, 7d, 24h, 3600s, 60m)
  if (/^\d+[smhdwMy]?$/i.test(str)) {
    return str;
  }
  return '7d';
}

function cleanGeminiModel(val: string | undefined): string {
  let str = cleanEnvString(val);
  if (!str) return 'gemini-3.1-flash-lite';
  if (str.startsWith('models/')) {
    str = str.replace(/^models\//, '').trim();
  }
  // Sanitize deprecated models: gemini-2.5-flash, gemini-2.0-*, gemini-1.5-*, etc.
  if (
    str.includes('2.5') ||
    str.includes('2.0') ||
    str.includes('1.5') ||
    str === 'gemini-pro' ||
    str === 'gemini-flash'
  ) {
    return 'gemini-3.1-flash-lite';
  }
  return str;
}

function cleanGeminiEmbeddingModel(val: string | undefined): string {
  let str = cleanEnvString(val);
  if (!str) return 'text-embedding-004';
  if (str.startsWith('models/')) {
    str = str.replace(/^models\//, '').trim();
  }
  return str;
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  SERVER_URL: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().optional().default(''),
  JWT_SECRET: z.string().default('learning_companion_jwt_secret_academic_2026_super_key'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.1-flash-lite'),
  GEMINI_EMBEDDING_MODEL: z.string().default('text-embedding-004'),
  MAX_FILE_SIZE: z.coerce.number().default(15728640), // 15MB
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

const rawClientUrl = cleanEnvString(process.env.CLIENT_URL);
const rawServerUrl = cleanEnvString(process.env.SERVER_URL);
const rawMongoUri = cleanEnvString(process.env.MONGODB_URI);
const rawJwtSecret = cleanEnvString(process.env.JWT_SECRET);
const rawGeminiKey = cleanEnvString(process.env.GEMINI_API_KEY);

export const env = envSchema.parse({
  NODE_ENV: cleanEnvString(process.env.NODE_ENV) || 'development',
  PORT: 3000,
  CLIENT_URL: rawClientUrl || 'http://localhost:3000',
  SERVER_URL: rawServerUrl || 'http://localhost:3000',
  MONGODB_URI: rawMongoUri || '',
  JWT_SECRET: rawJwtSecret || 'learning_companion_jwt_secret_academic_2026_super_key',
  JWT_EXPIRES_IN: cleanExpiresIn(process.env.JWT_EXPIRES_IN),
  GEMINI_API_KEY: rawGeminiKey || '',
  GEMINI_MODEL: cleanGeminiModel(process.env.GEMINI_MODEL),
  GEMINI_EMBEDDING_MODEL: cleanGeminiEmbeddingModel(process.env.GEMINI_EMBEDDING_MODEL),
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 15728640,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
});
