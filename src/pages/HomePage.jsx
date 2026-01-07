import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import DynamicSection from '@/components/DynamicSection';
import { useProducts } from '@/contexts/ProductsContext';
import { useSiteContent } from '@/lib/useSiteContent';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { getPageSections } = useSiteContent();
  const pageSections = getPageSections('home');
  const { products } = useProducts();  // Hook for products
  const [activeCategory, setActiveCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  // Internal component for the Product Grid
  const ProductGridSection = () => (
    <div id="products" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our range of pure, chemical-free products directly from nature.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? "bg-primary text-white hover:bg-primary-dark" : "text-gray-600 border-gray-300"}
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-2">Try selecting a different category.</p>
        </div>
      )}

      <div className="mt-16 text-center bg-green-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-green-900 mb-4">Wholesale & Bulk Orders</h3>
        <p className="text-green-800 mb-6">
          Running a restaurant or store? We supply bulk quantities at special rates.
        </p>
        <Link to="/contact">
          <Button className="bg-green-700 text-white hover:bg-green-800">
            Contact for Bulk Pricing <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>EDGE2 MTR | Pure & Organic Products</title>
        <meta name="description" content="Shop for premium organic Ghee, Honey, Oils and more from EDGE2 MTR. 100% pure and chemical-free." />
      </Helmet>

      <Navbar />

      {/* Render Dynamic Sections if needed, usually simplified for this refactor */}
      <HeroSection />

      <ProductGridSection />

      <Footer />
    </>
  );
};

export default HomePage;
