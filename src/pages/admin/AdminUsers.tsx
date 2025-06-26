import React, { useState, useEffect } from 'react';
import { Search, Eye, Crown } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { User, Order } from '../../types';
import { formatPrice } from '../../utils/currency';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalSpent');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, sortBy]);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setUsers(storedUsers);
    setOrders(storedOrders);
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort users
    switch (sortBy) {
      case 'totalSpent':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'name':
        filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
        break;
      case 'email':
        filtered.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'createdAt':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredUsers(filtered);
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getUserOrderCount = (userId: string) => {
    return getUserOrders(userId).length;
  };

  const getUserProductCount = (userId: string) => {
    const userOrders = getUserOrders(userId);
    return userOrders.reduce((total, order) => 
      total + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0
    );
  };

  const getTopSpenders = () => {
    return [...users]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Gestion des Utilisateurs</h1>
          <p className="text-stone-600">Gérez vos clients et analysez leurs comportements d'achat</p>
        </div>

        {/* Top Spenders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <span>Top 5 des meilleurs clients</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {getTopSpenders().map((user, index) => (
              <div key={user.id} className="text-center p-4 bg-stone-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-amber-600' :
                  'bg-stone-400'
                }`}>
                  {index + 1}
                </div>
                <p className="font-medium text-stone-800 text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-emerald-600 font-semibold">{formatPrice(user.totalSpent)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="totalSpent">Trier par dépenses</option>
                <option value="name">Trier par nom</option>
                <option value="email">Trier par email</option>
                <option value="createdAt">Trier par date d'inscription</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Utilisateur</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Email</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Total dépensé</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Commandes</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Produits achetés</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Inscription</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-stone-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-stone-600 text-sm">
                          Portefeuille: {formatPrice(user.walletBalance)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-emerald-600">
                        {formatPrice(user.totalSpent)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {getUserOrderCount(user.id)}
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {getUserProductCount(user.id)}
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-xl font-semibold text-stone-800">
                  Profil de {selectedUser.firstName} {selectedUser.lastName}
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatPrice(selectedUser.totalSpent)}
                    </p>
                    <p className="text-emerald-700 text-sm">Total dépensé</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(selectedUser.walletBalance)}
                    </p>
                    <p className="text-blue-700 text-sm">Portefeuille</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {getUserOrderCount(selectedUser.id)}
                    </p>
                    <p className="text-purple-700 text-sm">Commandes</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {getUserProductCount(selectedUser.id)}
                    </p>
                    <p className="text-orange-700 text-sm">Produits</p>
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-lg font-medium text-stone-800 mb-3">Informations personnelles</h3>
                  <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Inscription:</span> {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <h3 className="text-lg font-medium text-stone-800 mb-3">Commandes récentes</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {getUserOrders(selectedUser.id)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((order) => (
                        <div key={order.id} className="bg-stone-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-stone-800">Commande #{order.id}</p>
                              <p className="text-stone-600 text-sm">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-stone-800">{formatPrice(order.total)}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status === 'pending' ? 'En attente' :
                                 order.status === 'shipped' ? 'Expédiée' :
                                 order.status === 'delivered' ? 'Livrée' : 'Annulée'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default AdminUsers;