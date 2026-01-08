
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-gray-100 rounded-full text-gray-400">
            <ShoppingBag size={64} />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-10">Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const currentPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
            return (
              <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-6">
                <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-emerald-600 mb-4">{item.categoryId === 'housekeeping' ? 'Housekeeping' : 'Snacks'}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-center sm:text-right flex flex-col items-center sm:items-end justify-between min-w-[120px]">
                  <div className="mb-4">
                    <div className="font-bold text-xl text-gray-900">₹{(currentPrice * item.quantity).toFixed(0)}</div>
                    <div className="text-xs text-gray-400">₹{currentPrice.toFixed(0)} / unit</div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-rose-500 hover:text-rose-700 flex items-center text-sm font-medium"
                  >
                    <Trash2 size={18} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-6 pb-4 border-bottom border-gray-100">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (Estimated)</span>
                <span>Included</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 transition-shadow shadow-lg hover:shadow-emerald-200"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-6 flex items-center justify-center space-x-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4 grayscale" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 grayscale" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
