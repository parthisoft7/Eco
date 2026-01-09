import React from 'react';
import { Truck } from 'lucide-react';

const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
          <Truck size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Shipping & Delivery Policy</h1>
        <p className="text-gray-500 mt-2">Fast and reliable local delivery</p>
      </div>

      <div className="prose prose-emerald max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Area</h2>
          <p>
            Mudichur Mart currently operates exclusively in <strong>Mudichur, Chennai</strong> and immediate adjacent neighborhoods. We do not ship outside this zone at the moment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Delivery Timelines</h2>
          <p>
            We strive to deliver your essentials as fast as possible:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Standard Delivery:</strong> Delivered within 24 hours of placing the order.</li>
            <li><strong>Express Delivery:</strong> Available for select locations (delivered within 4 hours).</li>
          </ul>
          <p className="mt-2 text-sm">
            *Delivery times may vary due to weather conditions, traffic, or operational challenges.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Shipping Charges</h2>
          <table className="min-w-full mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Fee</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Above ₹500</td>
                <td className="px-6 py-4 whitespace-nowrap text-emerald-600 font-bold">FREE</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Below ₹500</td>
                <td className="px-6 py-4 whitespace-nowrap">₹30</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ShippingPage;