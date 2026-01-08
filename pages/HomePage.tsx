
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Coffee, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const categories = [
    {
      id: 'housekeeping',
      name: 'Housekeeping Materials',
      image: 'https://picsum.photos/seed/cleaning/600/400',
      description: 'Clean homes, happy lives. Premium cleaning supplies.'
    },
    {
      id: 'snacks',
      name: 'Snacks & Food Items',
      image: 'https://picsum.photos/seed/snacks/600/400',
      description: 'Delicious cookies, chips, and snacks for every mood.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-emerald-900 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/market/1600/900" 
            className="w-full h-full object-cover opacity-30" 
            alt="Hero background"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Quality Essentials for <br/><span className="text-emerald-400">Mudichur Residents</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            From industrial-grade housekeeping materials to mouth-watering snacks, get everything you need with fast local delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold transition-all shadow-lg flex items-center group"
            >
              Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full font-bold backdrop-blur-sm transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop By Category</h2>
          <p className="text-gray-600">Discover our wide range of products across housekeeping and food.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/products?category=${cat.id}`}
              className="group relative h-80 overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src={cat.image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">{cat.description}</p>
                <span className="inline-flex items-center text-emerald-400 font-semibold">
                  Browse Collection <ChevronRight className="ml-1" size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600"><Truck size={32} /></div>
            <h4 className="font-bold text-gray-900">Local Delivery</h4>
            <p className="text-sm text-gray-600">Fastest delivery in Mudichur and surrounding areas.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600"><ShieldCheck size={32} /></div>
            <h4 className="font-bold text-gray-900">Premium Quality</h4>
            <p className="text-sm text-gray-600">We source only the highest grade materials and food items.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600"><Sparkles size={32} /></div>
            <h4 className="font-bold text-gray-900">Best Prices</h4>
            <p className="text-sm text-gray-600">Competitive wholesale prices for all customers.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-100 rounded-full text-emerald-600"><Coffee size={32} /></div>
            <h4 className="font-bold text-gray-900">Fresh Stock</h4>
            <p className="text-sm text-gray-600">New arrivals every week in our food section.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;