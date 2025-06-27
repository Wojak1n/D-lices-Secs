import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Flower2,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LeafLogo from './LeafLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    try {
      logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin/login', { replace: true });
    }
  };

  // Redirect to login if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isLoading && !admin) {
      navigate('/admin/login', { replace: true });
    }
  }, [admin, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Produits', path: '/admin/products' },
    { icon: Gift, label: 'Pack Cadeaux', path: '/admin/packs' },
    { icon: ShoppingBag, label: 'Commandes', path: '/admin/orders' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className={`bg-stone-800 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64 fixed md:relative z-50 h-full' : 'w-0 md:w-64'} overflow-hidden relative flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center">
            <LeafLogo size={56} className="text-emerald-400" />
            <span className="text-xl font-bold -ml-3">Délices Secs Admin</span>
          </div>
        </div>

        <nav className="mt-8 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors ${
                  isActive ? 'bg-stone-700 text-white border-r-4 border-emerald-400' : ''
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-6 border-t border-stone-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-stone-300 hover:text-white hover:bg-stone-700 rounded-lg transition-colors group"
          >
            <LogOut className="h-5 w-5 group-hover:text-red-400 transition-colors" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-stone-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-800"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <h1 className="text-xl font-semibold text-stone-800">
              Administration Délices Secs
            </h1>
            
            <div className="flex items-center space-x-3">
              <span className="text-stone-600 hidden sm:block">Bonjour, {admin.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Déconnexion</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;