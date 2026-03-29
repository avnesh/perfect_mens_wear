import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

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
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-8">
        <input 
          required 
          type="text" 
          placeholder="New category name" 
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl">Add</button>
      </form>

      <ul className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
        {categories.map(c => (
          <li key={c._id} className="flex justify-between items-center p-4">
            <span className="font-medium text-gray-900">{c.name}</span>
            <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={20} />
            </button>
          </li>
        ))}
        {categories.length === 0 && <li className="p-4 text-gray-500">No categories.</li>}
      </ul>
    </div>
  );
};
export default Categories;
