import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ _id: '', name: '', brand: '', price: 0, description: '', category: '', sizes: '', isFeatured: false });
  const [files, setFiles] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([api.get('/products?limit=1000'), api.get('/categories')]);
      setProducts(pRes.data.products);
      setCategories(cRes.data);
    } catch (error) { toast.error("Error fetching data"); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];
      if (files && files.length > 0) {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('images', file));
        const uploadRes = await api.post('/gallery/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = uploadRes.data.urls;
      }

      const payload = {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        sizes: form.sizes.split(',').map(s => s.trim()),
        isFeatured: form.isFeatured
      };

      if (!isEditing && imageUrls.length === 0) {
        toast.error('At least 1 image is required for new products.');
        setLoading(false);
        return;
      }

      if (imageUrls.length > 0) payload.images = imageUrls;

      if (isEditing) {
        await api.put(`/products/${form._id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product added');
      }

      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchData();
      } catch (error) { toast.error("Error deleting"); }
    }
  };

  const resetForm = () => {
    setForm({ _id: '', name: '', brand: '', price: 0, description: '', category: '', sizes: '', isFeatured: false });
    setFiles(null);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button 
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input required type="text" className="w-full border rounded p-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input type="text" className="w-full border rounded p-2" value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input required type="number" step="0.01" className="w-full border rounded p-2" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select required className="w-full border rounded p-2" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
              <input required type="text" placeholder="S, M, L, XL" className="w-full border rounded p-2" value={form.sizes} onChange={e=>setForm({...form, sizes: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required className="w-full border rounded p-2 h-24" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          </div>
          <div>
             <label className="flex items-center gap-2">
               <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form, isFeatured: e.target.checked})} />
               Featured Product (shows on home page)
             </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (Select Multiple)</label>
            <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} className="w-full border rounded p-2" />
          </div>
          <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-medium">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p._id}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded" />
                  <span className="font-medium text-gray-900">{p.name} {p.isFeatured && '(Featured)'}</span>
                </td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4">{p.category?.name}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => {
                    setForm({ ...p, sizes: p.sizes?.join(', ') || '', category: p.category?._id || '' });
                    setIsEditing(true);
                    setShowForm(true);
                  }} className="text-blue-600 hover:text-blue-900 mx-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-900 mx-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
