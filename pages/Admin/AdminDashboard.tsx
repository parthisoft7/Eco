
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  LayoutDashboard,
  Users,
  Search,
  Plus,
  User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const AdminDashboard = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-emerald-400">Mart Admin</h2>
        </div>
        <nav className="flex-grow py-6">
          <Link to="/admin" className="flex items-center space-x-3 px-6 py-4 bg-emerald-600 text-white">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-800 transition-colors">
            <Package size={20} />
            <span className="font-medium">Products</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-800 transition-colors">
            <ShoppingBag size={20} />
            <span className="font-medium">Orders</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-800 transition-colors">
            <Users size={20} />
            <span className="font-medium">Customers</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex space-x-4">
            <Link to="/admin/products" className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">
              <Plus size={20} className="mr-2" /> Add Product
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <ShoppingBag size={24} />
              </div>
              <span className="text-emerald-500 font-bold text-sm">+12%</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">1,248</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <span className="text-blue-500 font-bold text-sm">+5%</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">₹48,250</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Package size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <span className="text-amber-500 font-bold text-sm">Critical</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6">Revenue Analysis</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6">Recent Activities</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New Order #MM-4521</p>
                    <p className="text-xs text-gray-500">2 minutes ago • ₹450</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">PAID</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2 text-emerald-600 font-bold text-sm hover:underline">View All Notifications</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;