import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  addPackToCart: (packId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  removePackFromCart: (packId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePackQuantity: (packId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (productId: string, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === productId && item.type === 'product');
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId && item.type === 'product'
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity, type: 'product' as const }];
    });
  };

  const addPackToCart = (packId: string, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.packId === packId && item.type === 'pack');
      if (existingItem) {
        return prev.map(item =>
          item.packId === packId && item.type === 'pack'
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { packId, quantity, type: 'pack' as const }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => !(item.productId === productId && item.type === 'product')));
  };

  const removePackFromCart = (packId: string) => {
    setItems(prev => prev.filter(item => !(item.packId === packId && item.type === 'pack')));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems(prev =>
        prev.map(item =>
          item.productId === productId && item.type === 'product' ? { ...item, quantity } : item
        )
      );
    }
  };

  const updatePackQuantity = (packId: string, quantity: number) => {
    if (quantity <= 0) {
      removePackFromCart(packId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.packId === packId && item.type === 'pack' ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      addPackToCart,
      removeFromCart,
      removePackFromCart,
      updateQuantity,
      updatePackQuantity,
      clearCart,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};