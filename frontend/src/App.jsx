import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

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

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import AdminOrders from './pages/admin/Orders';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || (!user.isAdmin && user.isAdmin !== undefined)) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<Settings />} />
          <Route path="gallery" element={<GalleryAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
