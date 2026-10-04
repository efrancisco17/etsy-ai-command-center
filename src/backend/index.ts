const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { default: Anthropic } = require('@anthropic-ai/sdk');
const { default: OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
const corsOptions = {
  origin: ['https://etsy-ai-command-center-omega.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Initialize Claude client (if API key exists)
const anthropic = process.env.CLAUDE_API_KEY
  ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
  : null;

// Initialize OpenAI client (if API key exists)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// No demo data—start with empty state
const demoProducts: any[] = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Demo login
app.post('/api/auth/demo-login', (req, res) => {
  res.json({
    user: { id: 1, email: 'demo@etsy.com', created_at: new Date().toISOString() },
    token: 'demo-token-' + Date.now()
  });
});

// Dashboard metrics
app.get('/api/dashboard/metrics', (req, res) => {
  const totalRevenue = demoProducts.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = demoProducts.reduce((sum, p) => sum + p.sales, 0);
  const totalViews = demoProducts.reduce((sum, p) => sum + p.views, 0);

  res.json({
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
});

// Claude API: Generate product description
app.post('/api/ai/generate-description', async (req, res) => {
  const { productName, variation, targetMarket, price, margin } = req.body;

  if (!anthropic) {
    return res.json({
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
    res.json({ description });
  } catch (error) {
    res.json({ description: 'Professional product that meets your needs.' });
  }
});

// Claude API: Generate SEO title
app.post('/api/ai/generate-title', async (req, res) => {
  const { productName, variation, targetMarket, keywords } = req.body;

  if (!anthropic) {
    return res.json({
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
    res.json({ title: title.substring(0, 140) });
  } catch (error) {
    res.json({ title: `${productName} - ${variation} | Digital Printable Template` });
  }
});

// Claude API: Generate keywords
app.post('/api/ai/generate-keywords', async (req, res) => {
  const { productName, targetMarket } = req.body;

  const defaultKeywords: any[] = [];

  if (!anthropic) {
    return res.json({ keywords: defaultKeywords });
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
      res.json({ keywords: Array.isArray(keywords) ? keywords : defaultKeywords });
    } catch {
      res.json({ keywords: defaultKeywords });
    }
  } catch (error) {
    res.json({ keywords: defaultKeywords });
  }
});

// Claude API: Generate optimization recommendations
app.post('/api/ai/optimize-store', async (req, res) => {
  const { products } = req.body;

  const defaultRecommendations: any[] = [];

  if (!anthropic) {
    return res.json({ recommendations: defaultRecommendations });
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
      res.json(data);
    } catch {
      res.json({ recommendations: defaultRecommendations });
    }
  } catch (error) {
    res.json({ recommendations: defaultRecommendations });
  }
});

// Etsy API: Get store stats
app.get('/api/etsy/store-stats', (req, res) => {
  const totalRevenue = demoProducts.reduce((sum, p) => sum + p.revenue, 0);

  res.json({
    storeStats: {
      totalRevenue: (totalRevenue || 0).toFixed(2),
      totalOrders: demoProducts.reduce((sum, p) => sum + p.sales, 0) || 0,
      totalViews: demoProducts.reduce((sum, p) => sum + p.views, 0) || 0,
      conversionRate: '0%',
      activeListings: demoProducts.length || 0
    },
    recentProducts: demoProducts.slice(0, 3)
  });
});

// Etsy API: Publish listing
app.post('/api/etsy/publish-listing', async (req, res) => {
  const { title, description, price, tags, category } = req.body;

  const listingId = Math.floor(Math.random() * 1000000);

  res.json({
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
});

// Analytics: Get product analytics
app.get('/api/analytics/products', (req, res) => {
  const productsWithAnalytics = demoProducts.map(p => ({
    ...p,
    conversionRate: ((p.sales / p.views) * 100).toFixed(2),
    revenuePerView: (p.revenue / p.views).toFixed(2),
    profitPerSale: (p.price - p.cost).toFixed(2),
    daysActive: Math.floor(Math.random() * 90) + 7
  }));

  res.json({ products: productsWithAnalytics || [] });
});

// Analytics: Get trends
app.get('/api/analytics/trends', (req, res) => {
  const dates: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  res.json({
    revenue: dates.map((d, i) => ({ date: d, value: 0 })),
    sales: dates.map((d, i) => ({ date: d, value: 0 })),
    views: dates.map((d, i) => ({ date: d, value: 0 }))
  });
});

// Market opportunities (from Phase 1)
app.get('/api/phase1/opportunities', (req, res) => {
  res.json({
    opportunities: []
  });
});

// Claude API: Analyze market trends
app.post('/api/ai/analyze-market', async (req, res) => {
  const defaultTrends: any[] = [];
  const defaultCompetitors: any[] = [];

  if (!anthropic) {
    return res.json({ trends: defaultTrends, competitors: defaultCompetitors });
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
      res.json({
        trends: data.trends || defaultTrends,
        competitors: data.competitors || defaultCompetitors
      });
    } catch {
      res.json({ trends: defaultTrends, competitors: defaultCompetitors });
    }
  } catch (error) {
    res.json({ trends: defaultTrends, competitors: defaultCompetitors });
  }
});

// Claude API: Generate product variations
app.post('/api/ai/generate-variations', async (req, res) => {
  const { niche } = req.body;

  // No default variations; Claude should provide them or return empty
  const defaultVariations: any[] = [];

  if (!anthropic) {
    return res.json({ variations: defaultVariations });
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
      res.json({ variations: Array.isArray(variations) && variations.length > 0 ? variations : defaultVariations });
    } catch {
      res.json({ variations: defaultVariations });
    }
  } catch (error) {
    res.json({ variations: defaultVariations });
  }
});

// Claude API: Generate SEO content (title, keywords, tags)
app.post('/api/ai/generate-seo-content', async (req, res) => {
  const { productName, description } = req.body;

  // No default content; Claude should provide it or return empty
  const defaultContent = {
    seoTitle: '',
    keywords: [],
    tags: []
  };

  if (!anthropic) {
    return res.json(defaultContent);
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
      res.json({
        seoTitle: content.seoTitle || defaultContent.seoTitle,
        keywords: Array.isArray(content.keywords) ? content.keywords.slice(0, 8) : defaultContent.keywords,
        tags: Array.isArray(content.tags) ? content.tags.slice(0, 12) : defaultContent.tags
      });
    } catch {
      res.json(defaultContent);
    }
  } catch (error) {
    res.json(defaultContent);
  }
});

// OPTIONS handler for image generation endpoint
app.options('/api/ai/generate-image', cors(corsOptions));

// DALL-E API: Generate product image
app.post('/api/ai/generate-image', async (req, res) => {
  const { productName, description, category } = req.body;

  // Set explicit CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    res.json({ imageUrl: `data:image/jpeg;base64,${b64}` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Image generation failed';
    console.error('DALL-E error:', errorMessage);
    res.status(502).json({ imageUrl: '', error: errorMessage });
  }
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Claude API: ${anthropic ? 'Connected ✓' : 'Not configured'}`);
  console.log(`✓ OpenAI (DALL-E): ${openai ? 'Connected ✓' : 'Not configured'}`);
});
