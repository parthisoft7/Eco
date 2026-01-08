
import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle, Clock, XCircle, ChevronDown } from 'lucide-react';
import { OrderStatus } from '../../types';

const MOCK_ORDERS = [
  { id: 'MM-1024', customer: 'Ramesh Kumar', items: 3, total: 1450, status: OrderStatus.PAID, date: '2024-03-15 14:30' },
  { id: 'MM-1025', customer: 'Priya S.', items: 1, total: 250, status: OrderStatus.PENDING, date: '2024-03-15 15:10' },
  { id: 'MM-1026', customer: 'Anand Raj', items: 5, total: 3200, status: OrderStatus.DELIVERED, date: '2024-03-14 11:20' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID: return 'bg-blue-100 text-blue-700';
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700';
      case OrderStatus.CANCELLED: return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [o.id, o.customer, o.items, o.total, o.status, o.date]);
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
              placeholder="Filter by Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {Object.values(OrderStatus).map(status => (
              <button 
                key={status}
                className="px-4 py-2 text-xs font-bold border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                <td className="px-6 py-4 font-medium">{order.customer}</td>
                <td className="px-6 py-4 text-sm">{order.items} Items</td>
                <td className="px-6 py-4 font-bold">₹{order.total}</td>
                <td className="px-6 py-4">
                  <div className="relative inline-block text-left group">
                    <button className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {order.status} <ChevronDown size={14} />
                    </button>
                    <div className="hidden group-hover:block absolute left-0 z-10 w-40 mt-1 bg-white border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {Object.values(OrderStatus).map(s => (
                        <button key={s} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 font-medium">
                          Mark as {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:underline font-bold text-sm flex items-center justify-end ml-auto">
                    <Eye size={16} className="mr-1" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
