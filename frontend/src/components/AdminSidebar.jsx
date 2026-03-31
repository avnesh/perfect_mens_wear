import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Grid, Image, Settings, LogOut, Activity, ShoppingBag, LayoutDashboard } from 'lucide-react';

const AdminSidebar = () => {
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
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto flex flex-col">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-2xl font-display font-black text-theme-black uppercase tracking-tight">
          Admin<span className="text-theme-yellow text-3xl leading-none">.</span>
        </h2>
      </div>
      
      <nav className="flex-1 py-6 space-y-1 font-bold text-sm tracking-wide uppercase">
        <NavLink to="/admin" end className={navClass}>
          <Activity size={20} strokeWidth={2.5} /> Dashboard
        </NavLink>
        <NavLink to="/admin/orders" className={navClass}>
          <ShoppingBag size={20} strokeWidth={2.5} /> Orders
        </NavLink>
        <NavLink to="/admin/products" className={navClass}>
          <Package size={20} strokeWidth={2.5} /> Products
        </NavLink>
        <NavLink to="/admin/categories" className={navClass}>
          <Grid size={20} strokeWidth={2.5} /> Categories
        </NavLink>
        <NavLink to="/admin/homepage" className={navClass}>
          <LayoutDashboard size={20} strokeWidth={2.5} /> Homepage
        </NavLink>
        <NavLink to="/admin/gallery" className={navClass}>
          <Image size={20} strokeWidth={2.5} /> Look Book
        </NavLink>
        <NavLink to="/admin/settings" className={navClass}>
          <Settings size={20} strokeWidth={2.5} /> Settings
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100">
         <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-none transition font-bold uppercase tracking-widest text-xs"
         >
            <LogOut size={18} strokeWidth={3} /> Logout
         </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
