import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Landmark, TrendingUp } from 'lucide-react';
import CustomChart from '../../CustomChart';

function EarningsLogs() {
  const { token } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    servicesCompleted: 0,
    totalEarnings: 0.00,
    commissionRate: 0
  });

  const [earningsHistory, setEarningsHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        // 1. Fetch detailed my-earnings and summaries
        const eRes = await fetch('http://localhost:5000/api/wages/my-earnings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const eData = await eRes.json();
        
        // 2. Fetch monthly trend aggregation
        const mRes = await fetch('http://localhost:5000/api/wages/monthly-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mData = await mRes.json();

        if (eData.success) {
          setStats({
            servicesCompleted: eData.summary.totalServices,
            totalEarnings: eData.summary.totalEarnings,
            commissionRate: eData.summary.commissionRate || 15
          });
          setEarningsHistory(eData.data);
        }

        if (mData.success && mData.data.length > 0) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const formattedChart = mData.data.map(item => ({
            label: `${months[item._id.month - 1]} '${String(item._id.year).substring(2)}`,
            value: item.totalEarnings
          }));
          setChartData(formattedChart);
        } else {
          // Fallback static structure if DB wage is zero
          setChartData([
            { label: 'May', value: 37600 },
            { label: 'Jun', value: 51700 },
            { label: 'Jul', value: eData.summary?.totalEarnings || 63450 }
          ]);
        }
      } catch (err) {
        console.error('Failed to load wages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, [token]);

  return (
    <div className="flex flex-col gap-6 col-span-3">
      
      {/* Earnings Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Services Completed</span>
          <h2 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : stats.servicesCompleted}</h2>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Commission Earnings</span>
          <h2 className="text-3xl font-extrabold text-indigo-600">₹{loading ? '0.00' : stats.totalEarnings?.toFixed(2)}</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Commission Rate</span>
          <h2 className="text-3xl font-extrabold text-emerald-600">{loading ? '0' : stats.commissionRate}%</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Earnings chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" />
            Earnings Commission Trend
          </h3>
          <CustomChart type="line" data={chartData} xKey="label" yKey="value" colors={['#4f46e5']} />
        </div>

        {/* Payout table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Landmark size={20} className="text-indigo-600" />
            Recent Payout Logs
          </h3>
          
          {loading ? (
            <div className="text-slate-400 text-xs py-4 text-center">Loading pay logs...</div>
          ) : earningsHistory.length === 0 ? (
            <div className="text-slate-400 text-xs py-4 text-center">No earnings payout logs recorded yet.</div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {earningsHistory.map(item => (
                <div key={item._id} className="border border-slate-100 rounded-lg p-3.5 bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-slate-800">₹{item.totalEarning?.toFixed(2)}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.status === 'Paid' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>{item.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">Service: {item.service?.name || 'Grooming Treatment'}</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1">Date: {item.date}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">Ref: {item._id?.substring(item._id.length - 8)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EarningsLogs;
