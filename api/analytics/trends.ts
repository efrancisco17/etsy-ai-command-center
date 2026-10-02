import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  res.status(200).json({
    revenue: dates.map((d) => ({ date: d, value: 0 })),
    sales: dates.map((d) => ({ date: d, value: 0 })),
    views: dates.map((d) => ({ date: d, value: 0 }))
  });
}
