import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Gift } from 'lucide-react';
import Layout from '../../components/Layout';
import { Product, Pack, CartItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice, getMadAmount } from '../../utils/currency';

interface CartItemWithProduct extends CartItem {
  product?: Product;
  pack?: Pack;
}

const CartPage: React.FC = () => {
  const { items, updateQuantity, updatePackQuantity, removeFromCart, removePackFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const packs = JSON.parse(localStorage.getItem('packs') || '[]');

    const itemsWithData = items.map(item => {
      if (item.type === 'product') {
        return {
          ...item,
          product: products.find((p: Product) => p.id === item.productId)
        };
      } else if (item.type === 'pack') {
        return {
          ...item,
          pack: packs.find((p: Pack) => p.id === item.packId)
        };
      }
      return item;
    }).filter(item => item.product || item.pack);

    setCartItems(itemsWithData);
  }, [items]);

  const total = cartItems.reduce((sum, item) => {
    if (item.type === 'product' && item.product) {
      return sum + (getMadAmount(item.product.price) * item.quantity);
    } else if (item.type === 'pack' && item.pack) {
      return sum + (getMadAmount(item.pack.packPrice) * item.quantity);
    }
    return sum;
  }, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-stone-800 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-stone-600 mb-8">
              Découvrez nos produits biologiques et ajoutez-les à votre panier
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Parcourir la boutique
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Mon Panier</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {cartItems.map((item) => {
            const isProduct = item.type === 'product' && item.product;
            const isPack = item.type === 'pack' && item.pack;
            const itemKey = isProduct ? item.productId : item.packId;

            return (
              <div key={itemKey} className="flex items-center p-6 border-b border-stone-200 last:border-b-0">
                {/* Item Image */}
                <div className="relative">
                  <img
                    src={isProduct ? item.product!.image : item.pack!.image}
                    alt={isProduct ? item.product!.name : item.pack!.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  {isPack && (
                    <div className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1">
                      <Gift className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 ml-6">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-stone-800">
                      {isProduct ? item.product!.name : item.pack!.name}
                    </h3>
                    {isPack && (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                        Pack Cadeau
                      </span>
                    )}
                  </div>

                  {isProduct && (
                    <p className="text-stone-600 text-sm mb-2">
                      📍 {item.product!.origin}
                    </p>
                  )}

                  {isPack && (
                    <p className="text-stone-600 text-sm mb-2">
                      🎁 {item.pack!.items.length} produit{item.pack!.items.length > 1 ? 's' : ''} inclus
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <p className="text-emerald-600 font-semibold">
                      {isProduct ? formatPrice(item.product!.price) : formatPrice(item.pack!.packPrice)}
                    </p>
                    {isPack && (
                      <>
                        <span className="text-stone-400 line-through text-sm">
                          {formatPrice(item.pack!.originalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          -{item.pack!.discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-stone-300 rounded-lg">
                    <button
                      onClick={() => {
                        if (isProduct) {
                          updateQuantity(item.productId!, item.quantity - 1);
                        } else {
                          updatePackQuantity(item.packId!, item.quantity - 1);
                        }
                      }}
                      className="p-2 text-stone-600 hover:text-stone-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-stone-800 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (isProduct) {
                          updateQuantity(item.productId!, item.quantity + 1);
                        } else {
                          updatePackQuantity(item.packId!, item.quantity + 1);
                        }
                      }}
                      className="p-2 text-stone-600 hover:text-stone-800"
                      disabled={
                        (isProduct && item.quantity >= item.product!.stock) ||
                        (isPack && item.quantity >= item.pack!.stock)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-semibold text-stone-800">
                      {isProduct
                        ? formatPrice(item.product!.price * item.quantity)
                        : formatPrice(item.pack!.packPrice * item.quantity)
                      }
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      if (isProduct) {
                        removeFromCart(item.productId!);
                      } else {
                        removePackFromCart(item.packId!);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-stone-800">Total:</span>
            <span className="text-2xl font-bold text-emerald-600">
              {total.toFixed(2)} DH
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={clearCart}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Vider le panier
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Passer la commande
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;