import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Order, User } from '../../types';
import { formatPrice } from '../../utils/currency';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadData = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setOrders(storedOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setUsers(storedUsers);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserName(order.userId, order).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserEmail(order.userId, order).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getUserName = (userId: string, order?: Order) => {
    if (userId.startsWith('guest-') && order?.guestInfo) {
      return `${order.guestInfo.firstName} ${order.guestInfo.lastName} (Invité)`;
    }
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
  };

  const getUserEmail = (userId: string, order?: Order) => {
    if (userId.startsWith('guest-') && order?.guestInfo) {
      return order.guestInfo.email;
    }
    const user = users.find(u => u.id === userId);
    return user?.email || 'Email inconnu';
  };

  const isGuestUser = (userId: string) => {
    return userId.startsWith('guest-');
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Gestion des Commandes</h1>
          <p className="text-stone-600">Suivez et gérez toutes les commandes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro de commande ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Commande</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Client</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Total</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Statut</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-stone-800">#{order.id}</p>
                      <p className="text-stone-600 text-sm">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-stone-800">{getUserName(order.userId, order)}</p>
                        {isGuestUser(order.userId) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Invité
                          </span>
                        )}
                      </div>
                      <p className="text-stone-600 text-sm">{getUserEmail(order.userId, order)}</p>
                      {isGuestUser(order.userId) && order.guestInfo?.phone && (
                        <p className="text-stone-600 text-sm">📞 {order.guestInfo.phone}</p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-stone-800">{formatPrice(order.total)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-xl font-semibold text-stone-800">
                  Détails de la commande #{selectedOrder.id}
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-medium text-stone-800 mb-3">Informations client</h3>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="font-medium text-stone-800">{getUserName(selectedOrder.userId)}</p>
                    <p className="text-stone-600">{getUserEmail(selectedOrder.userId)}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-stone-800 mb-3">Adresse de livraison</h3>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="text-stone-800">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-stone-800">
                      {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-stone-800">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-stone-800 mb-3">Articles commandés</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-stone-50 rounded-lg p-4">
                        <div>
                          <p className="font-medium text-stone-800">{item.productName}</p>
                          <p className="text-stone-600 text-sm">Quantité: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-stone-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-stone-200 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-stone-800">Total:</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-lg font-medium text-stone-800 mb-3">Statut de la commande</h3>
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="pending">En attente</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;