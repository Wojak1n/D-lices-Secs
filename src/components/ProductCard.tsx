import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Award } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.certifiedOrganic && (
            <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <Award className="h-3 w-3" />
              <span>BIO</span>
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isInWishlist(product.id)
                ? 'bg-red-100 text-red-600'
                : 'bg-white/80 text-stone-600 hover:bg-red-100 hover:text-red-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-stone-800 mb-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-stone-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <p className="text-xs text-stone-500 mb-3">📍 {product.origin}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-emerald-600">
                {formatPrice(product.price)}
              </span>
              <p className="text-xs text-stone-500">
                Stock: {product.stock}
              </p>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`p-2 rounded-lg transition-colors ${
                product.stock === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;