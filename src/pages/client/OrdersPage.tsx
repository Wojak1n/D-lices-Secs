import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Clock, FileText, Package } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { Order } from '../../types';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('orderSuccess')) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter((order: Order) => order.userId === user.id);
      setOrders(userOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-stone-800 mb-4">
              Veuillez vous connecter pour accéder à vos commandes
            </h1>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Votre commande a été passée avec succès !
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Mes Commandes
          </h1>
          <p className="text-stone-600">
            Suivez l'état de vos commandes et consultez votre historique d'achats
          </p>
        </div>

        {/* Orders Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Total des commandes</p>
                <p className="text-2xl font-bold text-stone-800">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Commandes en cours</p>
                <p className="text-2xl font-bold text-stone-800">
                  {orders.filter(order => ['pending', 'confirmed', 'shipped'].includes(order.status)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Commandes livrées</p>
                <p className="text-2xl font-bold text-stone-800">
                  {orders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-800 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Historique des commandes</span>
            </h2>
          </div>

          {orders.length > 0 ? (
            <div className="divide-y divide-stone-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-stone-800 font-medium">
                        Commande #{order.id}
                      </p>
                      <p className="text-stone-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-stone-800 font-semibold mt-1">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="text-stone-800 font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                      <p className="text-stone-600 text-sm">
                        📍 {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                      </p>
                      {order.status === 'confirmed' && (
                        <Link
                          to={`/order-ticket?orderId=${order.id}`}
                          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Voir le ticket</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-600 mb-4">
                Vous n'avez encore passé aucune commande
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Découvrir nos produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
