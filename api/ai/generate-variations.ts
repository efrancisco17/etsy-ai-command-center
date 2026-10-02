import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { niche } = req.body;

  const defaultVariations: any[] = [];

  if (!anthropic) {
    return res.status(200).json({ variations: defaultVariations });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Generate 3 product variations for Etsy in the niche: "${niche}"

For each variation, provide:
- name: Product name (variation type)
- description: 1-2 sentence description highlighting unique features
- price: Price range (e.g., "$25-35")
- materials: Key materials or features

Return as JSON array:
[
  {"name": "...", "description": "...", "price": "...", "materials": "..."},
  ...
]

Make them distinct (premium, standard, budget). Return ONLY valid JSON.`
        }
      ]
    });

    try {
      const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
      const variations = JSON.parse(text);
      res.status(200).json({ variations: Array.isArray(variations) && variations.length > 0 ? variations : defaultVariations });
    } catch {
      res.status(200).json({ variations: defaultVariations });
    }
  } catch (error) {
    console.error('Error generating variations:', error);
    res.status(200).json({ variations: defaultVariations });
  }
}
