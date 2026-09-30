import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';

function PurchaseHistory() {
  const { token } = useSelector(state => state.auth);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();
        if (resData.success) {
          setPurchases(resData.data);
        }
      } catch (err) {
        console.error('Failed to load purchases:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [token]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-2">
      <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <ShoppingBag size={20} className="text-indigo-600" />
        Retail Purchase History
      </h3>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Transaction ID</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Date</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Product Details</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Quantity</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                  Loading order records...
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                  No purchases recorded yet.
                </td>
              </tr>
            ) : (
              purchases.map((p) => {
                const productNames = p.items?.map(item => item.name).join(', ') || 'Retail Items';
                const totalQty = p.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                const formattedDate = p.createdAt ? p.createdAt.split('T')[0] : 'N/A';
                
                return (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-450 text-slate-400">
                      {p._id?.substring(p._id.length - 8)}
                    </td>
                    <td className="p-4 text-slate-655 text-slate-600">{formattedDate}</td>
                    <td className="p-4 font-bold text-slate-800">{productNames}</td>
                    <td className="p-4 text-slate-655 text-slate-600">{totalQty}</td>
                    <td className="p-4 font-bold text-indigo-600">₹{p.totalAmount?.toFixed(2)}</td>
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

export default PurchaseHistory;
