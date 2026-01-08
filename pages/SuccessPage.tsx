
import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Printer, Home, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const state = location.state as { orderId: string; paymentId: string; waLink: string } | null;

  useEffect(() => {
    if (state) {
      clearCart();
    }
  }, [state, clearCart]);

  if (!state) return <Navigate to="/" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <div className="p-6 bg-emerald-100 text-emerald-600 rounded-full animate-bounce">
          <CheckCircle size={80} />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Successful!</h1>
      <p className="text-gray-600 mb-10 text-lg">Thank you for shopping with Mudichur Mart. Your order has been placed and is being processed.</p>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-left mb-10">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">Invoice Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-bold">{state.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment ID:</span>
            <span className="text-sm font-mono">{state.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Paid</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-gray-500">Expected Delivery:</span>
            <span className="font-medium">Within 24 Hours</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a 
          href={state.waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
        >
          <Send className="mr-2" size={20} /> Share Status via WhatsApp
        </a>
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center p-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          <Printer className="mr-2" size={20} /> Print Invoice
        </button>
      </div>

      <div className="mt-12 flex justify-center space-x-8">
        <Link to="/" className="text-emerald-600 font-bold flex items-center hover:underline">
          <Home className="mr-1" size={18} /> Back to Home
        </Link>
        <Link to="/products" className="text-emerald-600 font-bold flex items-center hover:underline">
          <ShoppingBag className="mr-1" size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
