import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (brand) params.append('brand', brand);
      if (size) params.append('size', size);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('page', page);
      params.append('limit', 12);
      
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Reset to page 1 if any filter other than page changes
    setPage(1);
  }, [searchQuery, selectedCategory, brand, size, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, brand, size, minPrice, maxPrice, page]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setBrand('');
    setSize('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SEO 
        title="Shop Collection" 
        description="Browse our extensive collection of Men's clothing, from classic shirts to innerwear." 
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shop All ({totalItems})</h1>
        <button 
          className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-medium"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><Filter size={18} /> Filters</h2>
              {showFilters && <button onClick={() => setShowFilters(false)} className="md:hidden text-gray-500"><X size={20} /></button>}
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 text-sm bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. US Polo"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 text-sm"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 text-sm bg-white"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="">Any Size</option>
                  {['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium pt-2 transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link key={product._id} to={`/product/${product._id}`} className="group relative bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-50 flex flex-col">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 flex-shrink-0 relative">
                      {product.brand && (
                        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm border border-gray-100/50">
                          {product.brand}
                        </div>
                      )}
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-4 px-2 flex-col flex-1 flex justify-between">
                      <div>
                        <h3 className="text-md text-gray-900 font-semibold line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap text-xs text-gray-500">
                            Sizes: {product.sizes.join(', ')}
                          </div>
                        )}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-1">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {products.length === 0 && (
                <div className="text-center py-32 text-gray-500 bg-white rounded-2xl border border-gray-100">
                  <div className="mb-4 flex justify-center"><Search className="text-gray-300" size={48} /></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matching products</h3>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                  <button onClick={clearFilters} className="mt-6 bg-purple-100 text-purple-700 px-6 py-2 rounded-lg font-medium hover:bg-purple-200 transition">
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-max mx-auto">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)} 
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-purple-600 disabled:opacity-50 transition font-medium"
                  >
                    Previous
                  </button>
                  <div className="text-sm font-medium text-gray-600">
                    Page <span className="text-gray-900 font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
                  </div>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)} 
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-purple-600 disabled:opacity-50 transition font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
