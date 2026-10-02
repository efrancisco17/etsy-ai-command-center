import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, demoProducts } from '../utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const productsWithAnalytics = demoProducts.map(p => ({
    ...p,
    conversionRate: p.views > 0 ? ((p.sales / p.views) * 100).toFixed(2) : '0',
    revenuePerView: p.views > 0 ? (p.revenue / p.views).toFixed(2) : '0',
    profitPerSale: ((p.price || 0) - (p.cost || 0)).toFixed(2),
    daysActive: Math.floor(Math.random() * 90) + 7
  }));

  res.status(200).json({ products: productsWithAnalytics || [] });
}
