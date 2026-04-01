import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

const linkVariants = {
  wiggle: {
    rotate: [0, -2, 2, -2, 2, 0],
    scale: 1.1,
    transition: { 
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  const shopName    = settings?.shopName    || 'Perfect';
  const address     = settings?.address     || 'Mumbai, Maharashtra, India';
  const email       = settings?.contactEmail || 'contact@perfectmenswear.com';
  const contactNum  = settings?.contactNumber  || '9988776655';
  const about      = settings?.aboutText?.substring(0, 160) || 'Premium quality innerwear, casuals & formals curated for the modern man. 100+ trusted brands. Fast enquiry via WhatsApp.';

  return (
    <footer className="bg-theme-black text-white border-t-4 border-theme-yellow">


      {/* ── Main footer body ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand block */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <span className="text-4xl font-display font-black text-white uppercase tracking-tight">
                {shopName}<span className="text-theme-yellow">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">{about}</p>

            {/* Contact pills */}
            <div className="space-y-3">
              <motion.a 
                whileHover="wiggle"
                variants={linkVariants}
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-theme-yellow transition-colors text-sm group w-fit">
                <span className="w-8 h-8 bg-white/5 group-hover:bg-theme-yellow/10 flex items-center justify-center shrink-0 transition-colors">
                  <MapPin size={14} className="text-theme-yellow" />
                </span>
                <span>{address}</span>
              </motion.a>
              <motion.a 
                whileHover="wiggle"
                variants={linkVariants}
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-theme-yellow transition-colors text-sm group w-fit">
                <span className="w-8 h-8 bg-white/5 group-hover:bg-theme-yellow/10 flex items-center justify-center shrink-0 transition-colors">
                  <Mail size={14} className="text-theme-yellow" />
                </span>
                <span>{email}</span>
              </motion.a>

              {/* ── Phone number (contactNumber) ── */}
              {contactNum && (
                <motion.a 
                  whileHover="wiggle"
                  variants={linkVariants}
                  href={`tel:+91${contactNum}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-theme-yellow transition-colors text-sm group w-fit">
                  <span className="w-8 h-8 bg-white/5 group-hover:bg-theme-yellow/10 flex items-center justify-center shrink-0 transition-colors">
                    <Phone size={14} className="text-theme-yellow" />
                  </span>
                  <span>+91 {contactNum}</span>
                </motion.a>
              )}

            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home',      to: '/'        },
                { label: 'Gallery',   to: '/shop'    },
                { label: 'Look Book', to: '/gallery' },
                { label: 'About Us',  to: '/about'   },
                { label: 'Contact',   to: '/contact' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <motion.div whileHover="wiggle" variants={linkVariants} className="w-fit">
                    <Link to={to}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-theme-yellow transition-colors font-medium group">
                      <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-theme-yellow" />
                      {label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Categories</h4>
            <ul className="space-y-3">
              {[
                'Innerwear',
                'Casual Wear',
                'Formal Shirts',
                'Trousers',
                'Active Wear',
                'Accessories',
              ].map(cat => (
                <li key={cat}>
                  <motion.div whileHover="wiggle" variants={linkVariants} className="w-fit">
                    <Link to={`/shop`}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-theme-yellow transition-colors font-medium group">
                      <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-theme-yellow" />
                      {cat}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Top Brands</h4>
            <div className="flex flex-wrap gap-2">
              {['Jockey', 'U.S. Polo', 'XYXX', 'Lux', 'Dollar', 'Van Heusen', 'Arrow', 'Peter England', 'Raymond', 'Allen Solly', 'Louis Philippe', 'Puma'].map(brand => (
                <motion.div key={brand} whileHover="wiggle" variants={linkVariants}>
                  <Link to="/shop"
                    className="px-3 py-1.5 border border-white/10 text-gray-500 text-[11px] font-bold uppercase tracking-widest hover:border-theme-yellow hover:text-theme-yellow transition-colors block">
                    {brand}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {shopName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <motion.span whileHover="wiggle" variants={linkVariants} className="text-xs text-gray-600 font-bold uppercase tracking-widest hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</motion.span>
            <span className="text-gray-700">·</span>
            <motion.span whileHover="wiggle" variants={linkVariants} className="text-xs text-gray-600 font-bold uppercase tracking-widest hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</motion.span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
