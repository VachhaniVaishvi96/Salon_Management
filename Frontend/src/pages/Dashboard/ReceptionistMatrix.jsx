import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReservationGrid from '../../components/Dashboard/Receptionist/ReservationGrid';
import ClientLookup from '../../components/Dashboard/Receptionist/ClientLookup';
import StylistAllocator from '../../components/Dashboard/Receptionist/StylistAllocator';

function ReceptionistMatrix() {
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    todayAppointments: [],
    pendingAppointments: [],
    availableBarbers: [],
    recentCustomers: [],
    todayCount: 0,
    pendingCount: 0
  });

  const loadDashboardSummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/receptionist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setData(resData.data);
      }
    } catch (err) {
      console.error('Failed to load receptionist dashboard aggregates:', err);
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
        <h1 className="serif-font text-3xl font-bold text-slate-800 mb-2">Receptionist Matrix Coordinator</h1>
        <p className="text-sm text-slate-505 text-slate-500">Manage master stylist calendar grids, client records, and booking shifts.</p>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm animate-fade-in">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Active Queue</span>
          <h2 className="text-3xl font-extrabold text-indigo-650 text-indigo-600">
            {loading ? '...' : `${data.todayCount} Sessions`}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Scheduled bookings for today</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm animate-fade-in">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Awaiting Approval</span>
          <h2 className="text-3xl font-extrabold text-amber-600">
            {loading ? '...' : `${data.pendingCount} Bookings`}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Pending client requests</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm animate-fade-in">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Headcount</span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {loading ? '...' : `${data.availableBarbers?.length || 0} Stylists`}
          </h2>
          <span className="text-xs text-slate-450 text-slate-400 font-medium">Barbers on shift duty today</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Row 1: Left - master reservation grid (full 3 columns width) */}
        <div className="lg:col-span-3">
          <ReservationGrid />
        </div>
        
        {/* Row 2: Client search and shift allocator */}
        <div className="lg:col-span-2">
          <ClientLookup />
        </div>
        <StylistAllocator />
      </div>

    </div>
  );
}

export default ReceptionistMatrix;
