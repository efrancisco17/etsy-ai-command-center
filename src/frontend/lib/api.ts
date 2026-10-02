const API_BASE = import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:3000');

export interface ProductVariation {
  name: string;
  description: string;
  price: string;
  materials: string;
}

export interface SEOContent {
  seoTitle: string;
  keywords: string[];
  tags: string[];
}

export interface MarketTrend {
  rank: number;
  category: string;
  trend: string;
  search: string;
}

export interface Competitor {
  name: string;
  products: number;
  rating: number;
  sales: string;
}

export interface MarketAnalysis {
  trends: MarketTrend[];
  competitors: Competitor[];
}

export interface ImageGeneration {
  imageUrl: string;
  error?: string;
}

export const apiService = {
  async getDashboardMetrics(): Promise<{ metrics: any }> {
    try {
      const response = await fetch(`${API_BASE}/api/dashboard/metrics`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      return { metrics: { total_revenue: 0, total_orders: 0, conversion_rate: '0', active_listings: 0 } };
    }
  },

  async generateVariations(niche: string): Promise<ProductVariation[]> {
    try {
      const response = await fetch(`${API_BASE}/api/ai/generate-variations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche })
      });
      const data = await response.json();
      return data.variations || [];
    } catch (error) {
      console.error('Failed to generate variations:', error);
      throw new Error('Failed to generate product variations');
    }
  },

  async generateSEOContent(productName: string, description: string): Promise<SEOContent> {
    try {
      const response = await fetch(`${API_BASE}/api/ai/generate-seo-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, description })
      });
      const data = await response.json();
      return {
        seoTitle: data.seoTitle || '',
        keywords: data.keywords || [],
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Failed to generate SEO content:', error);
      throw new Error('Failed to generate SEO content');
    }
  },

  async analyzeMarket(): Promise<MarketAnalysis> {
    try {
      const response = await fetch(`${API_BASE}/api/ai/analyze-market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      return {
        trends: data.trends || [],
        competitors: data.competitors || []
      };
    } catch (error) {
      console.error('Failed to analyze market:', error);
      throw new Error('Failed to analyze market');
    }
  },

  async generateImage(productName: string, description: string, category?: string): Promise<ImageGeneration> {
    try {
      const response = await fetch(`${API_BASE}/api/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, description, category })
      });
      const data = await response.json();
      return {
        imageUrl: data.imageUrl || '',
        error: data.error
      };
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw new Error('Failed to generate image');
    }
  }
};
