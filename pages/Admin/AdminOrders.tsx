
import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, CheckCircle, Clock, XCircle, ChevronDown, Loader2 } from 'lucide-react';
import { OrderStatus, Order } from '../../types';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Order));
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = orders.filter(o => 
      (o.id && o.id.toLowerCase().includes(term)) || 
      o.customerDetails.name.toLowerCase().includes(term) ||
      o.customerDetails.mobile.includes(term)
    );
    setFilteredOrders(result);
  }, [searchTerm, orders]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID: return 'bg-blue-100 text-blue-700';
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700';
      case OrderStatus.CANCELLED: return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { orderStatus: newStatus });
      
      // If Delivered, we might also want to ensure Payment Status is Paid if it wasn't
      if (newStatus === OrderStatus.DELIVERED) {
         await updateDoc(orderRef, { paymentStatus: 'Paid' });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status.");
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Mobile', 'Items Count', 'Total Amount', 'Status', 'Payment', 'Date'];
    const rows = filteredOrders.map(o => [
      o.id || '', 
      o.customerDetails.name, 
      o.customerDetails.mobile,
      o.items.length, 
      o.totalAmount, 
      o.orderStatus, 
      o.paymentStatus,
      new Date(o.createdAt).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_mudichur_mart_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Track and manage customer orders across Mudichur</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-white border border-gray-200 px-6 py-2 rounded-lg font-bold flex items-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={20} className="mr-2" /> Export to CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Order ID, Name or Mobile..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                    {order.id?.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <div className="text-gray-900">{order.customerDetails.name}</div>
                    <div className="text-xs text-gray-500">{order.customerDetails.mobile}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{order.items.reduce((acc, i) => acc + i.quantity, 0)} Items</td>
                  <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block text-left group">
                      <button className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus} <ChevronDown size={14} />
                      </button>
                      <div className="hidden group-hover:block absolute left-0 z-10 w-40 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {Object.values(OrderStatus).map(s => (
                          <button 
                            key={s} 
                            onClick={() => order.id && updateStatus(order.id, s)}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                          >
                            Mark as {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <div className="text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">No matching orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
