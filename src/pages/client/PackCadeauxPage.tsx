import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ShoppingCart, Heart, Star, Package } from 'lucide-react';
import Layout from '../../components/Layout';
import { Pack, Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatPrice } from '../../utils/currency';

const PackCadeauxPage: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { addPackToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadData = () => {
      const storedPacks = JSON.parse(localStorage.getItem('packs') || '[]');
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setPacks(storedPacks);
      setProducts(storedProducts);
      setLoading(false);
    };

    loadData();
  }, []);

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handleAddToCart = async (pack: Pack) => {
    if (pack.stock === 0) return;

    setAddingToCart(pack.id);

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
      setAddingToCart(null);
    }
  };

  const handleWishlistToggle = (packId: string) => {
    if (isInWishlist(packId)) {
      removeFromWishlist(packId);
    } else {
      addToWishlist(packId);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Chargement des packs cadeaux...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Gift className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-stone-800 mb-4">
            Packs Cadeaux
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Découvrez nos coffrets cadeaux soigneusement composés avec nos meilleurs produits biologiques. 
            Des économies garanties et des saveurs authentiques pour faire plaisir à vos proches.
          </p>
        </div>

        {/* Packs Grid */}
        {packs.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Aucun pack cadeau disponible
            </h2>
            <p className="text-stone-600 mb-8">
              Nos packs cadeaux seront bientôt disponibles. Revenez plus tard !
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
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
                      onClick={() => handleAddToCart(pack)}
                      disabled={pack.stock === 0 || addingToCart === pack.id}
                      className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {addingToCart === pack.id ? (
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
                      onClick={() => handleWishlistToggle(pack.id)}
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
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 bg-emerald-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-8">
            Pourquoi choisir nos packs cadeaux ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Gift className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Économies garanties</h3>
              <p className="text-stone-600">Jusqu'à 30% d'économies par rapport aux achats individuels</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Sélection premium</h3>
              <p className="text-stone-600">Nos meilleurs produits biologiques soigneusement sélectionnés</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Emballage cadeau</h3>
              <p className="text-stone-600">Emballage élégant inclus, prêt à offrir</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PackCadeauxPage;
