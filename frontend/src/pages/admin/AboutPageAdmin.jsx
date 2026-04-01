import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Save, Info, Image as ImageIcon } from 'lucide-react';

const AboutPageAdmin = () => {
  const [form, setForm] = useState({
    aboutTitle: '',
    aboutSubtitle: 'The Brand',
    aboutText: '',
    aboutText2: '',
    aboutImage: '',
    aboutStat1Value: '100%',
    aboutStat1Label: 'Premium Quality',
    aboutStat2Value: '24/7',
    aboutStat2Label: 'Personal Service',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        setForm({
          aboutTitle: data.aboutTitle || 'Our Story',
          aboutSubtitle: data.aboutSubtitle || 'The Brand',
          aboutText: data.aboutText || "We believe in creating high-quality, premium apparel that challenges the status quo. Every drop is crafted with relentless attention to detail, utilizing the finest materials and boldest designs.",
          aboutText2: data.aboutText2 || "Our style is born from the intersection of modern street culture and luxury aesthetics. We are more than a brand; we are a movement dedicated to authentic expression above all else.",
          aboutImage: data.aboutImage || '',
          aboutStat1Value: data.aboutStat1Value || '100%',
          aboutStat1Label: data.aboutStat1Label || 'Premium Quality',
          aboutStat2Value: data.aboutStat2Value || '24/7',
          aboutStat2Label: data.aboutStat2Label || 'Personal Service',
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('images', file);
    const res = await api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.urls[0];
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = { ...form };
      if (imageFile) {
        payload.aboutImage = await uploadImage(imageFile);
      }
      await api.put('/settings', payload);
      toast.success('✅ About page updated successfully!');
      setImageFile(null);
      fetchSettings();
    } catch (error) {
      toast.error('Error saving about page settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-theme-yellow border-t-theme-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">
            About Page Editor
          </h1>
          <p className="mt-1 text-gray-400 font-medium">Customize your brand story and about page content</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Story Section */}
        <div className="bg-white border-2 border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="w-3 h-8 bg-theme-yellow"></div>
            <h2 className="text-base font-black text-theme-black uppercase tracking-widest flex items-center gap-2">
              <Info size={18} /> Our Story
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Main Title</label>
              <input
                type="text"
                placeholder="e.g. The Story of Perfect"
                className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-bold uppercase tracking-widest text-sm transition-colors"
                value={form.aboutTitle}
                onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Subtitle</label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-bold uppercase tracking-widest text-sm transition-colors"
                value={form.aboutSubtitle}
                onChange={(e) => setForm({ ...form, aboutSubtitle: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Paragraph 1 (Main Story)</label>
              <textarea
                rows={4}
                className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors resize-none leading-relaxed text-sm"
                value={form.aboutText}
                onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Paragraph 2 (Brand Values)</label>
              <textarea
                rows={4}
                className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors resize-none leading-relaxed text-sm"
                value={form.aboutText2}
                onChange={(e) => setForm({ ...form, aboutText2: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Stats & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats Card */}
          <div className="bg-white border-2 border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <div className="w-3 h-8 bg-theme-yellow"></div>
              <h2 className="text-base font-black text-theme-black uppercase tracking-widest">Brand Stats</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Stat 1 Value</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 p-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-black text-center"
                    value={form.aboutStat1Value}
                    onChange={(e) => setForm({ ...form, aboutStat1Value: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Stat 1 Label</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 p-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-bold text-xs uppercase tracking-widest"
                    value={form.aboutStat1Label}
                    onChange={(e) => setForm({ ...form, aboutStat1Label: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Stat 2 Value</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 p-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-black text-center"
                    value={form.aboutStat2Value}
                    onChange={(e) => setForm({ ...form, aboutStat2Value: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Stat 2 Label</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 p-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-bold text-xs uppercase tracking-widest"
                    value={form.aboutStat2Label}
                    onChange={(e) => setForm({ ...form, aboutStat2Label: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-white border-2 border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <div className="w-3 h-8 bg-theme-yellow"></div>
              <h2 className="text-base font-black text-theme-black uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={18} /> About Image
              </h2>
            </div>
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-theme-black transition-all cursor-pointer group relative overflow-hidden">
                {imageFile || form.aboutImage ? (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : form.aboutImage}
                    className="w-full h-full object-cover"
                    alt="About Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-theme-black mb-3" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Click to upload brand image</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                {(imageFile || form.aboutImage) && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-theme-black px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg">Change Image</span>
                  </div>
                )}
              </label>
              <p className="text-[10px] text-gray-400 font-medium text-center">Recommended: Square or Portrait image (1:1 or 4:5 ratio)</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={saving}
            className="group relative bg-theme-black text-theme-yellow px-16 py-5 font-black flex items-center gap-3 uppercase tracking-widest hover:bg-theme-yellow hover:text-theme-black border-2 border-theme-black transition-all disabled:opacity-50 shadow-[6px_6px_0px_#FFEA00] hover:shadow-none translate-x-[-3px] translate-y-[-3px] active:translate-x-0 active:translate-y-0"
          >
            <Save size={20} />
            {saving ? 'UPDATING...' : 'SAVE ABOUT PAGE'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPageAdmin;
