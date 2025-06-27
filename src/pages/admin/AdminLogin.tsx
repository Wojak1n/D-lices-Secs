import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, Flower2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LeafLogo from '../../components/LeafLogo';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { admin, adminLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && admin) {
      navigate('/admin', { replace: true });
    }
  }, [admin, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (adminLogin(email, password)) {
      navigate('/admin');
    } else {
      setError('Identifiants administrateur incorrects');
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-emerald-100">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <LeafLogo size={64} className="text-emerald-400" />
            <span className="text-3xl font-bold text-white -ml-4">Délices Secs</span>
          </div>
          <div className="bg-stone-700 p-4 rounded-lg mb-6">
            <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">
              Administration
            </h2>
            <p className="mt-2 text-stone-300">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-stone-300 font-medium mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-stone-400"
                  placeholder="admin@delices-secs.ma"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-stone-300 font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-stone-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Se connecter
            </button>
          </div>

          {/* Demo credentials */}
          <div className="bg-stone-700 border border-stone-600 rounded-lg p-4">
            <p className="text-stone-300 text-sm font-medium mb-2">Identifiants de démonstration:</p>
            <p className="text-stone-400 text-xs">
              Email: <strong className="text-white">admin@delices-secs.ma</strong>
            </p>
            <p className="text-stone-400 text-xs">
              Mot de passe: <strong className="text-white">admin123</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;