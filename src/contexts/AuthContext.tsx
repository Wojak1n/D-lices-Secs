import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin } from '../types';

interface SavedAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isLoading: boolean;
  savedAccounts: SavedAccount[];
  login: (email: string, password: string, rememberMe?: boolean) => boolean;
  loginWithSavedAccount: (accountId: string) => boolean;
  adminLogin: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'walletBalance' | 'totalSpent' | 'createdAt'>) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  removeSavedAccount: (accountId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }

    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error parsing saved admin:', error);
        localStorage.removeItem('currentAdmin');
      }
    }

    // Load saved accounts
    const savedAccountsData = localStorage.getItem('savedAccounts');
    if (savedAccountsData) {
      try {
        setSavedAccounts(JSON.parse(savedAccountsData));
      } catch (error) {
        console.error('Error parsing saved accounts:', error);
        localStorage.removeItem('savedAccounts');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (email: string, password: string, rememberMe: boolean = false) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);

    if (foundUser && password === '123456') { // Simple password for demo
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));

      // Save account if "Remember Me" is checked
      if (rememberMe) {
        saveAccount(foundUser);
      }

      return true;
    }
    return false;
  };

  const saveAccount = (user: User) => {
    const newSavedAccount: SavedAccount = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      lastLogin: new Date().toISOString()
    };

    const updatedAccounts = savedAccounts.filter(acc => acc.id !== user.id);
    updatedAccounts.unshift(newSavedAccount); // Add to beginning

    // Keep only last 5 accounts
    const limitedAccounts = updatedAccounts.slice(0, 5);

    setSavedAccounts(limitedAccounts);
    localStorage.setItem('savedAccounts', JSON.stringify(limitedAccounts));
  };

  const loginWithSavedAccount = (accountId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.id === accountId);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));

      // Update last login time
      saveAccount(foundUser);

      return true;
    }
    return false;
  };

  const removeSavedAccount = (accountId: string) => {
    const updatedAccounts = savedAccounts.filter(acc => acc.id !== accountId);
    setSavedAccounts(updatedAccounts);
    localStorage.setItem('savedAccounts', JSON.stringify(updatedAccounts));
  };

  const adminLogin = (email: string, password: string) => {
    if (email === 'admin@delices-secs.ma' && password === 'admin123') {
      const adminUser = {
        id: 'admin1',
        email: 'admin@delices-secs.ma',
        name: 'Administrateur Délices Secs'
      };
      setAdmin(adminUser);
      localStorage.setItem('currentAdmin', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'walletBalance' | 'totalSpent' | 'createdAt'>) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: User) => u.email === userData.email)) {
      return false; // Email already exists
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      walletBalance: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      isLoading,
      savedAccounts,
      login,
      loginWithSavedAccount,
      adminLogin,
      register,
      logout,
      updateUser,
      removeSavedAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};