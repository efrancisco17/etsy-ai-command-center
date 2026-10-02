import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, demoProducts } from '../utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const totalRevenue = demoProducts.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalSales = demoProducts.reduce((sum, p) => sum + (p.sales || 0), 0);
  const totalViews = demoProducts.reduce((sum, p) => sum + (p.views || 0), 0);

  res.status(200).json({
    metrics: {
      total_revenue: totalRevenue || 0,
      total_orders: totalSales || 0,
      total_views: totalViews || 0,
      conversion_rate: (totalSales && totalViews) ? ((totalSales / totalViews) * 100).toFixed(2) : '0',
      active_listings: demoProducts.length || 0,
      average_price: (totalRevenue && totalSales) ? (totalRevenue / totalSales).toFixed(2) : '0',
      products_created_ai: demoProducts.length || 0
    }
  });
}
