import React, { useState } from 'react';
import { Gift, ShoppingCart, Heart, Star } from 'lucide-react';
import { Pack, Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatPrice } from '../utils/currency';

interface PackCardProps {
  pack: Pack;
  products: Product[];
}

const PackCard: React.FC<PackCardProps> = ({ pack, products }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const { addPackToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handleAddToCart = async () => {
    if (pack.stock === 0) return;

    setAddingToCart(true);

    try {
      // Check if all products in the pack are available
      const unavailableProducts: string[] = [];

      for (const item of pack.items) {
        const product = getProductById(item.productId);
        if (!product) {
          unavailableProducts.push(`Produit ID: ${item.productId}`);
        } else if (product.stock < item.quantity) {
          unavailableProducts.push(`${product.name} (stock insuffisant: ${product.stock} disponible, ${item.quantity} requis)`);
        }
      }

      if (unavailableProducts.length > 0) {
        console.warn('Pack unavailable:', unavailableProducts);
        return;
      }

      // Add pack to cart as a single item
      addPackToCart(pack.id, 1);

    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(pack.id)) {
      removeFromWishlist(pack.id);
    } else {
      addToWishlist(pack.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Pack Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={pack.image}
          alt={pack.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {pack.featured && (
          <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            <Star className="h-4 w-4 inline mr-1" />
            Populaire
          </div>
        )}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          -{pack.discount}%
        </div>
      </div>

      {/* Pack Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-stone-800 mb-2">{pack.name}</h3>
        <p className="text-stone-600 mb-4 line-clamp-2">{pack.description}</p>

        {/* Pack Items */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-stone-700 mb-2">Contenu du pack:</h4>
          <div className="space-y-1">
            {pack.items.slice(0, 3).map((item) => {
              const product = getProductById(item.productId);
              return product ? (
                <div key={item.productId} className="flex justify-between text-sm text-stone-600">
                  <span>{product.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ) : null;
            })}
            {pack.items.length > 3 && (
              <div className="text-sm text-stone-500 italic">
                +{pack.items.length - 3} autres produits...
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg text-stone-400 line-through">
              {formatPrice(pack.originalPrice)}
            </span>
            <span className="text-2xl font-bold text-emerald-600">
              {formatPrice(pack.packPrice)}
            </span>
          </div>
          <p className="text-sm text-emerald-600 font-semibold">
            Économisez {formatPrice(pack.originalPrice - pack.packPrice)}
          </p>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {pack.stock > 0 ? (
            <p className="text-sm text-stone-600">
              Stock: {pack.stock} disponible{pack.stock > 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold">Rupture de stock</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={pack.stock === 0 || addingToCart}
            className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {addingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>{pack.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}</span>
              </>
            )}
          </button>
          <button
            onClick={handleWishlistToggle}
            className={`p-3 rounded-lg border-2 transition-colors ${
              isInWishlist(pack.id)
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-stone-300 text-stone-600 hover:border-red-500 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(pack.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackCard;
