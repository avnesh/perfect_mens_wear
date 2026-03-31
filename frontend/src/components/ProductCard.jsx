import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ENABLE_ECOMMERCE } from '../config';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const mainImage = product.images?.[0] || 'https://via.placeholder.com/400x500';
  const hoverImage = product.images?.[1] || mainImage;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Defaulting to first available size or 'M' for quick add
    if(ENABLE_ECOMMERCE) {
       addToCart(product, 1, product.sizes?.[0] || 'M'); 
    }
  }

  return (
    <Link to={`/product/${product._id}`} className="group relative block overflow-hidden bg-white">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          loading="lazy"
        />
        <img
          src={hoverImage}
          alt={`${product.name} alternate view`}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick Add Overlay */}
        {ENABLE_ECOMMERCE && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/95 p-4 transition-transform duration-300 group-hover:translate-y-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-theme-black text-white py-3 px-4 font-bold text-sm tracking-widest uppercase hover:bg-theme-yellow hover:text-black transition-colors"
            >
              <ShoppingCart size={18} strokeWidth={2} /> Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-theme-black line-clamp-1 group-hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{product.category?.name || 'Essential'}</p>
          </div>
          {ENABLE_ECOMMERCE && (
              <p className="text-sm font-black text-theme-black tracking-tight whitespace-nowrap">₹{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
