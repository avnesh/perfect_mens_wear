import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <WhatsAppFab />
      <Footer />
    </div>
  );
};

export default MainLayout;
