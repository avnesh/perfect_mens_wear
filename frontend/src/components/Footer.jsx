import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {}
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              {settings?.shopName || 'Shop'}
            </h3>
            <p className="mt-4 text-gray-400 text-sm">
              {settings?.aboutText?.substring(0, 100)}...
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shop" className="hover:text-purple-400 transition">All Products</Link></li>
              <li><Link to="/gallery" className="hover:text-purple-400 transition">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>{settings?.address || '123 Shop Street'}</li>
              <li>Email: {settings?.contactEmail || 'contact@shop.com'}</li>
              <li>WhatsApp: {settings?.whatsappNumber || '+1234567890'}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.shopName || 'Shop'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
