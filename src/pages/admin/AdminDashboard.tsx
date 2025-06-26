import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, DollarSign, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Order, Product, User } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatPrice, getMadAmount } from '../../utils/currency';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    // Load data
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');

    setOrders(storedOrders);
    setProducts(storedProducts);
    setUsers(storedUsers);

    // Generate revenue data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const revenueByDay = last7Days.map(date => {
      const dayOrders = storedOrders.filter((order: Order) =>
        order.createdAt.split('T')[0] === date && order.status !== 'cancelled'
      );
      const revenue = dayOrders.reduce((sum: number, order: Order) => sum + getMadAmount(order.total), 0);
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        revenue
      };
    });
    setRevenueData(revenueByDay);

    // Generate category sales data
    const categoryStats = storedCategories.map((category: any) => {
      const categoryProducts = storedProducts.filter((p: Product) => p.category === category.id);
      const totalSold = storedOrders.reduce((sum: number, order: Order) => {
        return sum + order.items.reduce((itemSum: number, item: any) => {
          const product = categoryProducts.find(p => p.id === item.productId);
          return product ? itemSum + item.quantity : itemSum;
        }, 0);
      }, 0);
      
      return {
        name: category.name,
        value: totalSold
      };
    }).filter(cat => cat.value > 0);
    
    setCategoryData(categoryStats);
  }, []);

  const totalRevenue = orders.reduce((sum, order) =>
    order.status !== 'cancelled' ? sum + getMadAmount(order.total) : sum, 0
  );

  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  const mostSoldProduct = products.reduce((max, product) => {
    const sold = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => {
        return item.productId === product.id ? itemSum + item.quantity : itemSum;
      }, 0);
    }, 0);
    
    return sold > (max.sold || 0) ? { ...product, sold } : max;
  }, {} as any);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const COLORS = ['#059669', '#0891b2', '#7c3aed', '#dc2626', '#ea580c'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>
            <p className="text-stone-600">Vue d'ensemble de votre boutique de délices secs marocains</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir le site web
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-stone-800">
                  {totalRevenue.toFixed(2)} DH
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Commandes</p>
                <p className="text-2xl font-bold text-stone-800">
                  {totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Utilisateurs</p>
                <p className="text-2xl font-bold text-stone-800">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Produits</p>
                <p className="text-2xl font-bold text-stone-800">
                  {products.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Évolution du chiffre d'affaires (7 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} DH`, 'Chiffre d\'affaires']} />
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Ventes par catégorie
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Sold Product */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Produit le plus vendu
            </h3>
            {mostSoldProduct.name ? (
              <div className="flex items-center space-x-4">
                <img
                  src={mostSoldProduct.image}
                  alt={mostSoldProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-stone-800">{mostSoldProduct.name}</p>
                  <p className="text-stone-600">{mostSoldProduct.sold} unités vendues</p>
                  <p className="text-emerald-600 font-semibold">{formatPrice(mostSoldProduct.price)}</p>
                </div>
              </div>
            ) : (
              <p className="text-stone-500">Aucune vente enregistrée</p>
            )}
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Alertes stock</span>
            </h3>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-stone-800">{product.name}</span>
                    <span className="text-orange-600 font-medium">
                      {product.stock} restant{product.stock > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
                {lowStockProducts.length > 3 && (
                  <p className="text-stone-500 text-sm">
                    +{lowStockProducts.length - 3} autres produits
                  </p>
                )}
              </div>
            ) : (
              <p className="text-green-600">Tous les produits sont bien approvisionnés</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800">
              Commandes récentes
            </h3>
          </div>
          <div className="divide-y divide-stone-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 flex items-center justify-between">
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
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;