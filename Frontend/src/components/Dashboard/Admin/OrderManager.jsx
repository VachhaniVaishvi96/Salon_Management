import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, Truck } from 'lucide-react';

function OrderManager() {
  const { token } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setOrders(resData.data);
      }
    } catch (err) {
      console.error('Failed to load corporate order sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        loadOrders();
      } else {
        alert(resData.message || 'Failed to update order status.');
      }
    } catch (err) {
      alert('Could not connect to update order status.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag size={20} className="text-indigo-600" />
          Store Retail Orders Processing Desk
        </h3>
        <span className="text-xs text-slate-400 font-medium">Coordinate client package shipments and deliveries</span>
      </div>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Order ID</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Date</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Customer</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Product Items</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total Amount</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                  Loading store orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                  No retail orders placed yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const itemsList = order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || 'Retail Package';
                const formattedDate = order.createdAt ? order.createdAt.split('T')[0] : 'N/A';
                
                return (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">{order._id?.substring(order._id.length - 8)}</td>
                    <td className="p-4 text-slate-600 text-xs">{formattedDate}</td>
                    <td className="p-4 font-bold text-slate-800">{order.customer?.name}</td>
                    <td className="p-4 text-slate-655 font-semibold text-xs truncate max-w-[200px]" title={itemsList}>{itemsList}</td>
                    <td className="p-4 font-extrabold text-indigo-650 text-indigo-600">₹{order.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-50 text-indigo-800'
                      }`}>{order.status}</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 shadow-sm transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManager;
