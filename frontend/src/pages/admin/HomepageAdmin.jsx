import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import {
  Save, Plus, Trash2, MoveUp, MoveDown,
  Image as ImageIcon, Megaphone, Layout, ChevronDown, ChevronUp, Check
} from 'lucide-react';

/* ─── Sample content pre-filled for the admin ─── */
const SAMPLE_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80',
    heading: 'New Season Arrivals',
    subheading: 'Discover the latest in premium innerwear, casuals & formals — crafted for the modern man.',
    ctaText: 'Explore Gallery',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=2000&q=80',
    heading: 'Premium Innerwear',
    subheading: 'Jockey, U.S. Polo, Lux and more — top brands at the best prices.',
    ctaText: 'Shop Innerwear',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=2000&q=80',
    heading: 'Formals That Fit',
    subheading: 'Shirts, trousers and blazers curated for office wear and beyond.',
    ctaText: 'View Collection',
  },
];

const SAMPLE_MARQUEE =
  '✦ Premium Quality · Fast Enquiry · 100+ Brands · WhatsApp Us Now · Free Advice · Bulk Orders Welcome ✦';

const SAMPLE_PROMOS = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=1600&q=80',
    label: 'New Season Casuals',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=80',
    label: 'Premium Innerwear Brands',
  },
];

const MAX_SLIDES = 5;
const MAX_PROMOS = 3;

/* ─── Shared field styles ─── */
const inputCls =
  'w-full border-2 border-gray-200 p-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium text-sm transition-colors';

/* ─── Section wrapper with expand / collapse ─── */
const Section = ({ title, icon: Icon, accentLabel, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-gray-200 bg-white mb-6 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-theme-black text-theme-yellow flex items-center justify-center">
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{accentLabel}</p>
            <h2 className="text-lg font-display font-black text-theme-black uppercase tracking-tight">{title}</h2>
          </div>
        </div>
        {open ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-8 pt-2 border-t border-gray-100">{children}</div>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const HomepageAdmin = () => {
  const [uploading, setUploading] = useState(false);

  /* ─── Hero Slides state ─── */
  const [heroSlides, setHeroSlides] = useState(SAMPLE_SLIDES);
  const [savingHero, setSavingHero] = useState(false);
  const [savedHero, setSavedHero] = useState(false);

  /* ─── Marquee state ─── */
  const [marqueeText, setMarqueeText] = useState(SAMPLE_MARQUEE);
  const [savingMarquee, setSavingMarquee] = useState(false);
  const [savedMarquee, setSavedMarquee] = useState(false);

  /* ─── Promo Banners state ─── */
  const [promoSections, setPromoSections] = useState(SAMPLE_PROMOS);
  const [savingPromo, setSavingPromo] = useState(false);
  const [savedPromo, setSavedPromo] = useState(false);

  /* ─── Fetch existing settings on mount ─── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.heroSlides?.length) setHeroSlides(data.heroSlides);
        if (data.marqueeText) setMarqueeText(data.marqueeText);
        if (data.promoSections?.length) setPromoSections(data.promoSections);
      } catch {}
    })();
  }, []);

  /* ─── Generic image uploader ─── */
  const uploadImage = async file => {
    const fd = new FormData();
    fd.append('images', file);
    const res = await api.post('/gallery/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.urls[0];
  };

  /* ══ HERO helpers ══ */
  const addSlide = () => {
    if (heroSlides.length >= MAX_SLIDES) return toast.warn(`Max ${MAX_SLIDES} slides`);
    setHeroSlides([...heroSlides, { imageUrl: '', heading: '', subheading: '', ctaText: 'Explore Gallery' }]);
  };
  const removeSlide = idx => setHeroSlides(heroSlides.filter((_, i) => i !== idx));
  const moveSlide = (idx, dir) => {
    const arr = [...heroSlides];
    const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]];
    setHeroSlides(arr);
  };
  const updateSlide = (idx, key, val) => {
    const arr = [...heroSlides];
    arr[idx] = { ...arr[idx], [key]: val };
    setHeroSlides(arr);
  };
  const uploadSlideImage = async (idx, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      updateSlide(idx, 'imageUrl', url);
      toast.success('Slide image uploaded');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const saveHero = async () => {
    setSavingHero(true);
    try {
      await api.put('/settings', { heroSlides });
      toast.success('Hero slider saved!');
      setSavedHero(true);
      setTimeout(() => setSavedHero(false), 2500);
    } catch { toast.error('Save failed'); }
    setSavingHero(false);
  };

  /* ══ MARQUEE helpers ══ */
  const saveMarquee = async () => {
    setSavingMarquee(true);
    try {
      await api.put('/settings', { marqueeText });
      toast.success('Ticker text saved!');
      setSavedMarquee(true);
      setTimeout(() => setSavedMarquee(false), 2500);
    } catch { toast.error('Save failed'); }
    setSavingMarquee(false);
  };

  /* ══ PROMO helpers ══ */
  const addPromo = () => {
    if (promoSections.length >= MAX_PROMOS) return toast.warn(`Max ${MAX_PROMOS} banners`);
    setPromoSections([...promoSections, { imageUrl: '', label: '' }]);
  };
  const removePromo = idx => setPromoSections(promoSections.filter((_, i) => i !== idx));
  const updatePromo = (idx, key, val) => {
    const arr = [...promoSections];
    arr[idx] = { ...arr[idx], [key]: val };
    setPromoSections(arr);
  };
  const uploadPromoImage = async (idx, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      updatePromo(idx, 'imageUrl', url);
      toast.success('Banner image uploaded');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const savePromo = async () => {
    setSavingPromo(true);
    try {
      await api.put('/settings', { promoSections });
      toast.success('Promo banners saved!');
      setSavedPromo(true);
      setTimeout(() => setSavedPromo(false), 2500);
    } catch { toast.error('Save failed'); }
    setSavingPromo(false);
  };

  /* ─── Save button component ─── */
  const SaveBtn = ({ loading, saved, onClick, label = 'Save Section' }) => (
    <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
      <button
        type="button"
        onClick={onClick}
        disabled={loading || uploading}
        className={`flex items-center gap-3 px-10 py-4 font-black uppercase tracking-widest text-sm border-2 transition-all disabled:opacity-50 ${
          saved
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-theme-black border-theme-black text-theme-yellow hover:bg-theme-yellow hover:text-theme-black'
        }`}
      >
        {saved ? <Check size={18} /> : <Save size={18} />}
        {loading ? 'Saving…' : saved ? 'Saved!' : label}
      </button>
    </div>
  );

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div className="max-w-[960px] animate-fade-in pb-16">
      {/* Page Header */}
      <div className="mb-10 pb-6 border-b border-gray-100">
        <h1 className="text-4xl font-display font-black text-theme-black uppercase tracking-tight">Homepage</h1>
        <p className="mt-1 text-gray-400 font-medium">
          Manage all content displayed on the homepage. Each section saves independently.
        </p>
      </div>

      {/* ══ SECTION 1: HERO SLIDER ══ */}
      <Section icon={ImageIcon} title="Hero Slider" accentLabel="Section 1 of 3" defaultOpen={true}>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Upload up to <strong>{MAX_SLIDES}</strong> slides. Each slide shows a full-screen background image with a heading, subheading and call-to-action button. Slides auto-play every 5 seconds.
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            {heroSlides.length} / {MAX_SLIDES} slides
          </span>
          <button
            onClick={addSlide}
            className="flex items-center gap-2 bg-theme-yellow text-theme-black px-5 py-2.5 font-black text-xs uppercase tracking-widest hover:opacity-80 transition"
          >
            <Plus size={14} /> Add Slide
          </button>
        </div>

        <div className="space-y-5">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className="border-2 border-gray-100 hover:border-gray-300 transition-colors p-5 bg-gray-50">
              {/* Slide header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-theme-black text-theme-yellow flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {slide.heading || 'Untitled Slide'}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button title="Move up" onClick={() => moveSlide(idx, -1)} disabled={idx === 0} className="p-1.5 border border-gray-200 hover:border-theme-black disabled:opacity-30 transition">
                    <MoveUp size={13} />
                  </button>
                  <button title="Move down" onClick={() => moveSlide(idx, 1)} disabled={idx === heroSlides.length - 1} className="p-1.5 border border-gray-200 hover:border-theme-black disabled:opacity-30 transition">
                    <MoveDown size={13} />
                  </button>
                  <button title="Remove" onClick={() => removeSlide(idx)} disabled={heroSlides.length === 1} className="p-1.5 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-30 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image column */}
                <div>
                  {slide.imageUrl ? (
                    <div className="relative group aspect-video overflow-hidden border border-gray-200">
                      <img src={slide.imageUrl} alt="Slide" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-theme-black px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-theme-yellow transition">
                          Change Image
                          <input type="file" accept="image/*" className="hidden" onChange={e => uploadSlideImage(idx, e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 hover:border-theme-black bg-white cursor-pointer transition group">
                      <ImageIcon size={28} className="text-gray-300 group-hover:text-theme-black mb-2 transition" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-theme-black transition">Upload Image</span>
                      <span className="text-[10px] text-gray-300 mt-1">Recommended: 2000×1200px</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => uploadSlideImage(idx, e.target.files[0])} />
                    </label>
                  )}
                </div>

                {/* Text column */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Heading</label>
                    <input value={slide.heading} onChange={e => updateSlide(idx, 'heading', e.target.value)} placeholder="e.g. New Season Arrivals" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Subheading</label>
                    <textarea value={slide.subheading} onChange={e => updateSlide(idx, 'subheading', e.target.value)} placeholder="e.g. Premium quality for the modern man." rows={2} className={`${inputCls} resize-none`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Button Text</label>
                    <input value={slide.ctaText} onChange={e => updateSlide(idx, 'ctaText', e.target.value)} placeholder="Explore Gallery" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SaveBtn loading={savingHero} saved={savedHero} onClick={saveHero} label="Save Hero Slider" />
      </Section>

      {/* ══ SECTION 2: MARQUEE TICKER ══ */}
      <Section icon={Megaphone} title="Scrolling Ticker Bar" accentLabel="Section 2 of 3" defaultOpen={true}>
        <p className="text-sm text-gray-500 font-medium mb-6">
          This text loops continuously across the top of every page. Use <code className="bg-gray-100 px-1.5 py-0.5 text-xs rounded">·</code> or <code className="bg-gray-100 px-1.5 py-0.5 text-xs rounded">✦</code> as visual separators between items.
        </p>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Ticker Text</label>
          <textarea
            value={marqueeText}
            onChange={e => setMarqueeText(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="✦ Premium Quality · Fast Enquiry · 100+ Brands · WhatsApp Us Now ✦"
          />
          <p className="mt-2 text-[11px] text-gray-400">The text repeats continuously — no need to duplicate it yourself.</p>
        </div>

        {/* Live preview */}
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Live Preview</p>
          <div className="bg-theme-black overflow-hidden py-3 rounded-sm">
            <div className="marquee-track">
              <span className="inline-block text-theme-yellow font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap">{marqueeText}</span>
              <span className="inline-block text-theme-yellow font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap" aria-hidden="true">{marqueeText}</span>
              <span className="inline-block text-theme-yellow font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap" aria-hidden="true">{marqueeText}</span>
              <span className="inline-block text-theme-yellow font-bold text-xs tracking-[0.2em] uppercase px-12 whitespace-nowrap" aria-hidden="true">{marqueeText}</span>
            </div>
          </div>
        </div>

        <SaveBtn loading={savingMarquee} saved={savedMarquee} onClick={saveMarquee} label="Save Ticker Text" />
      </Section>

      {/* ══ SECTION 3: PROMO BANNERS ══ */}
      <Section icon={Layout} title="Promotional Banners" accentLabel="Section 3 of 3" defaultOpen={true}>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Add up to <strong>{MAX_PROMOS}</strong> promotional banners displayed as a row on the homepage (between the featured products and look book). Best results with wide landscape images (16:9).
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            {promoSections.length} / {MAX_PROMOS} banners
          </span>
          <button
            onClick={addPromo}
            disabled={promoSections.length >= MAX_PROMOS}
            className="flex items-center gap-2 bg-theme-yellow text-theme-black px-5 py-2.5 font-black text-xs uppercase tracking-widest hover:opacity-80 disabled:opacity-40 transition"
          >
            <Plus size={14} /> Add Banner
          </button>
        </div>

        {promoSections.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 py-16 text-center">
            <Layout size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No banners yet. Click "Add Banner" above.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {promoSections.map((promo, idx) => (
              <div key={idx} className="border-2 border-gray-100 hover:border-gray-300 transition-colors p-5 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-theme-black text-theme-yellow flex items-center justify-center text-xs font-black">{idx + 1}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">{promo.label || 'Promo Banner'}</span>
                  </span>
                  <button onClick={() => removePromo(idx)} className="p-1.5 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white transition">
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {promo.imageUrl ? (
                      <div className="relative group aspect-video overflow-hidden border border-gray-200">
                        <img src={promo.imageUrl} alt="Promo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-theme-black px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-theme-yellow transition">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => uploadPromoImage(idx, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 hover:border-theme-black bg-white cursor-pointer transition group">
                        <ImageIcon size={28} className="text-gray-300 group-hover:text-theme-black mb-2 transition" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-theme-black transition">Upload Banner</span>
                        <span className="text-[10px] text-gray-300 mt-1">Recommended: 1600×900px</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => uploadPromoImage(idx, e.target.files[0])} />
                      </label>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Banner Label (shown over image)</label>
                    <input
                      value={promo.label}
                      onChange={e => updatePromo(idx, 'label', e.target.value)}
                      placeholder="e.g. New Season Casuals"
                      className={inputCls}
                    />
                    <p className="mt-2 text-[11px] text-gray-400">Leave blank to show the image without any text overlay.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <SaveBtn loading={savingPromo} saved={savedPromo} onClick={savePromo} label="Save Promo Banners" />
      </Section>
    </div>
  );
};

export default HomepageAdmin;
