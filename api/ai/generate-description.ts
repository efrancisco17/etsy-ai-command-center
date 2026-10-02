import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { productName, variation, targetMarket, price, margin } = req.body;

  if (!anthropic) {
    return res.status(200).json({
      description: 'Expertly crafted premium edition with luxury finish and professional quality materials.'
    });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Create a compelling product description for:
Product: ${productName}
Variation: ${variation}
Target Market: ${targetMarket}
Price: $${price}
Margin: ${margin}%

Style: SEO-optimized, persuasive, benefit-focused
Length: 150-250 words
Include: What's included, how to use, who it's for
Tone: Professional, friendly, premium

Return ONLY the description text, no other commentary.`
        }
      ]
    });

    const description = message.content[0].type === 'text' ? message.content[0].text : '';
    res.status(200).json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(200).json({ description: 'Professional product that meets your needs.' });
  }
}
