import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import { FiBarChart2, FiPackage, FiEdit3, FiTrendingUp, FiSettings, FiHome } from 'react-icons/fi';
import { productService, Product } from './lib/supabase';
import { apiService, ProductVariation, SEOContent } from './lib/api';

// Products don't carry a category yet, so DALL-E covers use this one
const DEFAULT_PRODUCT_CATEGORY = 'digital planner';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

const getIcon = (id: string, color: string) => {
  const iconProps = { size: 28, color, style: { transition: 'all 0.3s ease' } };
  switch (id) {
    case 'phase1':
      return <FiBarChart2 {...iconProps} />;
    case 'phase2':
      return <FiPackage {...iconProps} />;
    case 'phase3':
      return <FiEdit3 {...iconProps} />;
    case 'phase4':
      return <FiTrendingUp {...iconProps} />;
    case 'phase5':
      return <FiSettings {...iconProps} />;
    default:
      return <FiHome {...iconProps} />;
  }
};

function AnimatedSidebar({ currentPage, setPage }: SidebarProps) {

  const phases = [
    { id: 'dashboard', label: 'Dashboard', color: '#10B981' },
    { id: 'phase1', label: 'Phase 1: Analysis', color: '#3B82F6' },
    { id: 'phase2', label: 'Phase 2: Creator', color: '#10B981' },
    { id: 'phase3', label: 'Phase 3: Manager', color: '#F59E0B' },
    { id: 'phase4', label: 'Phase 4: Analytics', color: '#EC4899' },
    { id: 'phase5', label: 'Phase 5: Optimizer', color: '#8B5CF6' },
  ];

  return (
    <div className="sidebar" style={{ width: '90px', background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', borderRight: '0.5px solid #334155', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
      <div className="logo" onClick={() => setPage('dashboard')} style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px', cursor: 'pointer', border: '2px solid #34D399', boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)' }}>E</div>
      <div style={{ width: '32px', height: '0.5px', background: '#334155' }} />
      {phases.map((phase) => (
        <button key={phase.id} onClick={() => setPage(phase.id)} className={currentPage === phase.id ? 'active-icon' : ''} style={{ width: '56px', height: '56px', border: currentPage === phase.id ? `2px solid ${phase.color}` : '1px solid rgba(59, 130, 246, 0.3)', background: currentPage === phase.id ? `linear-gradient(135deg, ${phase.color} 0%, ${phase.color}cc 100%)` : 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', margin: '0 auto', padding: 0 }} onMouseEnter={(e) => { if (currentPage !== phase.id) { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'; e.currentTarget.style.transform = 'scale(1.1)'; } }} onMouseLeave={(e) => { if (currentPage !== phase.id) { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; } }} title={phase.label}>{getIcon(phase.id, currentPage === phase.id ? 'white' : phase.color)}</button>
      ))}
      <div style={{ width: '32px', height: '0.5px', background: '#334155', marginTop: 'auto' }} />
      <button onClick={() => setPage('dashboard')} style={{ width: '48px', height: '48px', border: currentPage === 'dashboard' ? '2px solid #34D399' : '1px solid rgba(16, 185, 129, 0.3)', background: currentPage === 'dashboard' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }}><FiHome size={24} color={currentPage === 'dashboard' ? 'white' : '#10B981'} /></button>
    </div>
  );
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="card" style={{ background: '#1E293B', border: `0.5px solid ${color}40`, borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 10px 25px ${color}30`; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: '600', color }}>{value}</div>
    </div>
  );
}

function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const [metrics, setMetrics] = useState({ total_revenue: 0, total_orders: 0, conversion_rate: '0', active_listings: 0 });

  useEffect(() => {
    apiService.getDashboardMetrics?.()
      .then((data: any) => setMetrics(data.metrics || metrics))
      .catch(() => {});
  }, []);

  return (
    <div className="page-load" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '1rem', color: '#F1F5F9' }}>Welcome to Etsy Command Center</h1>
      <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '2rem' }}>Build, launch, and optimize your Etsy products with AI</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
        <Card title="Total Products" value={String(metrics.active_listings)} color="#3B82F6" />
        <Card title="Total Revenue" value={`$${(metrics.total_revenue / 1000).toFixed(1)}K`} color="#10B981" />
        <Card title="Conversion Rate" value={`${metrics.conversion_rate}%`} color="#F59E0B" />
        <Card title="Total Views" value={`${(metrics.total_orders || 0)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} color="#EC4899" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {[
          { id: 'phase1', label: 'Phase 1: Market Analysis', color: '#3B82F6' },
          { id: 'phase2', label: 'Phase 2: Product Creator', color: '#10B981' },
          { id: 'phase3', label: 'Phase 3: Listing Manager', color: '#F59E0B' },
          { id: 'phase4', label: 'Phase 4: Analytics', color: '#EC4899' },
          { id: 'phase5', label: 'Phase 5: Store Optimizer', color: '#8B5CF6' }
        ].map((btn) => (
          <button key={btn.id} onClick={() => setPage(btn.id)} className="btn-hover" style={{ padding: '1rem', background: `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}cc 100%)`, border: 'none', borderRadius: '8px', color: 'white', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span style={{ display: 'flex', alignItems: 'center' }}>{getIcon(btn.id, 'white')}</span> {btn.label}</button>
        ))}
      </div>
    </div>
  );
}

function Phase1Analysis() {
  const [trends, setTrends] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    // Load initial empty state from API on mount
    apiService.analyzeMarket().then((data) => {
      setTrends(data.trends || []);
      setCompetitors(data.competitors || []);
    }).catch(() => {});
  }, []);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setMessage('');
    try {
      const analysis = await apiService.analyzeMarket();
      setTrends(analysis.trends);
      setCompetitors(analysis.competitors);
      setAnalyzed(true);
      setMessage('✅ Market analysis complete! Updated with real-time data.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to analyze market'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message && (
        <div style={{
          background: message.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: message.includes('✅') ? '#10B981' : '#EF4444',
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${message.includes('✅') ? '#10B981' : '#EF4444'}`
        }}>
          {message}
        </div>
      )}

      <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ color: '#3B82F6', marginBottom: '1rem', fontSize: '18px' }}>📈 Trending Categories {analyzed && '✨'}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid #334155' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Rank</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Trend</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Monthly Searches</th>
          </tr></thead>
          <tbody>{trends.map((t) => <tr key={t.rank} style={{ borderBottom: '1px solid #1E293B' }}>
            <td style={{ padding: '0.75rem', color: '#F1F5F9' }}>{t.rank}</td>
            <td style={{ padding: '0.75rem', color: '#F1F5F9' }}>{t.category}</td>
            <td style={{ padding: '0.75rem', color: '#10B981', fontWeight: '600' }}>{t.trend}</td>
            <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{t.search}</td>
          </tr>)}</tbody>
        </table>
      </div>

      <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ color: '#3B82F6', marginBottom: '1rem', fontSize: '18px' }}>🏪 Competitor Analysis {analyzed && '✨'}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid #334155' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Shop</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Products</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Rating</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Sales</th>
          </tr></thead>
          <tbody>{competitors.map((c) => <tr key={c.name} style={{ borderBottom: '1px solid #1E293B' }}>
            <td style={{ padding: '0.75rem', color: '#F1F5F9' }}>{c.name}</td>
            <td style={{ padding: '0.75rem', color: '#F1F5F9' }}>{c.products}</td>
            <td style={{ padding: '0.75rem', color: '#F59E0B', fontWeight: '600' }}>{c.rating}⭐</td>
            <td style={{ padding: '0.75rem', color: '#10B981' }}>{c.sales}</td>
          </tr>)}</tbody>
        </table>
      </div>

      <button
        onClick={handleRunAnalysis}
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          background: loading ? '#999' : '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          fontSize: '16px'
        }}
      >
        {loading ? '⏳ Analyzing market...' : '🔍 Run Deep Analysis'}
      </button>
    </div>
  );
}

function Phase2Creator({ onProductCreate }: { onProductCreate?: (product: Product, imageUrl?: string) => void }) {
  const [niche, setNiche] = useState('');
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleGenerateVariations = async () => {
    if (!niche.trim()) {
      setMessage('Please enter a product niche');
      return;
    }

    setLoading(true);
    setMessage('');
    let generated: ProductVariation[] = [];
    try {
      generated = await apiService.generateVariations(niche);
      setVariations(generated);
      setImages([]);
      setImageErrors([]);
      setSelectedIndex(null);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to generate variations'}`);
      return;
    } finally {
      setLoading(false);
    }

    // Generate all cover images in parallel; each card fills in as its image arrives
    setGeneratingImages(true);
    await Promise.all(generated.map(async (variation, index) => {
      let imageUrl = '';
      let imageError = '';
      try {
        const result = await apiService.generateImage(variation.name, variation.description, DEFAULT_PRODUCT_CATEGORY);
        imageUrl = result.imageUrl;
        imageError = result.imageUrl ? '' : (result.error || 'Image generation failed');
      } catch (error) {
        imageError = error instanceof Error ? error.message : 'Image generation failed';
      }
      setImages(prev => { const next = [...prev]; next[index] = imageUrl; return next; });
      setImageErrors(prev => { const next = [...prev]; next[index] = imageError; return next; });
    }));
    setGeneratingImages(false);
  };

  const handleSelectVariation = (index: number) => {
    setSelectedIndex(index);
  };

  const handleProceed = () => {
    if (selectedIndex === null) {
      setMessage('Please select a variation');
      return;
    }

    const selected = variations[selectedIndex];
    const imageUrl = images[selectedIndex] || '';
    onProductCreate?.({
      name: selected.name,
      description: selected.description,
      keywords: [],
      tags: [],
      price: selected.price
    }, imageUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message && (
        <div style={{
          background: message.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          color: message.includes('Error') ? '#EF4444' : '#10B981',
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${message.includes('Error') ? '#EF4444' : '#10B981'}`
        }}>
          {message}
        </div>
      )}

      <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ color: '#10B981', marginBottom: '1rem', fontSize: '18px' }}>🤖 Product Niche</h3>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '1rem' }}>Tell Claude what product niche you want to explore (e.g., "eco-friendly desk organizers", "personalized pet portraits")</p>
        <textarea
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g., Personalized wooden desk organizers for remote workers..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            background: '#0F172A',
            color: '#F1F5F9',
            border: '1px solid #334155',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}
        />
        <button
          onClick={handleGenerateVariations}
          disabled={loading || generatingImages}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: (loading || generatingImages) ? '#999' : '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: (loading || generatingImages) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Generating variations...' : generatingImages ? '🎨 Generating images...' : '✨ Generate Variations'}
        </button>
      </div>

      {variations.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {variations.map((v, index) => (
              <div
                key={index}
                onClick={() => handleSelectVariation(index)}
                style={{
                  background: '#1E293B',
                  border: selectedIndex === index ? '2px solid #10B981' : '1px solid #334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedIndex === index ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
                  overflow: 'hidden'
                }}
              >
                {images[index] ? (
                  <img
                    src={images[index]}
                    alt={v.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      marginBottom: '1rem'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : imageErrors[index] ? (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '1rem',
                    marginBottom: '1rem',
                    color: '#EF4444',
                    fontSize: '13px'
                  }}>
                    ⚠️ Couldn't generate cover: {imageErrors[index]}
                  </div>
                ) : generatingImages ? (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#0F172A',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    color: '#94A3B8'
                  }}>
                    <div className="animate-spin" style={{
                      width: '36px',
                      height: '36px',
                      border: '3px solid #334155',
                      borderTopColor: '#10B981',
                      borderRadius: '50%'
                    }} />
                    Generating cover...
                  </div>
                ) : null}
                <div style={{ padding: '1.5rem', paddingTop: images[index] ? '0.5rem' : '1.5rem' }}>
                  <p style={{ color: '#10B981', fontWeight: '600', marginBottom: '0.5rem' }}>{v.name}</p>
                  <p style={{ color: '#F1F5F9', fontSize: '14px', marginBottom: '1rem', minHeight: '50px' }}>{v.description}</p>
                  <p style={{ color: '#3B82F6', fontSize: '18px', fontWeight: '700', marginBottom: '0.5rem' }}>{v.price}</p>
                  <p style={{ color: '#94A3B8', fontSize: '12px' }}>📦 {v.materials}</p>
                  <button
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.5rem',
                      background: selectedIndex === index ? '#10B981' : '#334155',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {selectedIndex === index ? '✓ Selected' : 'Select Variation'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleProceed}
            style={{
              padding: '0.75rem',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            → Proceed to Listing
          </button>
        </>
      )}
    </div>
  );
}

function Phase3ListingManager({ productName, productDescription, productImage }: { productName?: string; productDescription?: string; productImage?: string }) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState(productDescription || '');
  const [seoTitle, setSeoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [seoGenerated, setSeoGenerated] = useState(false);

  const handleGenerateSEO = async () => {
    if (!productName || !description) {
      setMessage('Product name and description are required');
      return;
    }

    setGenerating(true);
    setMessage('');
    try {
      const content = await apiService.generateSEOContent(productName, description);
      setSeoTitle(content.seoTitle);
      setKeywords(content.keywords);
      setTags(content.tags);
      setSeoGenerated(true);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to generate SEO content'}`);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!productName || !seoTitle) {
      setMessage('Please generate SEO content first');
      return;
    }

    setLoading(true);
    try {
      const product: Product = {
        name: productName,
        description: description || productDescription || '',
        keywords,
        tags,
        price: '$25-60'
      };

      await productService.saveProduct(product);
      setMessage('✅ Product published to Etsy successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Failed to publish'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message && (
        <div style={{
          background: message.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: message.includes('✅') ? '#10B981' : '#EF4444',
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${message.includes('✅') ? '#10B981' : '#EF4444'}`
        }}>
          {message}
        </div>
      )}

      <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
        {productImage && (
          <img
            src={productImage}
            alt={productName}
            style={{
              width: '100%',
              height: '360px',
              objectFit: 'contain',
              background: '#0F172A',
              display: 'block'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#10B981', marginBottom: '1rem', fontSize: '18px' }}>📦 Selected Product</h3>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '0.5rem' }}>Product Name</p>
            <p style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600' }}>{productName || 'No product selected'}</p>
          </div>
          <div>
            <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '0.5rem' }}>Description</p>
            <p style={{ color: '#F1F5F9', fontSize: '14px' }}>{description || 'No description available'}</p>
          </div>
        </div>
      </div>

      {!seoGenerated ? (
        <button
          onClick={handleGenerateSEO}
          disabled={generating}
          style={{
            padding: '0.75rem',
            background: generating ? '#999' : '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: generating ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {generating ? '⏳ Generating SEO content...' : '✨ Generate SEO & Keywords'}
        </button>
      ) : (
        <>
          <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#F59E0B', marginBottom: '1rem', fontSize: '18px' }}>📋 SEO Title</h3>
            <textarea
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0F172A',
                color: '#F1F5F9',
                border: '1px solid #334155',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                minHeight: '60px'
              }}
            />
            <p style={{ color: '#94A3B8', fontSize: '12px' }}>{seoTitle.length}/140 characters</p>
          </div>

          <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#F59E0B', marginBottom: '1rem', fontSize: '18px' }}>🔍 Keywords</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {keywords.map((k) => (
                <span key={k} style={{ background: '#0F172A', color: '#F59E0B', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {k} <span onClick={() => setKeywords(keywords.filter(x => x !== k))} style={{ cursor: 'pointer' }}>×</span>
                </span>
              ))}
            </div>
            <p style={{ color: '#94A3B8', fontSize: '12px' }}>{keywords.length}/8 keywords</p>
          </div>

          <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#F59E0B', marginBottom: '1rem', fontSize: '18px' }}>🏷️ Tags</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {tags.map((t) => (
                <span key={t} style={{ background: '#0F172A', color: '#EC4899', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {t} <span onClick={() => setTags(tags.filter(x => x !== t))} style={{ cursor: 'pointer' }}>×</span>
                </span>
              ))}
            </div>
            <p style={{ color: '#94A3B8', fontSize: '12px' }}>{tags.length}/12 tags</p>
          </div>

          <button
            onClick={handlePublish}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? '#999' : '#F59E0B',
              color: '#0F172A',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              fontSize: '16px'
            }}
          >
            {loading ? '⏳ Publishing...' : '📤 Publish to Etsy'}
          </button>
        </>
      )}
    </div>
  );
}

function Phase4Analytics() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const mockProducts = [
    { name: 'Custom Family Sign', sales: 0, revenue: '$0' },
    { name: 'Personalized Mug', sales: 0, revenue: '$0' },
    { name: 'Pet Portrait Print', sales: 0, revenue: '$0' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card title="Total Revenue" value="$0" color="#10B981" />
        <Card title="Total Views" value="0" color="#3B82F6" />
        <Card title="Conversion Rate" value="0%" color="#F59E0B" />
      </div>

      <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#EC4899', fontSize: '18px' }}>📊 Your Products from Supabase</h3>
          <select style={{ padding: '0.5rem', background: '#0F172A', color: '#F1F5F9', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px' }}>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>Loading products...</p>
        ) : products.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Product Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Keywords</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8' }}>Created</th>
            </tr></thead>
            <tbody>{products.map((p) => <tr key={p.id} style={{ borderBottom: '1px solid #1E293B' }}>
              <td style={{ padding: '0.75rem', color: '#F1F5F9' }}>{p.name}</td>
              <td style={{ padding: '0.75rem', color: '#10B981', fontWeight: '600' }}>{p.keywords.join(', ') || 'N/A'}</td>
              <td style={{ padding: '0.75rem', color: '#94A3B8', fontSize: '12px' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today'}</td>
            </tr>)}</tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
            <p>No products yet. Create one in Phase 2 and publish in Phase 3! 🚀</p>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0F172A', borderRadius: '8px', borderLeft: '3px solid #3B82F6' }}>
          <p style={{ color: '#3B82F6', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>📊 Mock Top Products</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>{mockProducts.map((p) => <tr key={p.name} style={{ borderBottom: '1px solid #1E293B' }}>
              <td style={{ padding: '0.5rem', color: '#F1F5F9' }}>{p.name}</td>
              <td style={{ padding: '0.5rem', color: '#10B981', fontWeight: '600', textAlign: 'right' }}>{p.sales} sales</td>
              <td style={{ padding: '0.5rem', color: '#3B82F6', fontWeight: '600', textAlign: 'right' }}>{p.revenue}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Phase5Optimizer() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const recommendations = [
    {
      title: 'Add Video to Listings',
      impact: '+12%',
      description: 'Products with videos convert better',
      steps: [
        '1. Film a 15-30 second product video',
        '2. Upload video to a hosting service (YouTube, Vimeo)',
        '3. Go to Etsy Shop Manager → Listings',
        '4. Edit each listing and add video URL',
        '5. Videos show in product gallery, boosting conversion rate',
      ]
    },
    {
      title: 'Update Shop Policies',
      impact: '+8%',
      description: 'Clear policies build customer trust',
      steps: [
        '1. Go to Etsy Shop Manager → Shop Settings',
        '2. Click "Policies"',
        '3. Add/update: Return Policy, Shipping Policy, Privacy Policy',
        '4. Be clear about processing time (3-5 business days)',
        '5. Include contact info for customer support',
      ]
    },
    {
      title: 'Optimize Shipping',
      impact: '+15%',
      description: 'Free shipping threshold increases sales',
      steps: [
        '1. Calculate average order value (AOV)',
        '2. Set free shipping threshold at 1.5x AOV',
        '3. Go to Etsy Shop Manager → Settings → Shipping',
        '4. Add "Free shipping on orders over $X"',
        '5. Increase base price slightly to cover shipping cost',
      ]
    },
  ];

  const opportunities = [
    { title: 'Market Trend: Eco Products', potential: 'High', action: 'Create sustainable line' },
    { title: 'Seasonal: Holiday Gifts', potential: 'Very High', action: 'Launch limited edition' },
  ];

  const guideForSelected = recommendations.find(r => r.title === selectedRecommendation);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {selectedRecommendation && (
        <div className="card" style={{ background: '#1E293B', border: '2px solid #8B5CF6', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <h3 style={{ color: '#8B5CF6', fontSize: '20px', margin: 0 }}>📋 Implementation Guide</h3>
            <button
              onClick={() => setSelectedRecommendation(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
          <p style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>{selectedRecommendation}</p>
          <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {guideForSelected?.steps.map((step, index) => (
              <p key={index} style={{ color: '#F1F5F9', marginBottom: '0.75rem', fontSize: '14px' }}>
                {step}
              </p>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#8B5CF6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ✓ Mark as Started
            </button>
            <button
              onClick={() => setSelectedRecommendation(null)}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#334155',
                color: '#F1F5F9',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div>
        <h3 style={{ color: '#8B5CF6', marginBottom: '1rem', fontSize: '18px' }}>🤖 AI Recommendations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {recommendations.map((r) => (
            <div key={r.title} className="card" style={{ background: '#1E293B', border: selectedRecommendation === r.title ? '2px solid #8B5CF6' : '1px solid #8B5CF6', padding: '1rem', borderRadius: '8px', opacity: selectedRecommendation && selectedRecommendation !== r.title ? 0.6 : 1 }}>
              <p style={{ color: '#8B5CF6', fontWeight: '600', marginBottom: '0.5rem' }}>{r.title}</p>
              <p style={{ color: '#F1F5F9', fontSize: '12px', marginBottom: '0.75rem' }}>{r.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#10B981', fontWeight: '600', fontSize: '14px' }}>{r.impact} uplift</span>
                <button
                  onClick={() => setSelectedRecommendation(r.title)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: '#8B5CF6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Implement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
        <h3 style={{ color: '#8B5CF6', marginBottom: '1rem', fontSize: '18px' }}>⚡ Quick Wins</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li style={{ color: '#F1F5F9', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10B981' }}>✓</span> Update shop banner (5 min)</li>
          <li style={{ color: '#F1F5F9', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10B981' }}>✓</span> Add FAQ section (10 min)</li>
          <li style={{ color: '#F1F5F9', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10B981' }}>✓</span> Enable Etsy Ads (2 min)</li>
        </ul>
      </div>

      <div>
        <h3 style={{ color: '#8B5CF6', marginBottom: '1rem', fontSize: '18px' }}>🎯 Market Opportunities</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {opportunities.map((o) => (
            <div key={o.title} style={{ background: '#1E293B', border: '1px solid #334155', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#F1F5F9', fontWeight: '600', marginBottom: '0.25rem' }}>{o.title}</p>
                <p style={{ color: '#94A3B8', fontSize: '12px' }}>Potential: <span style={{ color: o.potential === 'Very High' ? '#10B981' : '#F59E0B' }}>{o.potential}</span></p>
              </div>
              <button style={{ padding: '0.5rem 1rem', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{o.action}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Phase({ name, id, color, onProductCreate, productName, productDescription, productImage }: { name: string; id: string; color: string; onProductCreate?: (product: Product, imageUrl?: string) => void; productName?: string; productDescription?: string; productImage?: string }) {
  return (
    <div className="page-load" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '1.5rem', color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{getIcon(id, color)} {name}</h2>
      {id === 'phase1' && <Phase1Analysis />}
      {id === 'phase2' && <Phase2Creator onProductCreate={onProductCreate} />}
      {id === 'phase3' && <Phase3ListingManager productName={productName} productDescription={productDescription} productImage={productImage} />}
      {id === 'phase4' && <Phase4Analytics />}
      {id === 'phase5' && <Phase5Optimizer />}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentProductImage, setCurrentProductImage] = useState<string>('');

  const handleProductCreate = (product: Product, imageUrl?: string) => {
    setCurrentProduct(product);
    setCurrentProductImage(imageUrl || '');
    setCurrentPage('phase3');
  };

  return (
    <div style={{ display: 'flex', background: '#0F172A', minHeight: '100vh' }}>
      <AnimatedSidebar currentPage={currentPage} setPage={setCurrentPage} />
      <div style={{ marginLeft: '90px', width: 'calc(100% - 90px)', overflowY: 'auto' }}>
        {currentPage === 'dashboard' && <Dashboard setPage={setCurrentPage} />}
        {currentPage === 'phase1' && <Phase name="Market Analysis" id="phase1" color="#3B82F6" />}
        {currentPage === 'phase2' && <Phase name="Product Creator" id="phase2" color="#10B981" onProductCreate={handleProductCreate} />}
        {currentPage === 'phase3' && <Phase name="Listing Manager" id="phase3" color="#F59E0B" productName={currentProduct?.name} productDescription={currentProduct?.description} productImage={currentProductImage} />}
        {currentPage === 'phase4' && <Phase name="Analytics" id="phase4" color="#EC4899" />}
        {currentPage === 'phase5' && <Phase name="Store Optimizer" id="phase5" color="#8B5CF6" />}
      </div>
    </div>
  );
}
