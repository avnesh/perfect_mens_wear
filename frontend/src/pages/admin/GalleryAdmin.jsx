import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import { Trash2, ImagePlus, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 12;

const GalleryAdmin = () => {
  const [allImages, setAllImages]   = useState([]);
  const [files, setFiles]           = useState([]);
  const [caption, setCaption]       = useState('');
  const [uploading, setUploading]   = useState(false);
  const [page, setPage]             = useState(1);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await api.get('/gallery');
      setAllImages(data);
      setPage(1);
    } catch { toast.error('Failed to load gallery images'); }
  };

  /* ── Pagination derived state ── */
  const totalPages  = Math.max(1, Math.ceil(allImages.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageImages  = allImages.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 6) {
      toast.error('Max 6 images per batch');
      e.target.value = null;
      setFiles([]);
    } else {
      setFiles(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return toast.error('Select at least one image');
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await api.post('/gallery/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await Promise.all(res.data.urls.map(url => api.post('/gallery', { imageUrl: url, caption })));
      toast.success(`✅ ${res.data.urls.length} image(s) added`);
      setFiles([]);
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = null;
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Image removed');
      fetchGallery();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-display font-black text-theme-black uppercase tracking-tight">Look Book</h1>
          <p className="mt-1 text-gray-400 font-medium">
            {allImages.length} image{allImages.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="bg-white border-2 border-gray-200 p-6 mb-8 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-2">
          <ImagePlus size={16} /> Batch Upload (max 6 at once)
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Images</label>
            <input
              type="file" multiple accept="image/*" required
              onChange={handleFileSelect} ref={fileInputRef}
              className="w-full border-2 border-dashed border-gray-300 p-3 hover:border-theme-black transition cursor-pointer text-sm bg-gray-50"
            />
            {files.length > 0 && <p className="text-xs text-theme-black font-bold mt-1">{files.length} file(s) selected</p>}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Caption (optional)</label>
            <input
              type="text" placeholder="e.g. Summer Collection 2026"
              value={caption} onChange={e => setCaption(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 bg-gray-50 focus:bg-white focus:border-theme-black outline-none text-sm"
            />
          </div>
          <button
            type="submit" disabled={uploading || !files.length}
            className="bg-theme-black text-theme-yellow px-8 py-3 font-black uppercase tracking-widest hover:bg-theme-yellow hover:text-theme-black border-2 border-theme-black transition disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? 'Uploading…' : 'Upload Batch'}
          </button>
        </div>
      </form>

      {/* Grid */}
      {allImages.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 py-24 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest">No images yet. Upload your first batch above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pageImages.map(img => (
              <div key={img._id} className="relative group overflow-hidden border-2 border-gray-100 aspect-square bg-gray-50">
                <img
                  src={img.imageUrl} alt={img.caption || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=60'; }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="self-end bg-red-500 text-white p-1.5 hover:bg-red-600 transition shadow-lg"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  {img.caption && (
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest line-clamp-1 drop-shadow">{img.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 text-sm font-black uppercase tracking-widest hover:border-theme-black disabled:opacity-30 transition"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 text-sm font-black border-2 transition ${n === safePage ? 'bg-theme-black text-theme-yellow border-theme-black' : 'border-gray-200 hover:border-theme-black'}`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 text-sm font-black uppercase tracking-widest hover:border-theme-black disabled:opacity-30 transition"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
          <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">
            Page {safePage} of {totalPages} · {allImages.length} total images
          </p>
        </>
      )}
    </div>
  );
};

export default GalleryAdmin;
