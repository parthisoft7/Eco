
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, Phone, User, Mail, CreditCard, ShieldCheck } from 'lucide-react';

declare const Razorpay: any;

const CheckoutPage: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: 'Mudichur, Chennai', // Hardcoded location requirement
    pincode: '600048' // Hardcoded Mudichur pincode
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setLoading(true);

    // RAZORPAY INTEGRATION LOGIC
    // In production, this would call your backend to create a Razorpay order
    const options = {
      key: "rzp_test_YOUR_KEY", // Test key
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "Mudichur Mart",
      description: "Purchase from Mudichur Mart",
      image: "https://picsum.photos/seed/logo/200/200",
      handler: function (response: any) {
        // Payment success logic
        console.log("Payment Successful:", response.razorpay_payment_id);
        
        // WhatsApp Notification (Simulated)
        const waMessage = `New Order from ${formData.name}! \nTotal: ₹${totalAmount}\nAddress: ${formData.address}, ${formData.city}\nItems: ${cartItems.length}`;
        const waLink = `https://wa.me/919876543210?text=${encodeURIComponent(waMessage)}`;
        
        // Save to Database (Mocking)
        // clearCart();
        navigate('/success', { 
          state: { 
            orderId: 'MM-' + Math.floor(Math.random() * 100000),
            paymentId: response.razorpay_payment_id,
            waLink: waLink
          } 
        });
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.mobile
      },
      theme: {
        color: "#059669"
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <MapPin className="mr-2 text-emerald-600" /> Delivery Details
          </h2>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <User size={16} className="mr-2" /> Full Name
                </label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Phone size={16} className="mr-2" /> Mobile Number
                </label>
                <input 
                  required
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Mail size={16} className="mr-2" /> Email Address
              </label>
              <input 
                required
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Detailed Address (House No, Street)</label>
              <textarea 
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter your detailed address here"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">City / Area</label>
                <input 
                  readOnly
                  type="text" 
                  value={formData.city}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Pincode</label>
                <input 
                  readOnly
                  type="text" 
                  value={formData.pincode}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>Pay ₹{totalAmount.toFixed(0)} Securely</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg flex items-start">
            <ShieldCheck className="text-emerald-600 mr-3 shrink-0" size={24} />
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your transaction is encrypted and secure. We use Razorpay for payment processing. No sensitive card data is stored on our servers.
            </p>
          </div>
        </div>

        {/* Order Preview */}
        <div className="lg:block">
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-emerald-400">{item.name}</span>
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold">₹{(item.price * (1 - item.discount / 100) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-800 pt-6 space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4">
                <span>Total</span>
                <span className="text-emerald-500">₹{totalAmount.toFixed(0)}</span>
              </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">
              Guaranteed Delivery within 24 Hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
