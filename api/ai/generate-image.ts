import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, openai } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { productName, description, category } = req.body;

  if (!productName) {
    return res.status(400).json({ imageUrl: '', error: 'productName is required' });
  }

  if (!openai) {
    console.log('OpenAI not configured, skipping image generation');
    return res.status(503).json({ imageUrl: '', error: 'OpenAI API key not configured' });
  }

  try {
    const productCategory = category || 'digital planner';
    const prompt = `Create a professional, minimalist ${productCategory} product cover design. ${productName}. High-quality, printable aesthetic, elegant typography, soft colors, premium look. Digital product cover art, 8.5x11 inches.`;

    // DALL-E 3 has been retired by OpenAI; gpt-image-2 is its successor and returns base64, not a URL
    console.log('Generating cover image for:', productName);
    const image = await openai.images.generate({
      model: 'gpt-image-2',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'medium',
      output_format: 'jpeg',
      output_compression: 85
    });

    const b64 = image.data && image.data[0] ? image.data[0].b64_json : undefined;
    if (!b64) {
      throw new Error('No image returned');
    }
    console.log('Cover image generated successfully');
    res.status(200).json({ imageUrl: `data:image/jpeg;base64,${b64}` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Image generation failed';
    console.error('Image generation error:', errorMessage);
    res.status(502).json({ imageUrl: '', error: errorMessage });
  }
}
