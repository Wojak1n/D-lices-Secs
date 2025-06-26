import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Users, Download } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Order, Product, User, Category } from '../../types';
import { formatPrice, getMadAmount } from '../../utils/currency';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');

    setOrders(storedOrders);
    setProducts(storedProducts);
    setUsers(storedUsers);
    setCategories(storedCategories);
  };

  // Economic Insights
  const calculateInventoryTurnover = () => {
    const totalSold = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageInventory = products.reduce((sum, product) => sum + product.stock, 0) / products.length;
    return averageInventory > 0 ? (totalSold / averageInventory).toFixed(2) : '0';
  };

  const calculateGrossProfit = () => {
    return orders.reduce((total, order) => {
      return total + order.items.reduce((itemTotal, item) => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const profit = getMadAmount(product.price - product.costPrice) * item.quantity;
          return itemTotal + profit;
        }
        return itemTotal;
      }, 0);
    }, 0);
  };

  const getRevenueData = () => {
    const days = parseInt(timeRange);
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toISOString().split('T')[0];
    });

    return dateRange.map(date => {
      const dayOrders = orders.filter(order => 
        order.createdAt.split('T')[0] === date && order.status !== 'cancelled'
      );
      const revenue = dayOrders.reduce((sum, order) => sum + getMadAmount(order.total), 0);
      const orderCount = dayOrders.length;
      
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        revenue,
        orders: orderCount
      };
    });
  };

  const getCategoryAnalytics = () => {
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category.id);
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => {
          const product = categoryProducts.find(p => p.id === item.productId);
          return product ? itemSum + (getMadAmount(product.price) * item.quantity) : itemSum;
        }, 0);
      }, 0);
      
      const totalSold = orders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => {
          const product = categoryProducts.find(p => p.id === item.productId);
          return product ? itemSum + item.quantity : itemSum;
        }, 0);
      }, 0);

      return {
        name: category.name,
        revenue: totalRevenue,
        sold: totalSold
      };
    }).filter(cat => cat.revenue > 0);
  };

  const getTopProducts = () => {
    const productSales = products.map(product => {
      const sold = orders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => {
          return item.productId === product.id ? itemSum + item.quantity : itemSum;
        }, 0);
      }, 0);
      
      const revenue = sold * getMadAmount(product.price);
      const profit = sold * getMadAmount(product.price - product.costPrice);
      
      return {
        ...product,
        sold,
        revenue,
        profit
      };
    }).filter(p => p.sold > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return productSales;
  };

  const getCustomerSegmentation = () => {
    const segments = [
      { name: 'Nouveaux clients', min: 0, max: 50, color: '#3B82F6' },
      { name: 'Clients réguliers', min: 50, max: 200, color: '#10B981' },
      { name: 'Clients VIP', min: 200, max: Infinity, color: '#F59E0B' }
    ];

    return segments.map(segment => {
      const count = users.filter(user => 
        user.totalSpent >= segment.min && user.totalSpent < segment.max
      ).length;
      
      return {
        name: segment.name,
        value: count,
        color: segment.color
      };
    });
  };

  const exportToCSV = () => {
    const csvData = [
      ['Date', 'Commandes', 'Chiffre d\'affaires', 'Profit brut'],
      ...getRevenueData().map(day => [
        day.date,
        day.orders,
        day.revenue.toFixed(2),
        // Calculate daily profit (simplified)
        (day.revenue * 0.3).toFixed(2) // Assuming 30% margin
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const revenueData = getRevenueData();
  const categoryData = getCategoryAnalytics();
  const topProducts = getTopProducts();
  const customerSegments = getCustomerSegmentation();
  const totalRevenue = orders.reduce((sum, order) => order.status !== 'cancelled' ? sum + getMadAmount(order.total) : sum, 0);
  const grossProfit = calculateGrossProfit();
  const inventoryTurnover = calculateInventoryTurnover();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Analytics & Insights</h1>
            <p className="text-stone-600">Analyses économiques et insights business</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">90 derniers jours</option>
            </select>
            <button
              onClick={exportToCSV}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        {/* Economic KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Profit brut</p>
                <p className="text-2xl font-bold text-stone-800">
                  {grossProfit.toFixed(2)} DH
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-stone-600 text-sm">Rotation stock</p>
                <p className="text-2xl font-bold text-stone-800">
                  {inventoryTurnover}x
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
                <p className="text-stone-600 text-sm">Panier moyen</p>
                <p className="text-2xl font-bold text-stone-800">
                  {orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0'} DH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">
            Évolution du chiffre d'affaires
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `${value} DH` : value,
                  name === 'revenue' ? 'Chiffre d\'affaires' : 'Commandes'
                ]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance & Customer Segmentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Performance par catégorie
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} DH`, 'Chiffre d\'affaires']} />
                <Bar dataKey="revenue" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Segmentation clientèle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800">
              Top 5 des produits les plus rentables
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Produit</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Vendus</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Chiffre d'affaires</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Profit brut</th>
                  <th className="text-left py-3 px-6 font-medium text-stone-800">Marge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {topProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <span className="font-medium text-stone-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {product.sold} unités
                    </td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {product.revenue.toFixed(2)} DH
                    </td>
                    <td className="py-4 px-6 font-semibold text-emerald-600">
                      {product.profit.toFixed(2)} DH
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-stone-600">
                        {((product.profit / product.revenue) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;