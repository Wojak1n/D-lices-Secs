import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  login: (email: string, password: string) => boolean;
  adminLogin: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'walletBalance' | 'totalSpent' | 'createdAt'>) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser && password === '123456') { // Simple password for demo
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
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
      login,
      adminLogin,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};