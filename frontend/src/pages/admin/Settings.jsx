import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

const Settings = () => {
  const [form, setForm] = useState({
    shopName: '', logo: '', address: '', contactEmail: '', whatsappNumber: '', aboutText: '', homeBanners: []
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) setForm(data);
    } catch (error) {}
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
      if (bannerFile) {
        const url = await uploadImage(bannerFile);
        payload.homeBanners = [url];
      }
      
      await api.put('/settings', payload);
      toast.success("Settings saved");
      fetchSettings();
    } catch (error) { toast.error("Error saving"); }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name</label>
            <input type="text" className="w-full border p-2 rounded" value={form.shopName} onChange={e=>setForm({...form, shopName: e.target.value})} />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1">Upload Logo</label>
             <input type="file" onChange={e=>setLogoFile(e.target.files[0])} className="w-full border p-2 rounded" />
             {form.logo && <img src={form.logo} className="h-10 mt-2" alt="Logo" />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input type="email" className="w-full border p-2 rounded" value={form.contactEmail} onChange={e=>setForm({...form, contactEmail: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp Number (e.g. +123456789)</label>
            <input type="text" className="w-full border p-2 rounded" value={form.whatsappNumber} onChange={e=>setForm({...form, whatsappNumber: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input type="text" className="w-full border p-2 rounded" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
        </div>

        <div>
           <label className="block text-sm font-medium mb-1">About Text</label>
           <textarea className="w-full border p-2 rounded h-24" value={form.aboutText} onChange={e=>setForm({...form, aboutText: e.target.value})} />
        </div>

        <div>
           <label className="block text-sm font-medium mb-1">Home Banner Overlay Image</label>
           <input type="file" onChange={e=>setBannerFile(e.target.files[0])} className="w-full border p-2 rounded" />
           {form.homeBanners?.length > 0 && <img src={form.homeBanners[0]} className="h-20 mt-2 rounded" alt="Banner" />}
        </div>

        <button type="submit" disabled={saving} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-medium">
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
};
export default Settings;
