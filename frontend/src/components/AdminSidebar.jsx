import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Grid, Image, Settings, LogOut, Activity, ShoppingBag, LayoutDashboard, X, Info } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 transition-all duration-300 ${
      isActive
        ? 'bg-theme-black text-theme-yellow border-l-[6px] border-theme-yellow shadow-md'
        : 'text-gray-500 hover:bg-gray-50 hover:text-theme-black border-l-[6px] border-transparent'
    }`;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-sm overflow-y-auto flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-display font-black text-theme-black uppercase tracking-tight">
            Admin<span className="text-theme-yellow text-3xl leading-none">.</span>
          </h2>
          <button onClick={onClose} className="lg:hidden p-2 text-theme-black bg-gray-100 rounded-full hover:bg-theme-black hover:text-white transition-all">
             <X size={20} strokeWidth={3} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 font-bold text-sm tracking-wide uppercase">
          {/* Dashboard and Orders commented out as requested */}
          {/* <NavLink to="/admin" end className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <Activity size={20} strokeWidth={2.5} /> Dashboard
          </NavLink>
          <NavLink to="/admin/orders" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <ShoppingBag size={20} strokeWidth={2.5} /> Orders
          </NavLink> */}
          <NavLink to="/admin/products" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <Package size={20} strokeWidth={2.5} /> Products
          </NavLink>
          <NavLink to="/admin/categories" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <Grid size={20} strokeWidth={2.5} /> Categories
          </NavLink>
          <NavLink to="/admin/homepage" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <LayoutDashboard size={20} strokeWidth={2.5} /> Homepage
          </NavLink>
          <NavLink to="/admin/about" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <Info size={20} strokeWidth={2.5} /> About Page
          </NavLink>
          <NavLink to="/admin/gallery" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <Image size={20} strokeWidth={2.5} /> Look Book
          </NavLink>
          <NavLink to="/admin/settings" className={navClass} onClick={() => window.innerWidth < 1024 && onClose()}>
            <Settings size={20} strokeWidth={2.5} /> Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
           <button
             onClick={() => navigate('/')}
             className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-50 text-gray-600 hover:bg-theme-black hover:text-white rounded-none transition font-bold uppercase tracking-widest text-xs border border-gray-200"
           >
             Visit Website
           </button>
           <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-none transition font-bold uppercase tracking-widest text-xs"
           >
              <LogOut size={18} strokeWidth={3} /> Logout
           </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
