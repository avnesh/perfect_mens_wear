import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Trash2, Plus } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) { toast.error("Error fetching"); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      toast.success("Added");
      setName('');
      fetchCategories();
    } catch (error) { toast.error("Error adding"); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Deleted");
      fetchCategories();
    } catch (error) { toast.error("Error deleting"); }
  };

  return (
    <div className="max-w-[1000px] animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
         <div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-theme-black uppercase tracking-tight">Taxonomy</h1>
            <p className="mt-1 text-gray-400 font-medium">Manage product categories</p>
         </div>
      </div>
      
      <div className="bg-gray-50 border-2 border-gray-200 p-8 shadow-[8px_8px_0px_#111] mb-12">
         <div className="flex items-center gap-3 mb-6">
             <div className="w-3 h-8 bg-theme-yellow"></div>
             <h2 className="text-xl font-display font-black text-theme-black uppercase tracking-wider">Add Category</h2>
         </div>
         <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
               <input 
               required 
               type="text" 
               placeholder="E.g. Hoodies, T-Shirts..." 
               className="w-full border-2 border-gray-200 py-4 px-6 bg-white focus:border-theme-black outline-none font-bold uppercase tracking-widest text-sm transition-colors"
               value={name} 
               onChange={e => setName(e.target.value)} 
               />
            </div>
            <button type="submit" className="bg-theme-black text-theme-yellow px-10 py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-yellow hover:text-theme-black border-2 border-theme-black transition-colors shrink-0">
               <Plus size={20} strokeWidth={3} /> Add
            </button>
         </form>
      </div>

      <div className="bg-white border-2 border-gray-200">
        <div className="bg-gray-50 border-b-2 border-gray-200 px-6 py-5">
           <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Existing Categories</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {categories.map(c => (
            <li key={c._id} className="flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition-colors group">
              <span className="font-bold text-theme-black text-sm uppercase tracking-wide">{c.name}</span>
              <button onClick={() => handleDelete(c._id)} className="p-2 text-red-300 hover:text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </li>
          ))}
          {categories.length === 0 && (
             <li className="px-6 py-12 text-center text-gray-400 font-medium tracking-wide">
                No categories defined.
             </li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default Categories;
