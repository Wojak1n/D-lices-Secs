import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Apple, Leaf, Gift, Wheat, Milk, Coffee } from 'lucide-react';
import { Category, Product } from '../types';

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  '1': Apple,      // Fruits & Légumes
  '2': Wheat,      // Céréales & Graines
  '3': Milk,       // Produits Laitiers
  '4': Leaf,       // Épices & Herbes
  '5': Gift,       // Huiles & Vinaigres
  '6': Coffee      // Thés & Infusions
};

// Color schemes for categories
const categoryStyles: { [key: string]: { color: string; textColor: string; image: string } } = {
  '1': {
    color: 'from-green-100 to-green-200',
    textColor: 'text-green-700',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  '2': {
    color: 'from-amber-100 to-amber-200',
    textColor: 'text-amber-700',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  '3': {
    color: 'from-blue-100 to-blue-200',
    textColor: 'text-blue-700',
    image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  '4': {
    color: 'from-emerald-100 to-emerald-200',
    textColor: 'text-emerald-700',
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  '5': {
    color: 'from-yellow-100 to-yellow-200',
    textColor: 'text-yellow-700',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600'
  },
  '6': {
    color: 'from-stone-100 to-stone-200',
    textColor: 'text-stone-700',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
};

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setCategories(storedCategories);
    setProducts(storedProducts);
  }, []);

  // Get product count for a category
  const getProductCount = (categoryId: string) => {
    const count = products.filter(product => product.category === categoryId).length;
    return `${count} produit${count !== 1 ? 's' : ''}`;
  };

  // Get featured categories (limit to 3 for display)
  const featuredCategories = categories.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Nos Catégories Phares
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Explorez notre sélection soigneusement choisie de produits biologiques de qualité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((category) => {
            const IconComponent = categoryIcons[category.id] || Apple;
            const styles = categoryStyles[category.id] || categoryStyles['1'];

            return (
              <div
                key={category.id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={styles.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${styles.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${styles.color}`}>
                        <IconComponent className={`h-6 w-6 ${styles.textColor}`} />
                      </div>
                      <span className="ml-3 text-sm font-medium text-stone-500">{getProductCount(category.id)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-stone-900 mb-2">{category.name}</h3>
                    <p className="text-stone-600 mb-4">{category.description}</p>

                    <Link
                      to={`/shop?category=${category.id}`}
                      className={`${styles.textColor} font-semibold hover:underline flex items-center group`}
                    >
                      Voir tous les produits
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;