import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.status(200).json({
    user: {
      id: 1,
      email: 'demo@etsy.com',
      created_at: new Date().toISOString()
    },
    token: 'demo-token-' + Date.now()
  });
}
