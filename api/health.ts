import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
