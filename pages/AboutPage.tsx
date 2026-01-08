
import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, MapPin } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 py-16">
      <section className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Serving <span className="text-emerald-600">Mudichur</span> with Pride</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Mudichur Mart was founded with a simple mission: to provide high-quality housekeeping essentials and delicious snacks to the families of Mudichur, Chennai, without the hassle of long commutes.
        </p>
      </section>

      <section className="bg-emerald-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Local Roots</h2>
            <p className="text-emerald-100 leading-relaxed mb-6">
              Located right in the heart of Mudichur, we understand the specific needs of our community. From industrial-strength cleaning supplies for your home maintenance to the exact brands of chips and cookies your family loves, we bring the warehouse directly to your doorstep.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-emerald-700 rounded-lg"><MapPin size={24} /></div>
                <span>Serving Gandhi Road, Rayappa Nagar, and Mudichur Main Road.</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-emerald-700 rounded-lg"><Heart size={24} /></div>
                <span>Trusted by over 500 local households since 2023.</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl transform rotate-2">
            <img src="https://picsum.photos/seed/store/800/600" alt="Mudichur Mart Warehouse" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Mudichur Mart?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <ShoppingBag className="text-emerald-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Bulk Savings</h3>
            <p className="text-gray-600">We offer wholesale pricing on bulk housekeeping materials, helping you save more on monthly essentials.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck className="text-emerald-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Verified Quality</h3>
            <p className="text-gray-600">Every snack and cleaning product passes our internal quality check before reaching your home.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-emerald-600 mb-4 font-black text-4xl">24h</div>
            <h3 className="text-xl font-bold mb-3">Hyper-Local Delivery</h3>
            <p className="text-gray-600">Being located in Mudichur allows us to offer the fastest delivery times in the area.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
