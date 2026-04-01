import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-xl font-display font-black text-theme-black uppercase tracking-tight">
            Admin<span className="text-theme-yellow text-2xl leading-none">.</span>
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 p-2 text-theme-black hover:bg-gray-50 rounded-md transition-colors border-2 border-transparent active:border-theme-black"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
            <Menu size={24} strokeWidth={3} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
