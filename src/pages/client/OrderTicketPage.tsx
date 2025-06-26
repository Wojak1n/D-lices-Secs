import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Download, Printer, CheckCircle, Package, Truck, MapPin, Calendar, Gift } from 'lucide-react';
import Layout from '../../components/Layout';
import { Order, Product, Pack } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/currency';

const OrderTicketPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!user || !orderId) {
      navigate('/');
      return;
    }

    // Load order data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId && o.userId === user.id);
    
    if (!foundOrder || foundOrder.status !== 'confirmed') {
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

  const getDeliveryInfo = () => {
    if (!order) return null;

    const deliveryTypes = {
      standard: { name: 'Livraison Standard', icon: Truck, description: '3-5 jours ouvrables' },
      express: { name: 'Livraison Express', icon: Truck, description: '24-48h' },
      pickup: { name: 'Retrait en Magasin', icon: MapPin, description: 'Retrait gratuit' }
    };

    return deliveryTypes[order.deliveryType];
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version of the ticket
    const ticketContent = generateTicketText();
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commande-${order?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTicketText = () => {
    if (!order) return '';

    const deliveryInfo = getDeliveryInfo();
    
    return `
BIOBOUTIQUE - TICKET DE COMMANDE
================================

Commande #${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}
Confirmée le: ${order.confirmedAt ? new Date(order.confirmedAt).toLocaleDateString('fr-FR') : 'N/A'}

CLIENT
------
${user?.firstName} ${user?.lastName}
${user?.email}

ADRESSE DE LIVRAISON
-------------------
${order.shippingAddress.street}
${order.shippingAddress.postalCode} ${order.shippingAddress.city}
${order.shippingAddress.country}

ARTICLES COMMANDÉS
-----------------
${order.items.map(item => {
  const details = getItemDetails(item);
  return `${details.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
}).join('\n')}

LIVRAISON
---------
Type: ${deliveryInfo?.name}
Prix: ${order.deliveryPrice === 0 ? 'Gratuite' : formatPrice(order.deliveryPrice)}
Livraison estimée: ${order.estimatedDelivery}

TOTAL
-----
Sous-total: ${formatPrice(order.total - order.deliveryPrice)}
Livraison: ${order.deliveryPrice === 0 ? 'Gratuite' : formatPrice(order.deliveryPrice)}
TOTAL: ${formatPrice(order.total)}

Merci pour votre commande !
    `.trim();
  };

  if (!order) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-stone-600">Chargement de votre ticket...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const deliveryInfo = getDeliveryInfo();
  const DeliveryIcon = deliveryInfo?.icon || Package;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Commande Confirmée !
          </h1>
          <p className="text-stone-600 text-lg">
            Votre commande a été traitée avec succès
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger</span>
          </button>
        </div>

        {/* Order Ticket */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-4">
          {/* Header */}
          <div className="text-center border-b border-stone-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">BIOBOUTIQUE</h2>
            <p className="text-stone-600">Produits biologiques de qualité</p>
            <div className="mt-4">
              <p className="text-lg font-semibold">TICKET DE COMMANDE</p>
              <p className="text-stone-600">Commande #{order.id}</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Informations de commande</h3>
              <div className="space-y-1 text-sm text-stone-600">
                <p>Date: {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                {order.confirmedAt && (
                  <p>Confirmée: {new Date(order.confirmedAt).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                )}
                <p>Statut: <span className="text-green-600 font-medium">Confirmée</span></p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Client</h3>
              <div className="space-y-1 text-sm text-stone-600">
                <p>{user?.firstName} {user?.lastName}</p>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-stone-800 mb-3">Informations de livraison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-2">Adresse</h4>
                <div className="text-sm text-stone-600">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-2">Mode de livraison</h4>
                <div className="flex items-center space-x-2 text-sm text-stone-600">
                  <DeliveryIcon className="h-4 w-4" />
                  <span>{deliveryInfo?.name}</span>
                </div>
                <p className="text-sm text-stone-600 mt-1">{deliveryInfo?.description}</p>
                <div className="flex items-center space-x-2 text-sm text-stone-600 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>Livraison estimée: {order.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-stone-800 mb-3">Articles commandés</h3>
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
                        <h4 className="font-medium text-stone-800">{itemDetails.name}</h4>
                        {itemDetails.type === 'pack' && (
                          <div className="flex items-center space-x-1">
                            <Gift className="h-4 w-4 text-emerald-600" />
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                              Pack Cadeau
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-stone-600 mt-1">
                        <p>Quantité: {item.quantity}</p>
                        <p>Prix unitaire: {formatPrice(item.price)}</p>
                        {itemDetails.type === 'pack' && itemDetails.data && (
                          <p>Contenu: {(itemDetails.data as Pack).items.length} produits inclus</p>
                        )}
                        {itemDetails.type === 'product' && itemDetails.data && (
                          <p>Origine: {(itemDetails.data as Product).origin}</p>
                        )}
                      </div>
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
          </div>

          {/* Total */}
          <div className="border-t border-stone-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total:</span>
                <span>{formatPrice(order.total - order.deliveryPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Livraison:</span>
                <span>{order.deliveryPrice === 0 ? 'Gratuite' : formatPrice(order.deliveryPrice)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-stone-800 border-t pt-2">
                <span>TOTAL:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-stone-200">
            <p className="text-stone-600 text-sm">
              Merci pour votre confiance ! Votre commande sera traitée dans les plus brefs délais.
            </p>
            <p className="text-stone-500 text-xs mt-2">
              Pour toute question, contactez-nous à contact@bioboutique.ma
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retour à mon compte
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTicketPage;