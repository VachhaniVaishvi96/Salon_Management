import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Landmark, Check, Coins } from 'lucide-react';

function PayoutManager() {
  const { token } = useSelector(state => state.auth);
  const [wages, setWages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setWages(resData.data);
      }
    } catch (err) {
      console.error('Failed to load stylist wages ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWages();
  }, [token]);

  const handlePayOut = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Paid' })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        loadWages();
      } else {
        alert(resData.message || 'Failed to release payout.');
      }
    } catch (err) {
      alert('Could not connect to release payout.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
          <Landmark size={20} className="text-indigo-600" />
          Stylist Wages & Commission Desk
        </h3>
        <span className="text-xs text-slate-400 font-medium">Release pending commission shares to active stylists</span>
      </div>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Date</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stylist</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Treatment</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Cost</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Share %</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Commission</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payout Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                  Loading wage payouts...
                </td>
              </tr>
            ) : wages.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                  No commission payout records found.
                </td>
              </tr>
            ) : (
              wages.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 text-xs">{item.date}</td>
                  <td className="p-4 font-bold text-slate-800">{item.barber?.name}</td>
                  <td className="p-4 text-slate-655 font-semibold text-xs">{item.service?.name || 'Styling Treatment'}</td>
                  <td className="p-4 text-slate-600">₹{item.serviceAmount?.toFixed(2)}</td>
                  <td className="p-4 text-slate-500 font-bold text-xs">{item.commissionRate}%</td>
                  <td className="p-4 font-extrabold text-indigo-650 text-indigo-600">₹{item.commissionEarned?.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.status === 'Paid' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>{item.status}</span>
                  </td>
                  <td className="p-4">
                    {item.status === 'Pending' ? (
                      <button 
                        onClick={() => handlePayOut(item._id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <Coins size={12} /> Release Pay
                      </button>
                    ) : (
                      <span className="text-slate-400 font-bold text-xs flex items-center gap-1">
                        <Check size={14} className="text-emerald-600" /> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PayoutManager;
