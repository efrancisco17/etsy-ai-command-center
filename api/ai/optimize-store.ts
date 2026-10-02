import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { products } = req.body;

  const defaultRecommendations: any[] = [];

  if (!anthropic) {
    return res.status(200).json({ recommendations: defaultRecommendations });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Analyze these Etsy products and suggest optimizations:
${JSON.stringify(products, null, 2)}

Provide specific recommendations for improving conversion rate, sales, and revenue.
Return as JSON: { "recommendations": [{ "productId": X, "suggestions": [...] }] }
Each suggestion: { "action": "...", "priority": "high|medium|low", "impact": "+X%" }

Return ONLY valid JSON.`
        }
      ]
    });

    try {
      const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch {
      res.status(200).json({ recommendations: defaultRecommendations });
    }
  } catch (error) {
    console.error('Error optimizing store:', error);
    res.status(200).json({ recommendations: defaultRecommendations });
  }
}
