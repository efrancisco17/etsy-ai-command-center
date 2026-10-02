import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Initialize Claude client (if API key exists)
export const anthropic = process.env.CLAUDE_API_KEY
  ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
  : null;

// Initialize OpenAI client (if API key exists)
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// CORS headers for all responses
export const setCorsHeaders = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
};

// Handle OPTIONS requests
export const handleOptions = (req: any, res: any) => {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(200).end();
    return true;
  }
  return false;
};

// In-memory demo products (note: this will reset on each deployment)
// For production, use a database instead
export let demoProducts: any[] = [];
