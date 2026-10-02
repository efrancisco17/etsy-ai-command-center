import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, anthropic } from '../utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { productName, description } = req.body;

  const defaultContent = {
    seoTitle: '',
    keywords: [],
    tags: []
  };

  if (!anthropic) {
    return res.status(200).json(defaultContent);
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Generate SEO content for Etsy listing:
Product: ${productName}
Description: ${description}

Generate:
1. SEO Title (max 140 characters) - Include product name, benefit, and format
2. 8 Keywords (ranked by Etsy search value)
3. 12 Tags (max 20 chars each)

Return as JSON:
{
  "seoTitle": "...",
  "keywords": ["keyword1", "keyword2", ...],
  "tags": ["tag1", "tag2", ...]
}

Return ONLY valid JSON.`
        }
      ]
    });

    try {
      const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
      const content = JSON.parse(text);
      res.status(200).json({
        seoTitle: content.seoTitle || defaultContent.seoTitle,
        keywords: Array.isArray(content.keywords) ? content.keywords.slice(0, 8) : defaultContent.keywords,
        tags: Array.isArray(content.tags) ? content.tags.slice(0, 12) : defaultContent.tags
      });
    } catch {
      res.status(200).json(defaultContent);
    }
  } catch (error) {
    console.error('Error generating SEO content:', error);
    res.status(200).json(defaultContent);
  }
}
