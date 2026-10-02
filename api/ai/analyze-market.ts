import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const defaultTrends: any[] = [];
  const defaultCompetitors: any[] = [];

  if (!anthropic) {
    return res.status(200).json({ trends: defaultTrends, competitors: defaultCompetitors });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Generate current Etsy market analysis data for Q4 2026. Return as JSON object:
{
  "trends": [
    {"rank": 1, "category": "...", "trend": "+X%", "search": "XK"},
    ...6 items
  ],
  "competitors": [
    {"name": "...", "products": X, "rating": X.X, "sales": "XK"},
    ...4 items
  ]
}

Trends: Real trending product categories with monthly growth % and monthly searches.
Competitors: Fictional but realistic Etsy shop names with product counts, star ratings, and monthly sales.

Return ONLY valid JSON.`
        }
      ]
    });

    try {
      const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
      const data = JSON.parse(text);
      res.status(200).json({
        trends: data.trends || defaultTrends,
        competitors: data.competitors || defaultCompetitors
      });
    } catch {
      res.status(200).json({ trends: defaultTrends, competitors: defaultCompetitors });
    }
  } catch (error) {
    console.error('Error analyzing market:', error);
    res.status(200).json({ trends: defaultTrends, competitors: defaultCompetitors });
  }
}
