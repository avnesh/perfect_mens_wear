import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({ shopName: 'Shop' });
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {settings.logo ? <img src={settings.logo} alt="Logo" className="h-8" /> : <ShoppingBag className="text-purple-600" />}
            {settings.shopName}
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-purple-600 font-medium transition">Shop</Link>
            <Link to="/gallery" className="text-gray-700 hover:text-purple-600 font-medium transition">Gallery</Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 font-medium transition">Contact</Link>
            <button onClick={() => navigate('/checkout')} className="relative p-2 text-gray-700 hover:text-purple-600 transition">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-purple-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg overflow-hidden transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md">Home</Link>
            <Link to="/shop" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md">Shop</Link>
            <Link to="/gallery" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md">Gallery</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md">Contact</Link>
            <Link to="/checkout" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md">
              Cart ({cartItemsCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
