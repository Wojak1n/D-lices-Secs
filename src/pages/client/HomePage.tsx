import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Truck, Shield, Leaf } from 'lucide-react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';

import FeaturedCategories from '../../components/FeaturedCategories';
import TopSellers from '../../components/TopSellers';
import Testimonials from '../../components/Testimonials';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    setFeaturedProducts(products.filter((p: Product) => p.featured).slice(0, 4));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1920)'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              Bienvenue chez Délices Secs
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez les trésors du Maroc : fruits secs, noix, herbes aromatiques et infusions biologiques du terroir marocain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>Découvrir nos Produits</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/pack-cadeaux"
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>Packs Cadeaux</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Terroir Marocain</h3>
              <p className="text-stone-600">
                Tous nos délices secs proviennent des meilleures régions du Maroc et sont certifiés biologiques.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Livraison Nationale</h3>
              <p className="text-stone-600">
                Livraison dans tout le Maroc avec emballage soigné pour préserver la fraîcheur.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tradition Marocaine</h3>
              <p className="text-stone-600">
                Satisfaction garantie. Découvrez l'héritage culinaire marocain et ses bienfaits naturels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Produits Vedettes
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Découvrez notre sélection de produits biologiques les plus populaires
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
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

      {/* FeaturedCategories */}
      <section className="py-16 bg-white">
        <FeaturedCategories/>
      </section>

      {/* Top sellers */}
       <section className="py-16 bg-gray-50">
        <TopSellers/>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <Testimonials/>
      </section>


      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Notre Mission
              </h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Chez Délices Secs, nous célébrons la richesse du terroir marocain. Des amandes d'Agadir
                aux dattes du Tafilalet, en passant par les herbes de Chefchaouen, nous sélectionnons
                avec passion les meilleurs produits de nos régions.
              </p>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Notre expertise locale nous permet de vous offrir l'authenticité des saveurs marocaines,
                riches en tradition et en bienfaits nutritionnels, pour sublimer votre quotidien gourmand.
              </p>
              <div className="flex items-center space-x-4">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <span className="text-stone-700 font-medium">
                  100% biologiques • Terroir marocain • Saveurs authentiques
                </span>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Produits biologiques"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-6 rounded-lg">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-emerald-100">Délices secs & herbes</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;