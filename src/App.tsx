import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Import data
import { initializeData, updateData } from './data/mockData';

// Import client pages
import HomePage from './pages/client/HomePage';
import CategoriesPage from './pages/client/CategoriesPage';

// Simple test component to check if Layout works
const TestHomePage = () => {
  console.log('🧪 TestHomePage is rendering...');
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f9ff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#0369a1',
          marginBottom: '20px'
        }}>
          🧪 LAYOUT TEST
        </h1>
        <p style={{ color: '#0c4a6e', marginBottom: '15px' }}>
          If you see this, the Layout component is working!
        </p>
        <div style={{ fontSize: '0.875rem', color: '#075985' }}>
          <p>✅ App component loaded</p>
          <p>✅ Contexts loaded</p>
          <p>✅ Router working</p>
          <p>✅ Layout component working</p>
        </div>
      </div>
    </div>
  );
};
import ShopPage from './pages/client/ShopPage';
import PackCadeauxPage from './pages/client/PackCadeauxPage';
import CartPage from './pages/client/CartPage';
import LoginPage from './pages/client/LoginPage';
import RegisterPage from './pages/client/RegisterPage';
import ProductPage from './pages/client/ProductPage';
import CheckoutPage from './pages/client/CheckoutPage';
import UserDashboard from './pages/client/UserDashboard';
import WishlistPage from './pages/client/WishlistPage';
import OrderConfirmationPage from './pages/client/OrderConfirmationPage';
import OrderTicketPage from './pages/client/OrderTicketPage';

// Import admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPacks from './pages/admin/AdminPacks';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  console.log('🚀 App component rendering...');

  useEffect(() => {
    try {
      console.log('🔄 Initializing data...');
      initializeData();
      // Force update to include new products
      updateData();
      console.log('✅ Data initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing data:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-stone-50">
              <Routes>
                {/* Client Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/pack-cadeaux" element={<PackCadeauxPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/order-ticket" element={<OrderTicketPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/packs" element={<AdminPacks />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
              </Routes>
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;