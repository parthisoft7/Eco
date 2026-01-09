import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
          <Shield size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-500 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-emerald max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p>
            At Mudichur Mart, we respect your privacy. When you shop with us, we collect the following personal information to process your orders efficiently:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Name and contact details (email address, phone number).</li>
            <li>Delivery address and landmarks.</li>
            <li>Order history and preferences.</li>
          </ul>
          <p className="mt-2 text-sm italic">
            Note: We do not store your credit/debit card information. All payment transactions are processed securely through Razorpay.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p>We use your data for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>To process and deliver your orders within Mudichur and surrounding areas.</li>
            <li>To communicate with you regarding order status, updates, or issues.</li>
            <li>To improve our product offerings and website functionality.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our platform uses secure cloud infrastructure (Firebase) and encrypted connections (SSL).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
          <p>
            We may share limited data with trusted third-party service providers solely for operational purposes:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Payment Gateway:</strong> Razorpay (for processing payments).</li>
            <li><strong>Cloud Services:</strong> Google Firebase (for hosting and database).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="font-bold">Mudichur Mart</p>
            <p>123, Main Road, Mudichur</p>
            <p>Chennai, Tamil Nadu 600048</p>
            <p>Email: support@mudichurmart.com</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;