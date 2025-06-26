import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, Gift } from 'lucide-react';
import Layout from '../../components/Layout';
import { Product, Pack, Order, OrderItem, CartItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice, getMadAmount } from '../../utils/currency';

interface CartItemWithData extends CartItem {
  product?: Product;
  pack?: Pack;
}

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemWithData[]>([]);
  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'Maroc'
  });
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [useWallet, setUseWallet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'delivery'>('card');
  const [processing, setProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(!user);

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
  }, [items, user, navigate]);

  const subtotal = cartItems.reduce((sum, item) => {
    if (item.type === 'product' && item.product) {
      return sum + (getMadAmount(item.product.price) * item.quantity);
    } else if (item.type === 'pack' && item.pack) {
      return sum + (getMadAmount(item.pack.packPrice) * item.quantity);
    }
    return sum;
  }, 0);
  const shipping = subtotal > getMadAmount(50) ? 0 : getMadAmount(5.99);
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate shipping information
    if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.postalCode) {
      alert('Veuillez remplir toutes les informations de livraison');
      return;
    }

    // Validate guest information if user is not logged in
    if (isGuest && (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone)) {
      alert('Veuillez remplir toutes vos informations personnelles');
      return;
    }

    setProcessing(true);

    // Check if using wallet and has sufficient balance (only for logged-in users)
    if (useWallet && user && getMadAmount(user.walletBalance) < total) {
      alert('Solde insuffisant dans votre portefeuille');
      setProcessing(false);
      return;
    }

    try {
      // Create order items for both products and packs
      const orderItems: OrderItem[] = cartItems.map(item => {
        if (item.type === 'product' && item.product) {
          return {
            productId: item.productId!,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          };
        } else if (item.type === 'pack' && item.pack) {
          return {
            productId: item.packId!, // Use packId as productId for order tracking
            productName: `Pack: ${item.pack.name}`,
            quantity: item.quantity,
            price: item.pack.packPrice
          };
        }
        // Fallback (shouldn't happen)
        return {
          productId: 'unknown',
          productName: 'Unknown Item',
          quantity: item.quantity,
          price: 0
        };
      });

      const order: Order = {
        id: Date.now().toString(),
        userId: user ? user.id : 'guest-' + Date.now(),
        items: orderItems,
        total,
        status: 'confirmed', // Automatically confirm for test website
        deliveryType: 'standard',
        deliveryPrice: 0,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
        createdAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        shippingAddress: shippingInfo,
        guestInfo: isGuest ? guestInfo : undefined,
        paymentMethod: useWallet ? 'wallet' : paymentMethod
      };

      // Process wallet payment if selected
      if (useWallet && user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex].walletBalance -= total / 10.5; // Convert MAD to EUR
          users[userIndex].totalSpent += total / 10.5;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }

      // Save order
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart
      clearCart();

      // Redirect to order confirmation page
      navigate(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      alert('Erreur lors du traitement de la commande');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-stone-800 mb-4">
              Panier vide
            </h1>
            <p className="text-stone-600">
              Ajoutez des produits à votre panier pour passer une commande
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Guest Information */}
              {isGuest && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-stone-800 mb-4">
                    Informations personnelles
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={guestInfo.firstName}
                        onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={guestInfo.lastName}
                        onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-4 flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Adresse de livraison</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-stone-700 font-medium mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-stone-700 font-medium mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-4 flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Mode de paiement</span>
                </h2>
                
                <div className="space-y-4">
                  {user && user.walletBalance > 0 && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useWallet"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="mr-3"
                      />
                      <label htmlFor="useWallet" className="text-stone-700">
                        Utiliser mon portefeuille ({formatPrice(user!.walletBalance)})
                        {getMadAmount(user!.walletBalance) < total && (
                          <span className="text-red-600 text-sm ml-2">
                            (Solde insuffisant)
                          </span>
                        )}
                      </label>
                    </div>
                  )}
                  
                  {!useWallet && (
                    <div className="space-y-3">
                      <p className="text-stone-700 font-medium">Choisissez votre mode de paiement :</p>

                      {/* Card Payment */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-stone-300'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium text-stone-800">💳 Paiement par carte bancaire</p>
                            <p className="text-stone-600 text-sm">Visa, Mastercard, CIH Bank (simulation)</p>
                          </div>
                        </div>
                      </div>

                      {/* Cash Payment */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-stone-300'
                        }`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium text-stone-800">💵 Paiement en espèces</p>
                            <p className="text-stone-600 text-sm">Paiement en liquide lors de la réception</p>
                          </div>
                        </div>
                      </div>

                      {/* Cash on Delivery */}
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'delivery' ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-stone-300'
                        }`}
                        onClick={() => setPaymentMethod('delivery')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="delivery"
                            checked={paymentMethod === 'delivery'}
                            onChange={() => setPaymentMethod('delivery')}
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium text-stone-800">🚚 Paiement à la livraison</p>
                            <p className="text-stone-600 text-sm">Payez en espèces lors de la livraison</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                Récapitulatif de commande
              </h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => {
                  const isProduct = item.type === 'product' && item.product;
                  const isPack = item.type === 'pack' && item.pack;
                  const itemKey = isProduct ? item.productId : item.packId;

                  return (
                    <div key={itemKey} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-stone-800">
                            {isProduct ? item.product!.name : item.pack!.name}
                          </p>
                          {isPack && (
                            <div className="flex items-center space-x-1">
                              <Gift className="h-4 w-4 text-emerald-600" />
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                                Pack
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-stone-600 text-sm">Quantité: {item.quantity}</p>
                        {isPack && (
                          <p className="text-stone-500 text-xs">
                            {item.pack!.items.length} produit{item.pack!.items.length > 1 ? 's' : ''} inclus
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-stone-800">
                          {isProduct
                            ? formatPrice(item.product!.price * item.quantity)
                            : formatPrice(item.pack!.packPrice * item.quantity)
                          }
                        </p>
                        {isPack && (
                          <p className="text-stone-400 line-through text-sm">
                            {formatPrice(item.pack!.originalPrice * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-stone-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">Sous-total:</span>
                  <span className="text-stone-800">{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Livraison:</span>
                  <span className="text-stone-800">
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} DH`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-stone-800 border-t pt-2">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Paiement sécurisé</span>
              </div>
              <p className="text-emerald-700 text-sm mt-2">
                Vos données de paiement sont protégées par un cryptage SSL 256 bits.
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Traitement...' : `💳 Payer ${total.toFixed(2)} DH (Test)`}
            </button>

            <p className="text-center text-stone-500 text-sm mt-2">
              🧪 Site de démonstration - Aucun paiement réel ne sera effectué
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;