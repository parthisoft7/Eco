
import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Have questions about our products or delivery? We're here to help the Mudichur community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Our Location</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                123, Gandhi Road, Mudichur,<br />
                Chennai, Tamil Nadu 600048
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Phone Number</h3>
              <p className="text-gray-600 text-sm">+91 98765 43210</p>
              <p className="text-gray-600 text-sm">+91 87654 32109</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
              <p className="text-gray-600 text-sm">support@mudichurmart.com</p>
              <p className="text-gray-600 text-sm">sales@mudichurmart.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Working Hours</h3>
              <p className="text-gray-600 text-sm">Mon - Sat: 09:00 AM - 09:00 PM</p>
              <p className="text-gray-600 text-sm">Sun: 10:00 AM - 06:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Your Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea rows={6} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Write your message here..."></textarea>
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
              <MessageSquare className="mr-2" size={20} /> Send Message
            </button>
          </form>
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="mt-16 bg-gray-200 rounded-2xl h-[400px] flex items-center justify-center text-gray-500 font-bold overflow-hidden">
        <img src="https://picsum.photos/seed/mudichur_map/1200/400" className="w-full h-full object-cover" alt="Mudichur Map" />
      </div>
    </div>
  );
};

export default ContactPage;
