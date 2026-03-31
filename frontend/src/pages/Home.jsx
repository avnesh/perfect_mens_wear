import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import api from '../api';

/* ─── WhatsApp helper ─── */
const DEFAULT_WA = '919988776655';
const waLink = (waNum, msg = 'Hello, I have an enquiry from your website.') =>
  `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;

/* ─── Fallback hero slides (shown until admin saves their own) ─── */
const FALLBACK_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80',
    heading: 'New Season Arrivals',
    subheading: 'Discover the latest in premium innerwear, casuals & formals — crafted for the modern man.',
    ctaText: 'Explore Gallery',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=2000&q=80',
    heading: 'Premium Innerwear',
    subheading: 'Jockey, U.S. Polo, Lux & more — top brands at the best prices.',
    ctaText: 'Shop Innerwear',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=2000&q=80',
    heading: 'Formals That Fit',
    subheading: 'Shirts, trousers & blazers curated for office & beyond.',
    ctaText: 'View Collection',
  },
];

/* ─── Fallback promo banners (shown until admin saves their own) ─── */
const FALLBACK_PROMOS = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=1600&q=80',
    label: 'New Season Casuals',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=80',
    label: 'Premium Innerwear Brands',
  },
];

/* ─── Category fallback tile images by name ─── */
const CAT_FALLBACKS = [
  'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80',
];

/* ════════════════════════════════════════════════════════════ */
const Home = () => {
  const [settings, setSettings] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Hero slider state */
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes, categoriesRes, galleryRes] = await Promise.all([
          api.get('/settings'),
          api.get('/products/featured'),
          api.get('/categories'),
          api.get('/gallery'),
        ]);
        setSettings(settingsRes.data);
        setFeaturedProducts(productsRes.data.slice(0, 8));
        setCategories(categoriesRes.data.slice(0, 6));
        setGallery(galleryRes.data.slice(0, 6));
      } catch (err) {
        console.error('Home fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Build slides: prefer DB data, fall back to built-in samples */
  const slides = settings?.heroSlides?.filter(s => s.imageUrl).length
    ? settings.heroSlides.filter(s => s.imageUrl)
    : FALLBACK_SLIDES;

  /* Build promo banners: prefer DB data, fall back to built-in samples */
  const promos = settings?.promoSections?.filter(p => p.imageUrl).length
    ? settings.promoSections.filter(p => p.imageUrl)
    : FALLBACK_PROMOS;

  /* Auto-advance slider every 5s */
  const goTo = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((idx + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => goTo(currentSlide + 1), 5000);
    return () => clearInterval(t);
  }, [currentSlide, goTo, slides.length]);

  /* Marquee text */
  const marquee = settings?.marqueeText || '✦ Premium Quality · Fast Enquiry · 100+ Brands · WhatsApp Us Now ✦';
  const waNumber = settings?.whatsappNumber || DEFAULT_WA;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-14 h-14 border-4 border-theme-yellow border-t-theme-black rounded-full animate-spin"></div>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title={`Home | ${settings?.shopName || 'Perfect'}`}
        description={settings?.aboutText || 'Shop premium men\'s fashion — curated collections at unbeatable quality.'}
      />

      {/* ══ 1. MARQUEE TICKER ══ */}
      <div className="bg-theme-black text-theme-yellow overflow-hidden py-3 border-b-2 border-theme-yellow/20">
        <div className="marquee-track">
          <span className="inline-block font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap">{marquee}</span>
          <span className="inline-block font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap" aria-hidden="true">{marquee}</span>
          <span className="inline-block font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap" aria-hidden="true">{marquee}</span>
          <span className="inline-block font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap" aria-hidden="true">{marquee}</span>
        </div>
      </div>

      {/* ══ 2. HERO SLIDER ══ */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[88vh] overflow-hidden bg-gray-900">
        {/* Slides */}
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={s.imageUrl}
              alt={s.heading || 'Hero Banner'}
              className="w-full h-full object-cover object-center scale-105"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-theme-black/80 via-theme-black/40 to-transparent" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-20 h-full flex items-center px-6 sm:px-12 lg:px-20">
          <div className="max-w-2xl">
            <p className="text-theme-yellow font-black tracking-[0.3em] uppercase text-xs mb-4">
              ✦ {settings?.shopName || 'Perfect'} Collection
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-tight uppercase tracking-tight mb-6">
              {slide.heading || 'Elevate Your Everyday'}
            </h1>
            <p className="text-gray-300 text-base sm:text-lg font-medium mb-8 max-w-lg leading-relaxed">
              {slide.subheading || 'Premium quality fashion curated for the modern man.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-theme-yellow text-theme-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-colors"
              >
                {slide.ctaText || 'Explore Gallery'} <ArrowRight size={18} />
              </Link>
              <a
                href={waLink(waNumber, `Hi! I saw your website ${slide.heading ? `(${slide.heading})` : ''} and want to enquire.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-theme-black transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        {slides.length > 1 && (
          <>
            <button onClick={() => goTo(currentSlide - 1)} className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 transition-colors">
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => goTo(currentSlide + 1)} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 transition-colors">
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Dot nav */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`transition-all duration-300 rounded-full ${i === currentSlide ? 'w-8 h-2 bg-theme-yellow' : 'w-2 h-2 bg-white/50 hover:bg-white'}`} />
            ))}
          </div>
        )}
      </div>

      {/* ══ 3. CATEGORY QUICK LINKS ══ */}
      {categories.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-theme-yellow mb-2">Browse</p>
              <h2 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">Gallery By Category</h2>
              <div className="w-14 h-1.5 bg-theme-yellow mt-3"></div>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-theme-black transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                className="group relative overflow-hidden bg-gray-100 aspect-square block hover:shadow-lg transition-shadow"
              >
                <img
                  src={cat.image || CAT_FALLBACKS[idx % CAT_FALLBACKS.length]}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-theme-black/80 via-theme-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-white font-black uppercase tracking-widest text-xs group-hover:text-theme-yellow transition-colors">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══ 4. FEATURED PRODUCTS ══ */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-gray-100">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-theme-yellow mb-2">Handpicked</p>
            <h2 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">Featured Products</h2>
            <div className="w-14 h-1.5 bg-theme-yellow mt-3"></div>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-theme-black transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col gap-3">
                <div className="aspect-[4/5] bg-gray-100 animate-pulse w-full"></div>
                <div className="h-3 bg-gray-100 animate-pulse w-2/3"></div>
                <div className="h-3 bg-gray-100 animate-pulse w-1/3"></div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link to="/shop" className="inline-flex border-b-2 border-theme-black pb-1 text-sm font-black uppercase tracking-widest">
            View All Products →
          </Link>
        </div>
      </div>

      {/* ══ 5. PROMO BANNERS ══ */}
      {promos.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-gray-100">

          {/* Section header — same style as Featured Products */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-theme-yellow mb-2">Curated For You</p>
              <h2 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">Shop The Look</h2>
              <div className="w-14 h-1.5 bg-theme-yellow mt-3"></div>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-theme-black transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className={`grid gap-4 ${promos.length === 1 ? 'grid-cols-1' : promos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
            {promos.map((promo, idx) => (
              <Link key={idx} to="/shop" className="group relative overflow-hidden block">
                {/* Image */}
                <div className="aspect-[16/7] overflow-hidden">
                  <img
                    src={promo.imageUrl}
                    alt={promo.label || 'Promotion'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Label bar — always visible */}
                <div className="bg-theme-black px-6 py-4 flex items-center justify-between">
                  <span className="text-theme-yellow font-black uppercase tracking-[0.2em] text-sm">
                    {promo.label || 'View Collection'}
                  </span>
                  <ArrowRight size={16} className="text-theme-yellow transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      )}

      {/* ══ 6. LOOK BOOK STRIP ══ */}
      {gallery.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-gray-100">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-theme-yellow mb-2">Inspiration</p>
              <h2 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">Look Book</h2>
              <div className="w-14 h-1.5 bg-theme-yellow mt-3"></div>
            </div>
            <Link to="/gallery" className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-theme-black transition-colors">
              Full Look Book <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {gallery.map(img => (
              <Link key={img._id} to="/gallery" className="relative group overflow-hidden bg-gray-100 aspect-square block">
                <img
                  src={img.imageUrl}
                  alt={img.caption || 'Lookbook entry'}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  loading="lazy"
                />
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-theme-black to-transparent p-3 translate-y-full group-hover:translate-y-0 transition duration-500">
                    <p className="text-theme-yellow font-bold uppercase tracking-widest text-[10px] line-clamp-1">{img.caption}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/gallery" className="inline-flex border-b-2 border-theme-black pb-1 text-sm font-black uppercase tracking-widest">
              View Full Look Book →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
