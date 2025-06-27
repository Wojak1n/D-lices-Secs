import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Leaf, User, X, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showSavedAccounts, setShowSavedAccounts] = useState(true);
  const { login, loginWithSavedAccount, savedAccounts, removeSavedAccount } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, password, rememberMe)) {
      navigate(redirect);
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleSavedAccountLogin = (accountId: string) => {
    setError('');
    if (loginWithSavedAccount(accountId)) {
      navigate(redirect);
    } else {
      setError('Erreur lors de la connexion avec le compte sauvegardé');
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <Leaf className="h-10 w-10 text-emerald-600" />
            <span className="text-3xl font-bold text-stone-800">BioBoutique</span>
          </Link>
          <h2 className="text-3xl font-bold text-stone-800">
            Connexion
          </h2>
          <p className="mt-2 text-stone-600">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Saved Accounts Section */}
        {savedAccounts.length > 0 && showSavedAccounts && (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-stone-800">Comptes sauvegardés</h3>
              <button
                onClick={() => setShowSavedAccounts(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {savedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer group"
                  onClick={() => handleSavedAccountLogin(account.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        {account.firstName} {account.lastName}
                      </p>
                      <p className="text-xs text-stone-500">{account.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-xs text-stone-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatLastLogin(account.lastLogin)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedAccount(account.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-stone-200">
              <p className="text-xs text-stone-500 text-center">
                Cliquez sur un compte pour vous connecter rapidement
              </p>
            </div>
          </div>
        )}

        {/* Show saved accounts button if hidden */}
        {savedAccounts.length > 0 && !showSavedAccounts && (
          <button
            onClick={() => setShowSavedAccounts(true)}
            className="w-full text-center py-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Afficher les comptes sauvegardés ({savedAccounts.length})
          </button>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-stone-700 font-medium mb-2">
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
                  className="pl-10 w-full border border-stone-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-stone-700 font-medium mb-2">
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
                  className="pl-10 w-full border border-stone-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-700">
                Se souvenir de moi
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-500">
                Mot de passe oublié ?
              </Link>
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

          <div className="text-center">
            <p className="text-stone-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm font-medium mb-2">Démonstration:</p>
            <p className="text-blue-700 text-xs">
              Utilisez n'importe quel email et le mot de passe: <strong>123456</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;