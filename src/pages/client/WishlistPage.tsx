import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import { Product } from '../../types';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/currency';

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filteredProducts = products.filter((product: Product) => 
      items.includes(product.id)
    );
    setWishlistProducts(filteredProducts);
  }, [items]);

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  if (wishlistProducts.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-stone-800 mb-4">
              Votre liste de souhaits est vide
            </h1>
            <p className="text-stone-600 mb-8">
              Ajoutez des produits à votre liste de souhaits pour les retrouver facilement
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">
          Ma Liste de Souhaits
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-stone-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-xs text-stone-500 mb-3">
                  📍 {product.origin}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-emerald-600">
                      {formatPrice(product.price)}
                    </span>
                    <p className="text-xs text-stone-500">
                      Stock: {product.stock}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      product.stock === 0
                        ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {product.stock === 0 ? 'Rupture' : 'Ajouter'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;