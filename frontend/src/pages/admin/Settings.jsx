import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';

const Settings = () => {
  const DEFAULTS = {
    shopName: 'Perfect Mens Wear',
    logo: '',
    address: 'Mumbai, Maharashtra, India',
    contactEmail: 'contact@perfectmenswear.com',
    contactNumber: '9988776655',
    whatsappNumber: '919988776655',
    aboutText: 'Premium quality innerwear, casuals & formals — curated for the modern man.',
  };

  // Helper: allow only digits
  const digitsOnly = (val) => val.replace(/\D/g, '');
  const [form, setForm] = useState(DEFAULTS);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        // Merge DB data with defaults so empty DB fields still show defaults
        setForm(prev => ({
          ...prev,
          shopName:       data.shopName       || prev.shopName,
          logo:           data.logo           || prev.logo,
          address:        data.address        || prev.address,
          contactEmail:   data.contactEmail   || prev.contactEmail,
          contactNumber:  data.contactNumber  || prev.contactNumber,
          whatsappNumber: data.whatsappNumber || prev.whatsappNumber,
          aboutText:      data.aboutText      || prev.aboutText,
        }));
      }
    } catch {}
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('images', file);
    const res = await api.post('/gallery/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
    return res.data.urls[0];
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = { ...form };
      if (logoFile) payload.logo = await uploadImage(logoFile);
      await api.put('/settings', payload);
      toast.success('✅ Settings saved successfully!');
      fetchSettings();
    } catch { toast.error('Error saving settings'); }
    setSaving(false);
  };

  return (
    <div className="max-w-[1000px] animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
         <div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">Configuration</h1>
            <p className="mt-1 text-gray-400 font-medium">Manage global store settings</p>
         </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* ── Brand Info ── */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="w-3 h-8 bg-theme-yellow"></div>
            <h2 className="text-base font-black text-theme-black uppercase tracking-widest">Brand Info</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Shop Name</label>
              <input type="text" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-bold uppercase tracking-widest text-sm transition-colors" value={form.shopName} onChange={e=>setForm({...form, shopName: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Upload Logo</label>
              <input type="file" accept="image/*" onChange={e=>setLogoFile(e.target.files[0])} className="w-full border-2 border-dashed border-gray-300 p-3 bg-gray-50 outline-none font-medium cursor-pointer hover:border-theme-black transition-colors text-sm" />
              {form.logo && <div className="mt-3 p-3 border border-gray-100 bg-white inline-block"><img src={form.logo} className="h-10 object-contain" alt="Logo" /></div>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">About / Tagline</label>
              <textarea rows={3} className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors resize-none leading-relaxed text-sm" value={form.aboutText} onChange={e=>setForm({...form, aboutText: e.target.value})} placeholder="Short description of your store shown in footer and about page..." />
            </div>
          </div>
        </div>

        {/* ── Contact Details ── */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="w-3 h-8 bg-theme-yellow"></div>
            <h2 className="text-base font-black text-theme-black uppercase tracking-widest">Contact Details</h2>
            <p className="text-xs text-gray-400 font-medium ml-2">(shown in footer &amp; contact page)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contact Email</label>
              <input type="email" placeholder="e.g. hello@yourstore.com" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors text-sm" value={form.contactEmail} onChange={e=>setForm({...form, contactEmail: e.target.value})} />
              <p className="mt-1 text-[10px] text-gray-400">Shown as the email link in footer</p>
            </div>

            {/* ── Contact / Phone Number (footer display) ── */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                📞 Contact Number
              </label>
              <div className="flex items-center border-2 border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-theme-black transition-colors">
                <span className="px-3 py-4 text-sm font-bold text-gray-400 border-r-2 border-gray-200 select-none">+91</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9988776655"
                  className="flex-1 p-4 bg-transparent outline-none font-bold text-sm"
                  value={form.contactNumber}
                  onChange={e => setForm({ ...form, contactNumber: digitsOnly(e.target.value) })}
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Digits only, 10 digits · shown in footer &amp; contact page</p>
            </div>

            {/* ── WhatsApp Number (used for all WA links site-wide) ── */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                💬 WhatsApp Number
              </label>
              <div className="flex items-center border-2 border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-theme-black transition-colors">
                <span className="px-3 py-4 text-sm font-bold text-gray-400 border-r-2 border-gray-200 select-none">91</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9988776655"
                  className="flex-1 p-4 bg-transparent outline-none font-bold text-sm"
                  value={form.whatsappNumber.replace(/^91/, '')}
                  onChange={e => setForm({ ...form, whatsappNumber: '91' + digitsOnly(e.target.value) })}
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">10-digit mobile number · prefix 91 added automatically for wa.me links</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Physical Address</label>
              <input type="text" placeholder="e.g. Shop No. 5, XYZ Market, Mumbai 400001" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors text-sm" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
            </div>
          </div>
        </div>

        {/* ── Save ── */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-theme-black text-theme-yellow px-12 py-5 font-black flex items-center gap-3 uppercase tracking-widest hover:bg-theme-yellow hover:text-theme-black border-2 border-theme-black transition-colors disabled:opacity-50">
            <Save size={20} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Settings;
