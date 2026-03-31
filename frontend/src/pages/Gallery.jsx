import React, { useState, useEffect } from 'react';
import api from '../api';
import SEO from '../components/SEO';
import Pagination from '../components/Pagination';
import { Camera } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Gallery = () => {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        setAllImages(data);
      } catch (error) {
        console.error("Failed to load lookbook:", error);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  // Client-side pagination
  const totalPages = Math.ceil(allImages.length / ITEMS_PER_PAGE);
  const images = allImages.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-12 md:py-20 bg-white min-h-[80vh]">
      <SEO title="Look Book | Premium Fashion" description="Browse our curated visual lookbook." />
      
      <div className="text-center mb-16 border-b border-gray-100 pb-12">
        <div className="inline-flex items-center justify-center p-4 bg-theme-black text-theme-yellow rounded-full mb-6 relative">
          <Camera size={40} strokeWidth={1.5} />
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#25D366] rounded-full animate-ping"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-theme-black uppercase mb-4">
          Look Book
        </h1>
        <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
          Curated styles &amp; inspirations
          {allImages.length > 0 && <span className="ml-2 text-theme-yellow">— {allImages.length} pieces</span>}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-theme-yellow border-t-theme-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
              {images.map(img => (
                <div key={img._id} className="relative group overflow-hidden bg-gray-100 aspect-square border-4 border-white shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || 'Lookbook entry'}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 cursor-crosshair"
                    loading="lazy"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-theme-black to-transparent p-4 translate-y-full group-hover:translate-y-0 transition duration-500">
                      <p className="text-theme-yellow font-bold uppercase tracking-widest text-xs drop-shadow-md line-clamp-1">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-bold tracking-widest uppercase">No inspiration items published yet.</p>
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Gallery;
