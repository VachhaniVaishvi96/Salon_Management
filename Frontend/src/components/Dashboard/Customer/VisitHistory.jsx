import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { History, Search } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

function VisitHistory() {
  const { token } = useSelector(state => state.auth);
  const [filterText, setFilterText] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();
        if (resData.success) {
          // Filter for completed or cancelled appointments
          const history = resData.data.filter(apt => 
            apt.status === 'Completed' || apt.status === 'Cancelled'
          );
          setHistoryData(history);
        }
      } catch (err) {
        console.error('Failed to load visit history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [token]);

  const filteredHistory = historyData.filter(item => 
    (item.service?.name || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (item.barber?.name || '').toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-2">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
          <History size={20} className="text-indigo-600" />
          Past Visit Ledger
        </h3>

        {/* Filter input */}
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Filter by service or stylist..." 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none h-9 transition-all"
          />
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
        </div>
      </div>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">ID</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Service</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stylist</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Date</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Cost</th>
              <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                  Loading visit records...
                </td>
              </tr>
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                  No matching visit records found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-450 text-slate-400">{row._id?.substring(row._id.length - 8)}</td>
                  <td className="p-4 font-bold text-slate-800">{row.service?.name}</td>
                  <td className="p-4 text-slate-600">{row.barber?.name}</td>
                  <td className="p-4 text-slate-600">{row.date}</td>
                  <td className="p-4 font-bold text-indigo-600">₹{row.totalAmount?.toFixed(2)}</td>
                  <td className="p-4">
                    <StatusBadge status={row.status} />
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

export default VisitHistory;
