import React from 'react';
import { RotateCcw } from 'lucide-react';

const RefundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
          <RotateCcw size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Cancellation & Refund Policy</h1>
        <p className="text-gray-500 mt-2">Ensuring your satisfaction</p>
      </div>

      <div className="prose prose-emerald max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Order Cancellation</h2>
          <p>
            You can cancel your order before it has been dispatched for delivery. To cancel, please go to your order history or contact our support team immediately.
          </p>
          <p className="mt-2">
            <strong>Note:</strong> Once the order is out for delivery, it cannot be canceled.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Returns</h2>
          <p>
            We have a "no-questions-asked" return policy for damaged or defective items at the time of delivery. 
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Please inspect your items upon delivery.</li>
            <li>If you find any damage or expiry issues, you can return them immediately to the delivery partner or report it within 24 hours.</li>
            <li>For hygiene reasons, opened food packets cannot be returned unless they are spoiled or expired.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refunds</h2>
          <p>
            If your return is approved:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Online Payments:</strong> The amount will be refunded to your original payment source within 5-7 business days.</li>
            <li><strong>Cash on Delivery:</strong> We do not currently support COD refunds directly to bank accounts; a store credit or coupon will be issued for future purchases, or UPI transfer can be arranged upon request.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RefundPage;