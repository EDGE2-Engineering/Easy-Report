import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import { CartProvider } from '@/contexts/CartContext';
import HomePage from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import BlogPage from '@/pages/BlogPage';
import BlogDetailPage from '@/pages/BlogDetailPage';
import AdminPage from '@/pages/AdminPage';
import CartPage from '@/pages/CartPage';
import FloatingButtons from '@/components/FloatingButtons';

function App() {
  return (
    <HelmetProvider>
      <SiteSettingsProvider>
        <ProductsProvider>
          <CartProvider>
            <Router>
              <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
              </Helmet>
              <div className="min-h-screen bg-[#F5F1ED]">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
                <FloatingButtons />
                <Toaster />
              </div>
            </Router>
          </CartProvider>
        </ProductsProvider>
      </SiteSettingsProvider>
    </HelmetProvider>
  );
}

export default App;
