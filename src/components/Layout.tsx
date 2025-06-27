import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flower2, ShoppingCart, Heart, User, Search, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect, useRef } from 'react';
import LeafLogo from './LeafLogo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll animation for admin button
  useEffect(() => {
    const handleScroll = () => {
      setShowAdminButton(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Hide button after 3 seconds of no scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        setShowAdminButton(false);
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-stone-50 to-amber-50 shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <LeafLogo size={64} className="text-emerald-600" />
              <span className="text-2xl font-bold text-stone-800 -ml-4">Délices Secs</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/shop" className="text-stone-700 hover:text-emerald-600 transition-colors">
                Produits
              </Link>
              <Link to="/categories" className="text-stone-700 hover:text-emerald-600 transition-colors">
                Catégories
              </Link>
              <Link to="/pack-cadeaux" className="text-stone-700 hover:text-emerald-600 transition-colors">
                Pack Cadeaux
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <Link to="/wishlist" className="relative p-2 text-stone-700 hover:text-emerald-600 transition-colors">
                <Heart className="h-6 w-6" />
              </Link>
              
              <Link to="/cart" className="relative p-2 text-stone-700 hover:text-emerald-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 text-stone-700 hover:text-emerald-600 transition-colors rounded-lg hover:bg-stone-50"
                  >
                    <User className="h-6 w-6" />
                    <span className="hidden lg:block">{user.firstName}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50 transition-all duration-200 ${
                    isProfileDropdownOpen
                      ? 'opacity-100 visible transform translate-y-0'
                      : 'opacity-0 invisible transform -translate-y-2'
                  }`}>
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-sm font-medium text-stone-800">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Mon Compte</span>
                      </div>
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Mes Commandes</span>
                      </div>
                    </Link>

                    <div className="border-t border-stone-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Se Déconnecter</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-stone-700 hover:text-emerald-600 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/shop"
                className="block py-2 text-stone-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                to="/categories"
                className="block py-2 text-stone-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
              <Link
                to="/pack-cadeaux"
                className="block py-2 text-stone-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Pack Cadeaux
              </Link>
              <Link
                to="/cart"
                className="block py-2 text-stone-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Panier ({getTotalItems()})
              </Link>
              <Link
                to="/wishlist"
                className="block py-2 text-stone-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Liste de Souhaits
              </Link>
              {user ? (
                <div className="border-t border-stone-200 pt-2 mt-2">
                  <div className="px-2 py-2 bg-stone-50 rounded-lg mb-2">
                    <p className="text-sm font-medium text-stone-800">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-stone-500">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-stone-700 hover:text-emerald-600 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Mon Compte</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-stone-700 hover:text-emerald-600 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Mes Commandes</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700 flex items-center space-x-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Se Déconnecter</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-stone-700 hover:text-emerald-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-stone-700 hover:text-emerald-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <LeafLogo size={48} className="text-emerald-400" />
                <span className="text-xl font-bold -ml-3">Délices Secs</span>
              </div>
              <p className="text-stone-300">
                Votre boutique de délices secs de confiance, pour une alimentation saine et savoureuse.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-stone-300">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Produits</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Catégories</Link></li>
                <li><Link to="/pack-cadeaux" className="hover:text-white transition-colors">Pack Cadeaux</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Panier</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Compte</h3>
              <ul className="space-y-2 text-stone-300">
                <li><Link to="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">S'inscrire</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Mon Compte</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="text-stone-300 space-y-2">
                <p>📧 contact@delices-secs.ma</p>
                <p>📞 +212 5 37 12 34 56</p>
                <p>📍 Avenue Mohammed V, Rabat, Maroc</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-300">
            <p>&copy; 2024 BioBoutique. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Floating Admin Access Button */}
      <Link
        to="/admin/login"
        className={`fixed bottom-6 right-6 bg-stone-800 hover:bg-stone-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 z-50 group ${
          showAdminButton
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Accès Administration"
      >
        <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </div>
  );
};

export default Layout;