import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import AnimatePage from './components/AnimatePage';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import About from './pages/About';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import AdminOrders from './pages/admin/Orders';
import HomepageAdmin from './pages/admin/HomepageAdmin';
import AboutPageAdmin from './pages/admin/AboutPageAdmin';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen font-black uppercase tracking-widest text-gray-400">Authenticating...</div>;
  if (!user || (!user.isAdmin && user.isAdmin !== undefined)) return <Navigate to="/admin/login" />;
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AnimatePage><Home /></AnimatePage>} />
          <Route path="shop" element={<AnimatePage><Shop /></AnimatePage>} />
          <Route path="product/:id" element={<AnimatePage><ProductDetail /></AnimatePage>} />
          <Route path="gallery" element={<AnimatePage><Gallery /></AnimatePage>} />
          <Route path="about" element={<AnimatePage><About /></AnimatePage>} />
          <Route path="contact" element={<AnimatePage><Contact /></AnimatePage>} />
        </Route>

        <Route path="/admin/login" element={<AnimatePage><AdminLogin /></AnimatePage>} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AnimatePage><Dashboard /></AnimatePage>} />
          <Route path="products" element={<AnimatePage><Products /></AnimatePage>} />
          <Route path="products/new" element={<AnimatePage><ProductForm /></AnimatePage>} />
          <Route path="products/edit/:id" element={<AnimatePage><ProductForm /></AnimatePage>} />
          <Route path="categories" element={<AnimatePage><Categories /></AnimatePage>} />
          <Route path="orders" element={<AnimatePage><AdminOrders /></AnimatePage>} />
          <Route path="settings" element={<AnimatePage><Settings /></AnimatePage>} />
          <Route path="gallery" element={<AnimatePage><GalleryAdmin /></AnimatePage>} />
          <Route path="homepage" element={<AnimatePage><HomepageAdmin /></AnimatePage>} />
          <Route path="about" element={<AnimatePage><AboutPageAdmin /></AnimatePage>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
