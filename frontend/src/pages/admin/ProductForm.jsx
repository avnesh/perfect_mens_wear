import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import { Plus, ArrowLeft, X, ImagePlus } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  
  const [form, setForm] = useState({ 
    name: '', brand: '', price: 0, description: '', category: '', sizes: '', isFeatured: false, existingImages: [] 
  });
  const [newFilePreviews, setNewFilePreviews] = useState([]); // [{file, previewUrl}]
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const cRes = await api.get('/categories');
        setCategories(cRes.data);
        
        if (isEditing) {
          const pRes = await api.get(`/products/${id}`);
          const p = pRes.data;
          setForm({ 
            name: p.name || '', 
            brand: p.brand || '', 
            price: p.price || 0, 
            description: p.description || '', 
            category: p.category?._id || '', 
            sizes: p.sizes?.join(', ') || '', 
            isFeatured: p.isFeatured || false,
            existingImages: p.images || []
          });
        }
      } catch (error) {
        toast.error("Error loading product data");
        navigate('/admin/products');
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, navigate, isEditing]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [...form.existingImages];
      
      // Upload new files if provided
      if (newFilePreviews.length > 0) {
        if (newFilePreviews.length + imageUrls.length > 6) {
          toast.error('Maximum 6 images allowed per product.');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        newFilePreviews.forEach(({ file }) => formData.append('images', file));
        const uploadRes = await api.post('/gallery/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Append new URLs to existing array
        imageUrls = imageUrls.concat(uploadRes.data.urls);
      }

      const payload = {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        sizes: form.sizes.split(',').map(s => s.trim()).filter(s => s),
        isFeatured: form.isFeatured
      };

      if (!isEditing && imageUrls.length === 0) {
        toast.error('At least 1 image is required for new products.');
        setLoading(false);
        return;
      }

      if (imageUrls.length > 0) {
          payload.images = imageUrls;
      }

      if (isEditing) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product added successfully');
      }

      // Automatically return to the visit screen
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    const totalAfter = form.existingImages.length + newFilePreviews.length + selected.length;
    if (totalAfter > 6) {
      toast.error(`Can only add ${6 - form.existingImages.length - newFilePreviews.length} more image(s). Max is 6 total.`);
      return;
    }
    const previews = selected.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewFilePreviews(prev => [...prev, ...previews]);
    // Reset input so same files can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeExistingImage = (idx) => {
    setForm(prev => ({ ...prev, existingImages: prev.existingImages.filter((_, i) => i !== idx) }));
  };

  const removeNewPreview = (idx) => {
    setNewFilePreviews(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].previewUrl);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const totalImages = form.existingImages.length + newFilePreviews.length;

  if (fetching) {
     return <div className="text-center py-20 font-bold uppercase tracking-widest text-gray-400">Loading Product Data...</div>;
  }

  return (
    <div className="max-w-[1000px] animate-fade-in mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b-2 border-theme-black pb-4">
        <Link to="/admin/products" className="p-3 bg-gray-100 hover:bg-theme-black hover:text-white transition-colors rounded-full text-theme-black cursor-pointer">
           <ArrowLeft size={24} strokeWidth={2.5}/>
        </Link>
        <div className="min-w-0">
           <h1 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight truncate sm:truncate-none">
             {isEditing ? 'Edit Product' : 'New Product'}
           </h1>
           <p className="text-gray-500 font-bold tracking-widest text-xs uppercase mt-1">
             {isEditing ? `Modifying ID: ${id}` : 'Create a new catalog entry'}
           </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 md:p-12 border-2 border-gray-200 shadow-[8px_8px_0px_#111]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
            <input required type="text" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Brand</label>
            <input type="text" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors" value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price (₹)</label>
            <input required type="number" step="0.01" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category</label>
            <select required className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors appearance-none cursor-pointer" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Sizes (comma separated)</label>
            <input required type="text" placeholder="e.g. S, M, L, XL, XXL" className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors" value={form.sizes} onChange={e=>setForm({...form, sizes: e.target.value})} />
          </div>
        </div>
        
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
          <textarea required className="w-full border-2 border-gray-200 p-4 bg-gray-50 focus:bg-white focus:border-theme-black outline-none font-medium transition-colors h-40 resize-none" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
        </div>
        
        <div className="mt-8 bg-gray-50 p-6 border-2 border-gray-200 flex items-center gap-4 hover:border-theme-black transition-colors cursor-pointer" onClick={() => setForm({...form, isFeatured: !form.isFeatured})}>
           <input type="checkbox" id="featured" className="w-6 h-6 accent-theme-black cursor-pointer pointer-events-none" checked={form.isFeatured} readOnly />
           <label htmlFor="featured" className="text-sm font-black uppercase tracking-widest text-theme-black cursor-pointer select-none">
             Mark as Featured Product (Highlights on Homepage)
           </label>
        </div>
        
        {/* Image Gallery Manager */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Product Images <span className="text-theme-yellow">({totalImages}/6)</span>
            </label>
            {totalImages < 6 && (
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-theme-black border-2 border-theme-black px-4 py-2 cursor-pointer hover:bg-theme-black hover:text-theme-yellow transition-colors">
                <ImagePlus size={14} /> Add Images
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            )}
          </div>

          {/* Combined image grid */}
          {totalImages > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {/* Existing saved images */}
              {form.existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative group aspect-square border-2 border-gray-200 overflow-hidden bg-gray-50">
                  <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeExistingImage(idx)}
                      className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-black uppercase tracking-widest text-center py-0.5">Saved</div>
                </div>
              ))}

              {/* Newly queued file previews */}
              {newFilePreviews.map(({ previewUrl }, idx) => (
                <div key={`new-${idx}`} className="relative group aspect-square border-2 border-theme-yellow overflow-hidden bg-gray-50">
                  <img src={previewUrl} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeNewPreview(idx)}
                      className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-theme-yellow text-theme-black text-[9px] font-black uppercase tracking-widest text-center py-0.5">New</div>
                </div>
              ))}

              {/* Empty slot placeholder if below 6 */}
              {totalImages < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-theme-black transition-colors group">
                  <Plus size={20} className="text-gray-300 group-hover:text-theme-black transition-colors" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-theme-black transition-colors">Add</span>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              )}
            </div>
          ) : (
            /* Empty state drop zone */
            <label className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center hover:border-theme-black hover:bg-white transition-all cursor-pointer group">
              <div className="p-5 bg-white shadow-sm text-gray-400 group-hover:text-theme-black rounded-full transition-colors border-2 border-gray-100 group-hover:border-theme-black">
                <ImagePlus size={36} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-theme-black mb-1">Upload Product Images</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Up to 6 images — click to browse</p>
              </div>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>
          )}
        </div>
        
        <div className="mt-12 pt-8 border-t-2 border-gray-100 flex flex-col md:flex-row justify-end gap-4">
          <Link to="/admin/products" className="text-center md:text-left bg-transparent text-gray-500 px-10 py-5 font-black uppercase tracking-widest hover:text-theme-black transition-colors">
             Cancel Details
          </Link>
          <button type="submit" disabled={loading} className="w-full md:w-auto bg-theme-black text-theme-yellow px-14 py-5 font-black uppercase tracking-widest hover:bg-theme-yellow hover:text-theme-black transition-colors border-2 border-theme-black disabled:opacity-50">
            {loading ? 'Committing Entry...' : (isEditing ? 'Save Revisions' : 'Publish Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
