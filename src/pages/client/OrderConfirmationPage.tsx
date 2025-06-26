import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { Order, Product, Pack } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice, getMadAmount } from '../../utils/currency';

const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);


  const orderId = searchParams.get('orderId');



  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    // Load order data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId && (user ? o.userId === user.id : o.userId.startsWith('guest-')));

    if (!foundOrder) {
      navigate('/');
      return;
    }

    setOrder(foundOrder);

    // Load products and packs
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const storedPacks = JSON.parse(localStorage.getItem('packs') || '[]');
    setProducts(storedProducts);
    setPacks(storedPacks);
  }, [orderId, user, navigate]);

  const getItemDetails = (item: any) => {
    if (item.productName.startsWith('Pack:')) {
      const pack = packs.find(p => p.id === item.productId);
      return { type: 'pack', data: pack, name: item.productName.replace('Pack: ', '') };
    } else {
      const product = products.find(p => p.id === item.productId);
      return { type: 'product', data: product, name: item.productName };
    }
  };



  if (!order) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-stone-600">Chargement de votre commande...</p>
          </div>
        </div>
      </Layout>
    );
  }



  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Confirmation de Commande
          </h1>
          <p className="text-stone-600">
            Commande #{order.id} • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                Récapitulatif de la commande
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const itemDetails = getItemDetails(item);
                  
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-stone-200 rounded-lg">
                      {itemDetails.data && (
                        <img
                          src={itemDetails.data.image}
                          alt={itemDetails.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-stone-800">{itemDetails.name}</h3>
                          {itemDetails.type === 'pack' && (
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                              Pack
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 text-sm">Quantité: {item.quantity}</p>
                        {itemDetails.type === 'pack' && itemDetails.data && (
                          <p className="text-stone-500 text-xs">
                            {(itemDetails.data as Pack).items.length} produits inclus
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-stone-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-stone-200 pt-4 mt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Sous-total:</span>
                  <span>{order.total.toFixed(2)} DH</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">
                Adresse de livraison
              </h2>
              <div className="text-stone-600">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Guest Information */}
            {order.guestInfo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">
                  Informations client
                </h2>
                <div className="text-stone-600">
                  <p>{order.guestInfo.firstName} {order.guestInfo.lastName}</p>
                  <p>{order.guestInfo.email}</p>
                  <p>{order.guestInfo.phone}</p>
                </div>
              </div>
            )}

            {/* Test Website Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-emerald-800 mb-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Commande confirmée !</span>
              </div>
              <p className="text-emerald-700 text-sm mb-4">
                Votre commande a été enregistrée avec succès. Dans un vrai site e-commerce,
                vous recevriez un email de confirmation et pourriez suivre votre livraison.
              </p>
              <div className="bg-white rounded-lg p-4 border border-emerald-200">
                <p className="text-stone-600 text-sm">
                  🧪 <strong>Site de démonstration</strong> - Aucun paiement réel n'a été effectué.
                  Cette commande est uniquement à des fins de test.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/order-ticket?orderId=${order.id}`)}
                className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                📄 Voir le ticket de commande
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-stone-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 bg-stone-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
