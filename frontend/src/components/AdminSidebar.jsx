import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Grid, Image, Settings, LogOut, Activity, ShoppingBag } from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
    }`;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Admin Panel
        </h2>
      </div>
      
      <nav className="px-4 space-y-2 font-medium">
        <NavLink to="/admin" end className={navClass}>
          <Activity size={20} /> Dashboard
        </NavLink>
        <NavLink to="/admin/orders" className={navClass}>
          <ShoppingBag size={20} /> Orders
        </NavLink>
        <NavLink to="/admin/products" className={navClass}>
          <Package size={20} /> Products
        </NavLink>
        <NavLink to="/admin/categories" className={navClass}>
          <Grid size={20} /> Categories
        </NavLink>
        <NavLink to="/admin/gallery" className={navClass}>
          <Image size={20} /> Gallery
        </NavLink>
        <NavLink to="/admin/settings" className={navClass}>
          <Settings size={20} /> Settings
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="w-full flex flex-row items-center gap-3 px-4 py-3 mt-8 text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
