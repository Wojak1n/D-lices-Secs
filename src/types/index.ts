export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  description: string;
  image: string;
  category: string;
  origin: string;
  stock: number;
  certifiedOrganic: boolean;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId?: string;
  packId?: string;
  quantity: number;
  type: 'product' | 'pack';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  walletBalance: number;
  totalSpent: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryType: 'standard' | 'express' | 'pickup';
  deliveryPrice: number;
  estimatedDelivery: string;
  createdAt: string;
  confirmedAt?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod?: 'card' | 'cash' | 'delivery' | 'wallet';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface PackItem {
  productId: string;
  quantity: number;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  image: string;
  items: PackItem[];
  originalPrice: number;
  packPrice: number;
  discount: number;
  stock: number;
  featured: boolean;
  createdAt: string;
}