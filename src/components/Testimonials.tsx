import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Fatima Benali',
    location: 'Casablanca',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Excellente qualité ! Les délices secs de Délices Secs ont transformé ma cuisine. Les amandes d\'Agadir sont exceptionnelles !'
  },
  {
    id: 2,
    name: 'Ahmed Tazi',
    location: 'Rabat',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Je recommande vivement ! Les herbes de Chefchaouen sont fraîches et authentiques. Le service client est exceptionnel.'
  },
  {
    id: 3,
    name: 'Khadija Alami',
    location: 'Marrakech',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Une découverte fantastique ! Les dattes du Tafilalet sont délicieuses et les prix très raisonnables.'
  },
  {
    id: 4,
    name: 'Youssef Idrissi',
    location: 'Fès',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Les noix d\'Azilal et les figues de Taounate sont un délice ! Livraison rapide dans tout le Maroc.'
  },
  {
    id: 5,
    name: 'Aicha Benjelloun',
    location: 'Agadir',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Parfait pour mes infusions ! La menthe de notre région et la lavande d\'Ouarzazate sont de qualité premium.'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-stone-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-6 left-6 w-12 h-12 bg-emerald-600 rounded-full"></div>
        <div className="absolute top-20 right-12 w-10 h-10 bg-emerald-400 rounded-full"></div>
        <div className="absolute bottom-12 left-1/4 w-8 h-8 bg-emerald-500 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-emerald-300 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <Quote className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui ont choisi
            Délices Secs pour leurs produits biologiques du terroir marocain.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 relative">
                    {/* Quote Icon */}
                    <div className="absolute -top-4 left-6">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Quote className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="pt-4">
                      <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-6 font-medium">
                        "{testimonial.text}"
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current mx-0.5"
                          />
                        ))}
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center justify-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-3 border-emerald-100 mr-3"
                        />
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-stone-800">
                            {testimonial.name}
                          </h4>
                          <p className="text-emerald-600 font-medium text-sm">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-600 hover:text-emerald-600 hover:shadow-xl transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-600 hover:text-emerald-600 hover:shadow-xl transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-emerald-600 w-6'
                  : 'bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mt-10">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-stone-800 ml-2">4.9/5</span>
            </div>
            <p className="text-stone-600 font-medium text-sm">
              Basé sur <span className="text-emerald-600 font-bold">150+</span> avis clients vérifiés
            </p>
            <div className="flex items-center justify-center mt-3 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
