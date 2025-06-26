import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product, Order, OrderItem } from '../types';

const TopSellers = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');

    // Calculate sales for each product
    const productSales: { [key: string]: number } = {};

    storedOrders.forEach((order: Order) => {
      if (order.status !== 'cancelled') {
        order.items.forEach((item: OrderItem) => {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        });
      }
    });

    // Sort products by sales and get top sellers
    const productsWithSales = storedProducts.map((product: Product) => ({
      ...product,
      totalSold: productSales[product.id] || 0
    }));

    // Sort by sales (descending) and then by featured status
    const sortedProducts = productsWithSales.sort((a: Product & { totalSold: number }, b: Product & { totalSold: number }) => {
      if (b.totalSold !== a.totalSold) {
        return b.totalSold - a.totalSold;
      }
      // If sales are equal, prioritize featured products
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    // Get top 4 products
    setTopProducts(sortedProducts.slice(0, 4));
  }, []);

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Nos Meilleures Ventes
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Les produits préférés de nos clients, sélectionnés pour leur qualité exceptionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;