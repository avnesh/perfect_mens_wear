import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await api.get('/gallery');
      setImages(data);
    } catch (error) { toast.error("Error"); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select file");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', file);
      const res = await api.post('/gallery/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      const url = res.data.urls[0];
      
      await api.post('/gallery', { imageUrl: url, caption });
      toast.success("Uploaded to gallery");
      setFile(null);
      setCaption('');
      fetchGallery();
    } catch (error) { toast.error("Error uploading"); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      toast.success("Deleted");
      fetchGallery();
    } catch (error) { toast.error("Error"); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Gallery</h1>
      
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-end mb-8">
        <div className="flex-1">
          <label className="block text-sm mb-1">Image</label>
          <input type="file" required onChange={e=>setFile(e.target.files[0])} className="w-full border p-2 rounded" />
        </div>
        <div className="flex-1">
           <label className="block text-sm mb-1">Caption (Optional)</label>
           <input type="text" value={caption} onChange={e=>setCaption(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" disabled={uploading} className="bg-purple-600 text-white px-6 py-2 h-[42px] rounded font-medium">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img._id} className="relative group rounded-xl overflow-hidden border">
            <img src={img.imageUrl} alt="" className="w-full h-40 object-cover" />
            <button 
              onClick={() => handleDelete(img._id)} 
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
            {img.caption && <p className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs p-2">{img.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default GalleryAdmin;
