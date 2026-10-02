import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { productName, targetMarket } = req.body;

  const defaultKeywords: any[] = [];

  if (!anthropic) {
    return res.status(200).json({ keywords: defaultKeywords });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Generate 8 SEO keywords for Etsy listing:
Product: ${productName}
Target: ${targetMarket}

Return as JSON array:
[
  {"keyword": "...", "volume": "high|medium|low", "competition": "high|medium|low"},
  ...
]

Rank by Etsy search value. Return ONLY valid JSON.`
        }
      ]
    });

    try {
      const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
      const keywords = JSON.parse(text);
      res.status(200).json({ keywords: Array.isArray(keywords) ? keywords : defaultKeywords });
    } catch {
      res.status(200).json({ keywords: defaultKeywords });
    }
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(200).json({ keywords: defaultKeywords });
  }
}
