
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  LayoutDashboard,
  Users,
  Plus,
  User,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { Order, Product } from '../../types';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockCount: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<{name: string, sales: number}[]>([]);

  useEffect(() => {
    // 1. Fetch Orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      // Calculate Total Orders
      const totalOrders = orders.length;
      
      // Calculate Total Revenue (Only Paid/Delivered)
      const totalRevenue = orders
        .filter(o => o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      // Get Recent Orders
      setRecentOrders(orders.slice(0, 5));

      // Calculate Chart Data (Revenue by Day for last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const salesByDate = last7Days.map(dateStr => {
        const dayTotal = orders
          .filter(o => {
            const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
            return orderDate === dateStr && (o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered');
          })
          .reduce((sum, o) => sum + o.totalAmount, 0);
        
        return {
          name: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
          sales: dayTotal
        };
      });
      setChartData(salesByDate);

      setStats(prev => ({ ...prev, totalOrders, totalRevenue }));
    }, (error) => {
      console.error("Error fetching orders for dashboard:", error);
      // Ensure we stop loading even on error
      setLoading(false);
    });

    // 2. Fetch Products
    const productsQuery = query(collection(db, 'products'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data() as Product);
      const totalProducts = products.length;
      const lowStockCount = products.filter(p => p.stock < 10).length;

      setStats(prev => ({ ...prev, totalProducts, lowStockCount }));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products for dashboard:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col fixed h-full">
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
      <main className="flex-grow p-8 md:ml-64">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex space-x-4">
            <Link to="/admin/products" className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md">
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
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Package size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <span className="text-amber-500 font-bold text-sm">Action Needed</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.lowStockCount}</h3>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6">Revenue (Last 7 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Activities</h3>
              <Link to="/admin/orders" className="text-sm text-emerald-600 font-bold hover:underline">View All</Link>
            </div>
            <div className="space-y-6">
              {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                <div key={order.id || i} className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-900">New Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()} • ₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500 truncate">{order.customerDetails.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase shrink-0 ${
                    order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-4">No recent orders found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
