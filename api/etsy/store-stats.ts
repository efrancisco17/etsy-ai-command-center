import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, demoProducts } from '../utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const totalRevenue = demoProducts.reduce((sum, p) => sum + (p.revenue || 0), 0);

  res.status(200).json({
    storeStats: {
      totalRevenue: (totalRevenue || 0).toFixed(2),
      totalOrders: demoProducts.reduce((sum, p) => sum + (p.sales || 0), 0) || 0,
      totalViews: demoProducts.reduce((sum, p) => sum + (p.views || 0), 0) || 0,
      conversionRate: '0%',
      activeListings: demoProducts.length || 0
    },
    recentProducts: demoProducts.slice(0, 3)
  });
}
