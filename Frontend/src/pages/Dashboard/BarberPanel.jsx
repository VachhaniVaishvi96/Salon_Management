import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ShiftSchedule from '../../components/Dashboard/Barber/ShiftSchedule';
import ScheduleBlocker from '../../components/Dashboard/Barber/ScheduleBlocker';
import EarningsLogs from '../../components/Dashboard/Barber/EarningsLogs';

function BarberPanel() {
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    todayAppointments: [],
    upcomingAppointments: [],
    monthlyEarnings: { totalEarnings: 0, totalCommission: 0, servicesCompleted: 0 },
    totalCompleted: 0,
    commissionRate: 15
  });

  const loadDashboardSummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/barber', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setData(resData.data);
      }
    } catch (err) {
      console.error('Failed to load stylist dashboard aggregates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardSummary();
  }, [token]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header Info */}
      <div>
        <h1 className="serif-font text-3xl font-bold text-slate-800 mb-2">Barber/Stylist Operator Hub</h1>
        <p className="text-sm text-slate-505 text-slate-500">Log shifts, set calendar blockers, and trace commission earnings.</p>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm animate-fade-in">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Workload</span>
          <h2 className="text-3xl font-extrabold text-indigo-600">
            {loading ? '...' : `${data.todayAppointments?.length || 0} Sessions`}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Scheduled for your shift today</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm animate-fade-in">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Month Share</span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            ₹{loading ? '0.00' : data.monthlyEarnings?.totalEarnings?.toFixed(2)}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Commissions earned this month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm animate-fade-in">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stylist Contract Rate</span>
          <h2 className="text-3xl font-extrabold text-emerald-600">
            {loading ? '0' : data.commissionRate}% Cut
          </h2>
          <span className="text-xs text-slate-400 font-medium">Standard percentage of service price</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Daily schedule and blocker controls */}
        <ShiftSchedule />
        <ScheduleBlocker />

        {/* Commissions logs and earnings charts */}
        <EarningsLogs />
      </div>

    </div>
  );
}

export default BarberPanel;
