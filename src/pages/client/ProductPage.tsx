import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Award, ArrowLeft, Plus, Minus } from 'lucide-react';
import Layout from '../../components/Layout';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatPrice, getMadAmount } from '../../utils/currency';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const foundProduct = products.find((p: Product) => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-stone-800 mb-4">Produit non trouvé</h1>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la boutique</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    // Could add a toast notification here
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à la boutique</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {product.certifiedOrganic && (
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-2 rounded-full text-sm flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Certifié Bio</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-emerald-600 mb-4">
                {formatPrice(product.price)}
              </p>
              <p className="text-stone-600 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-stone-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Origine:</span>
                <span className="font-medium text-stone-800">📍 {product.origin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Stock disponible:</span>
                <span className="font-medium text-stone-800">{product.stock} unités</span>
              </div>
              {product.certifiedOrganic && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Certification:</span>
                  <span className="font-medium text-emerald-600 flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Agriculture Biologique</span>
                  </span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-stone-700 font-medium">Quantité:</span>
                <div className="flex items-center border border-stone-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-800"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-stone-800 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-stone-600 hover:text-stone-800"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    product.stock === 0
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                  </span>
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isInWishlist(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-stone-300 text-stone-600 hover:border-red-500 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {product.stock > 0 && (
                <p className="text-sm text-stone-500">
                  Total: {formatPrice(product.price * quantity)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;