import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, BarChart3 } from 'lucide-react';
import CustomChart from '../../CustomChart';

function AnalyticsPanel() {
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  // States
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalStaff: 0,
    totalRevenue: 0,
    totalAppointments: 0,
    totalOrders: 0,
    activeServices: 0
  });

  const [financialData, setFinancialData] = useState([]);
  const [stylistPerformance, setStylistPerformance] = useState([]);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        // 1. Fetch overview stats
        const overviewRes = await fetch('http://localhost:5000/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const oData = await overviewRes.json();

        // 2. Fetch staff performance
        const staffRes = await fetch('http://localhost:5000/api/analytics/staff-performance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const stData = await staffRes.json();

        // 3. Fetch monthly revenue curve
        const revenueRes = await fetch('http://localhost:5000/api/analytics/revenue', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const revData = await revenueRes.json();

        if (oData.success) {
          setStats(oData.data);
        }

        if (stData.success && stData.data.length > 0) {
          const perf = stData.data.map(item => {
            const parts = item.barberName.split(' ');
            const displayName = parts.length > 1 ? `${parts[0][0]}. ${parts[1]}` : item.barberName;
            return {
              name: displayName,
              appointments: item.completedAppointments,
              commission: item.commissionEarned
            };
          });
          setStylistPerformance(perf);
        } else {
          setStylistPerformance([
            { name: 'M. Vance', appointments: 0, commission: 0 },
            { name: 'S. Chen', appointments: 0, commission: 0 }
          ]);
        }

        if (revData.success && revData.data?.monthlyData) {
          const chart = revData.data.monthlyData.map(item => ({
            month: item.month,
            value: item.totalRevenue
          }));
          setFinancialData(chart);
        }
      } catch (err) {
        console.error('Failed to load server-side aggregates:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [token]);

  return (
    <div className="flex flex-col gap-6 col-span-3">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Corporate Total Revenue</span>
          <h2 className="text-3xl font-extrabold text-indigo-600">
            ₹{loading ? '0.00' : stats.totalRevenue?.toFixed(2)}
          </h2>
          <span className="text-xs text-emerald-600 font-semibold">+28% vs last month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Registrations</span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {loading ? '...' : `${stats.totalCustomers} Clients`}
          </h2>
          <span className="text-xs text-emerald-600 font-semibold">+120 new this week</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Services Offered</span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {loading ? '...' : stats.activeServices} Treatments
          </h2>
          <span className="text-xs text-slate-400 font-medium">Standard catalog items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Sales Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" />
            Corporate Sales Over Time
          </h3>
          <CustomChart type="line" data={financialData} xKey="month" yKey="value" colors={['#4f46e5']} />
        </div>

        {/* Performance Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" />
            Stylist Comparative Bookings
          </h3>
          <CustomChart type="bar" data={stylistPerformance} xKey="name" yKey="appointments" colors={['#4f46e5']} />
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPanel;
