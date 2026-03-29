import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../api';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          api.get('/settings'),
          api.get('/products/featured')
        ]);
        setSettings(settingsRes.data);
        setFeaturedProducts(productsRes.data.slice(0, 4)); // Get first 4 featured
      } catch (error) {
        console.error('Error fetching home data', error);
      }
    };
    fetchData();
  }, []);

  const bannerImg = settings?.homeBanners?.[0] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04';

  return (
    <div className="animate-fade-in">
      <SEO 
        title="Home" 
        description="Premium Mens Wear in Mumbai. Shop formal shirts, casuals, and premium innerwear." 
        name={settings?.shopName || 'Perfect Mens Wear'}
      />
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[90vh] flex items-center justify-center banner-overlay"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            {settings?.shopName || 'Discover Style'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Elevate your wardrobe with our latest premium collection.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="group relative">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-200">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 font-medium">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category?.name}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {featuredProducts.length === 0 && (
          <p className="text-center text-gray-500">No featured products available.</p>
        )}
      </div>

      {/* About Section */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {settings?.aboutText || 'We are a premium clothing brand dedicated to outfitting you in style...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
