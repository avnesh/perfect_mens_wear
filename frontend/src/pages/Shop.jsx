import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import api from '../api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();

  // Filters State
  // Initialize searchQuery from URL param (?search=) set by Navbar
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Sync URL ?search= param into searchQuery state on every navigation
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchQuery(urlSearch);
  }, [searchParams]);
  
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
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 md:py-16 bg-white mix-blend-normal">
      <SEO 
        title="Gallery | Premium Fashion" 
        description="Browse our extensive collection of premium clothing." 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-theme-black uppercase tracking-tight">Complete Gallery</h1>
          <p className="mt-2 text-gray-400 font-medium">Showing {totalItems} items</p>
        </div>
        <button 
          className="md:hidden flex items-center justify-center gap-2 bg-theme-black text-white px-6 py-3 font-bold uppercase tracking-widest w-full hover:bg-theme-yellow hover:text-theme-black transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-28 space-y-8 pr-4">
            <div className="flex items-center justify-between lg:hidden mb-6 border-b pb-4">
              <h2 className="text-xl font-display font-black uppercase tracking-widest"><Filter size={20} className="inline mr-2" /> Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-theme-black"><X size={24} /></button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Find products..."
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-theme-black focus:ring-0 transition-colors text-sm font-medium outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Category</label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-theme-black focus:ring-0 transition-colors text-sm font-medium outline-none cursor-pointer appearance-none rounded-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Brand</label>
              <input
                type="text"
                placeholder="e.g. US Polo"
                className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-theme-black focus:ring-0 transition-colors text-sm font-medium outline-none"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? '' : s)}
                    className={`h-10 w-12 border-2 text-xs font-bold transition-colors ${
                      size === s ? 'border-theme-black bg-theme-black text-white' : 'border-gray-100 text-gray-500 hover:border-theme-black hover:text-theme-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Price Range</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-theme-black focus:ring-0 transition-colors text-sm font-medium outline-none text-center"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-gray-300 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-theme-black focus:ring-0 transition-colors text-sm font-medium outline-none text-center"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-theme-black py-4 text-xs font-bold uppercase tracking-widest transition-colors mt-8"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
               <div className="w-12 h-12 border-4 border-theme-yellow border-t-theme-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-200">
                  <div className="mb-4 flex justify-center"><Search className="text-gray-300" size={48} /></div>
                  <h3 className="text-xl font-display font-black text-gray-900 mb-2 uppercase">No matches found</h3>
                  <p className="text-gray-500 font-medium">Try adjusting your filters to find what you're looking for.</p>
                  <button onClick={clearFilters} className="mt-8 bg-theme-black text-theme-yellow px-8 py-4 font-bold uppercase tracking-widest hover:bg-theme-yellow hover:text-theme-black transition">
                    Clear Filters
                  </button>
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
