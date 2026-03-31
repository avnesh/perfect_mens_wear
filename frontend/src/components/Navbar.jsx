import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ShoppingCart, Search, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ENABLE_ECOMMERCE } from '../config';
import api from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchRef = useRef(null);

  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Use cached settings from localStorage to avoid "SHOP" flash on refresh
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('siteSettings');
      return cached ? JSON.parse(cached) : { shopName: '' };
    } catch {
      return { shopName: '' };
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
        // Cache for instant load on next refresh
        localStorage.setItem('siteSettings', JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  // Close search on route change
  useEffect(() => {
    setShowSearch(false);
    setSearchInput('');
    setIsOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    setShowSearch(false);
    setSearchInput('');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/shop' },
    { name: 'Look Book', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-display font-black tracking-tighter uppercase text-theme-black">
            {settings.logo ? <img src={settings.logo} alt="Logo" className="h-10" /> : <ShoppingBag className="text-theme-yellow fill-theme-yellow" size={28} />}
            {settings.shopName}
          </Link>
          
          {/* Desktop Links (Center) */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-sm font-bold tracking-wide uppercase transition-all duration-300 relative group ${
                  location.pathname === link.path 
                    ? 'text-theme-black' 
                    : 'text-gray-500 hover:text-theme-black'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-theme-yellow transform origin-left transition-transform duration-300 ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </div>

          {/* Icons (Right) */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className={`text-theme-black hover:text-theme-yellow transition-colors ${showSearch ? 'text-theme-yellow' : ''}`}
              aria-label="Search"
            >
              <Search size={22} strokeWidth={2} />
            </button>
            <Link to="/admin/login" className="text-theme-black hover:text-theme-yellow transition-colors"><User size={22} strokeWidth={2} /></Link>
            
            {ENABLE_ECOMMERCE && (
                <>
                  <button className="text-theme-black hover:text-theme-yellow transition-colors"><Heart size={22} strokeWidth={2} /></button>
                  <button onClick={() => navigate('/checkout')} className="relative p-2 text-theme-black hover:text-theme-yellow transition-colors group">
                    <ShoppingCart size={22} strokeWidth={2} />
                    {cartItemsCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-black text-theme-black transform translate-x-1/4 -translate-y-1/4 bg-theme-yellow rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="text-theme-black hover:text-theme-yellow transition-colors"
              aria-label="Search"
            >
              <Search size={22} strokeWidth={2} />
            </button>
            {ENABLE_ECOMMERCE && (
                <button onClick={() => navigate('/checkout')} className="relative p-1 text-theme-black">
                  <ShoppingCart size={24} strokeWidth={2} />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-theme-black transform translate-x-1/4 -translate-y-1/4 bg-theme-yellow rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-theme-black hover:text-gray-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      <div className={`w-full bg-white border-t border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products by name, brand..."
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 focus:border-theme-black outline-none font-medium text-sm bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <button 
            type="submit"
            className="bg-theme-black text-theme-yellow px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-theme-yellow hover:text-theme-black transition-colors border-2 border-theme-black whitespace-nowrap"
          >
            Search
          </button>
          <button 
            type="button" 
            onClick={() => { setShowSearch(false); setSearchInput(''); }}
            className="text-gray-400 hover:text-theme-black transition-colors p-1"
          >
            <X size={20} />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full animate-slide-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="block px-4 py-3 text-base font-bold text-theme-black uppercase tracking-wide hover:bg-gray-50 hover:pl-6 transition-all rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-6 px-4 pt-4 mt-2 border-t border-gray-100 justify-start">
               <Link to="/admin/login" className="text-theme-black hover:text-theme-yellow"><User size={24} /></Link>
               {ENABLE_ECOMMERCE && <button className="text-theme-black hover:text-theme-yellow"><Heart size={24} /></button>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
