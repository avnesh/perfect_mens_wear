import React, { useState, useEffect } from 'react';
import api from '../api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        setImages(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Gallery</h1>
        <p className="text-gray-600">Explore our style inspirations and customer outfits.</p>
      </div>

      {loading ? (
        <div className="text-center">Loading gallery...</div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img) => (
            <div key={img._id} className="break-inside-avoid relative group overflow-hidden rounded-2xl">
              <img 
                src={img.imageUrl} 
                alt={img.caption || 'Gallery Image'} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500" 
                loading="lazy" 
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition duration-300">
                  <p className="text-white text-sm">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
          {images.length === 0 && <p className="text-gray-500 w-full text-center">No images in gallery yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Gallery;
