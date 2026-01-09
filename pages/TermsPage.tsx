import React from 'react';
import { FileText } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
          <FileText size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Terms & Conditions</h1>
        <p className="text-gray-500 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-emerald max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            Welcome to Mudichur Mart. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
          <p>
            Our services are intended for personal use by residents of Mudichur and nearby areas in Chennai. You agree not to use our platform for any illegal or unauthorized purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products and Pricing</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>We strive to provide accurate product descriptions and images. However, actual product packaging may vary.</li>
            <li>Prices are listed in Indian Rupees (INR) and are subject to change without notice.</li>
            <li>We reserve the right to modify or discontinue any product at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Account</h2>
          <p>
            If you create an account, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p>
            Mudichur Mart shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services or products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;