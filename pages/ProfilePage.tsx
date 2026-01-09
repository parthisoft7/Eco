
import React from 'react';
// Added Link import to fix errors on lines 109 and 111
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, MapPin, Package, Calendar, ChevronRight, User as UserIcon, Phone, Mail } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Mock orders for demo
  const mockOrders = [
    { id: 'MM-5521', date: 'Oct 24, 2024', total: 1250, status: 'Delivered', items: 3 },
    { id: 'MM-5522', date: 'Nov 12, 2024', total: 450, status: 'Paid', items: 1 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar / Info */}
        <aside className="lg:w-1/3 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="h-24 w-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.displayName || 'Valued Customer'}</h2>
            <p className="text-gray-500 text-sm mb-6">{user?.email}</p>
            <button className="w-full py-2 px-4 border border-emerald-600 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
              Edit Account
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <MapPin size={18} className="mr-2 text-emerald-600" /> Default Address
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Gandhi Nagar, Rayappa Nagar,<br />
              Mudichur, Chennai, TN - 600048
            </p>
            <button className="text-emerald-600 text-sm font-bold hover:underline">Change Address</button>
          </div>

          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl">
            <h3 className="font-bold mb-2">Exclusive Offer</h3>
            <p className="text-emerald-100 text-sm mb-4">Get 10% off your next housekeeping order with code: <strong>MUDI10</strong></p>
            <div className="h-1 bg-emerald-700 w-full rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-2/3"></div>
            </div>
          </div>
        </aside>

        {/* Main Content / Orders */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package size={16} />
              <span>{mockOrders.length} Recent Orders</span>
            </div>
          </div>

          <div className="space-y-6">
            {mockOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span>{order.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto text-center md:text-left">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Items</p>
                      <p className="font-bold text-gray-900">{order.items}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Amount</p>
                      <p className="font-bold text-gray-900">₹{order.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}

            {mockOrders.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                <Link to="/products" className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  Shop Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
