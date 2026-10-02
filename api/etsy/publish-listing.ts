import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { title, description, price, tags, category } = req.body;

  const listingId = Math.floor(Math.random() * 1000000);

  res.status(200).json({
    success: true,
    listing: {
      id: listingId,
      title,
      description,
      price,
      tags,
      category,
      url: `https://www.etsy.com/listing/${listingId}`,
      status: 'active',
      publishedAt: new Date().toISOString()
    }
  });
}
