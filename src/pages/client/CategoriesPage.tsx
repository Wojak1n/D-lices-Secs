import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import Layout from '../../components/Layout';
import { Category, Product } from '../../types';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setCategories(storedCategories);
    setProducts(storedProducts);
  }, []);

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(product => product.category === categoryId).length;
  };

  const getCategoryImage = (categoryId: string) => {
    const categoryImages: { [key: string]: string } = {
      '1': 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600',
      '2': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
      '3': 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600',
      '4': 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=600',
      '5': 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600',
      '6': 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600',
      '7': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600'
    };
    return categoryImages[categoryId] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Catégories
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Explorez les trésors du terroir marocain : délices secs, herbes et infusions biologiques de nos régions
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getCategoryImage(category.id)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {getCategoryProductCount(category.id)} produits
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-stone-600 mb-4">
                    {category.description}
                  </p>
                  
                  <Link
                    to={`/shop?category=${category.id}`}
                    className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:translate-x-1 transition-all duration-200"
                  >
                    <span>Voir les produits</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-emerald-50 rounded-2xl p-8">
            <Package className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-stone-600 mb-6">
              Découvrez tous les trésors du Maroc dans notre boutique de délices secs et herbes biologiques
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <span>Voir tous les produits</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
