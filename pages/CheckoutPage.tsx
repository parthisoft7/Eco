import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, Phone, User, Mail, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

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
    city: 'Mudichur, Chennai',
    pincode: '600048'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || loading) return;
    
    setLoading(true);

    // Use relative path for Vercel deployment (serverless function at /api)
    const API_URL = '/api/razorpay'; 

    try {
      let orderId = '';
      let isServerOrder = false;

      // 1. Create Order (Server-side preferred)
      try {
        const orderResponse = await fetch(`${API_URL}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount, currency: 'INR' }),
        });

        if (orderResponse.ok) {
          const data = await orderResponse.json();
          orderId = data.id;
          isServerOrder = true;
        } else {
          console.warn('Server order creation failed, status:', orderResponse.status);
        }
      } catch (err) {
        console.warn("Backend unavailable, proceeding with local fallback mode.", err);
        // Fallback ID for local tracking
        orderId = `order_local_${Date.now()}`;
      }

      // 2. Initialize Razorpay Options
      const options = {
        key: "rzp_live_S1PWro2UcHnr2w", 
        amount: Math.round(totalAmount * 100), // Amount in paise
        currency: "INR",
        name: "Mudichur Mart",
        description: `Order for ${formData.name}`,
        // Only pass order_id if it was created by the server
        order_id: isServerOrder ? orderId : undefined, 
        
        handler: async function (response: any) {
          try {
            // 3. Verify Payment (Only if server order)
            if (isServerOrder) {
              const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyResponse.json();
              if (verifyData.status !== 'success') {
                throw new Error("Payment signature verification failed");
              }
            }

            // 4. Success Navigation
            const successData = {
              orderId: response.razorpay_order_id || orderId,
              paymentId: response.razorpay_payment_id,
              waLink: `https://wa.me/919876543210?text=${encodeURIComponent(`New Order: ₹${totalAmount}\nOrder ID: ${orderId}\nPayment ID: ${response.razorpay_payment_id}`)}`
            };
            navigate('/success', { state: successData });
            
          } catch (verificationError) {
            console.error("Verification Error:", verificationError);
            alert("Payment successful, but verification failed. Please contact support.");
            setLoading(false);
          }
        },
        prefill: { 
          name: formData.name, 
          email: formData.email, 
          contact: formData.mobile 
        },
        theme: { color: "#059669" },
        modal: { 
          ondismiss: () => setLoading(false) 
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error("Payment Initialization Error:", error);
      alert("Could not initialize payment gateway. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <MapPin className="mr-2 text-emerald-600" /> Delivery Details
          </h2>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Mobile Number</label>
                <input required name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Delivery Address</label>
              <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Address" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />} 
              {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
            </button>
            <div className="flex items-center justify-center text-xs text-gray-400 mt-4 space-x-2">
              <ShieldCheck size={14} />
              <span>Secure Payment via Razorpay</span>
            </div>
          </form>
        </div>
        <div className="bg-gray-900 text-white p-8 rounded-2xl h-fit">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-800">
                <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 space-y-2">
             <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
             </div>
             <div className="flex justify-between text-sm text-gray-400">
                <span>Delivery</span>
                <span className="text-emerald-400">Free</span>
             </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-emerald-400">₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;