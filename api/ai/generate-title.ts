import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { productName, variation, targetMarket, keywords } = req.body;

  if (!anthropic) {
    return res.status(200).json({
      title: `${productName} - ${variation} Edition | Digital Printable Template`
    });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Create an SEO-optimized Etsy product title (max 140 chars):
Product: ${productName}
Variation: ${variation}
Target: ${targetMarket}
Keywords: ${keywords.join(', ')}

Requirements:
- Include product name
- Include main benefit
- Include format
- Include search keywords naturally
- Stay under 140 characters
- Maximize SEO value

Return ONLY the title, no other text.`
        }
      ]
    });

    const title = message.content[0].type === 'text' ? message.content[0].text : '';
    res.status(200).json({ title: title.substring(0, 140) });
  } catch (error) {
    console.error('Error generating title:', error);
    res.status(200).json({ title: `${productName} - ${variation} | Digital Printable Template` });
  }
}
