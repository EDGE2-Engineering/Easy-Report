
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
            <div className="relative h-64 overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.status === 'In Stock'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {product.status}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {product.category}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-primary">₹{product.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/ {product.weight}</span>
                    </div>

                    <Link to={`/product/${product.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary-dark text-white rounded-full">
                            <Info className="w-4 h-4 mr-1" /> Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
