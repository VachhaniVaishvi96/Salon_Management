import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Calendar, Award, History, ShoppingBag, ArrowRight } from 'lucide-react';

function CustomerDashboard() {
  const { user, token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  // Consolidated dashboard data
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
     pastAppointments: [],
    recentOrders: [],
    favoriteServices: [],
    totalSpent: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    const loadDashboardSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/customer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();
        if (resData.success) {
          setDashboardData(resData.data);
        }
      } catch (err) {
        console.error('Failed to load customer dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardSummary();
  }, [token]);

  const {
    upcomingAppointments,
    pastAppointments,
    recentOrders,
    favoriteServices,
    totalSpent,
    totalAppointments
  } = dashboardData;

  const favoriteServiceName = favoriteServices?.[0]?.name || 'No bookings yet';

  const navigationCards = [
    {
      title: 'Upcoming Appointments',
      desc: 'View or cancel your scheduled grooming sessions and check stylist details.',
      path: '/dashboard/customer/appointments',
      icon: Calendar,
      badge: `${upcomingAppointments?.length || 0} active`,
      color: 'text-indigo-650 text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Favored Treatments',
      desc: 'Check your personalized service recommendations based on your transaction history.',
      path: '/dashboard/customer/treatments',
      icon: Award,
      badge: `${favoriteServices?.length || 0} favorites`,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      title: 'Past Visit Ledger',
      desc: 'Review completed appointments, receipt costs, and stylist evaluations.',
      path: '/dashboard/customer/ledger',
      icon: History,
      badge: `${totalAppointments || 0} visits`,
      color: 'text-emerald-700 text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Retail Purchases',
      desc: 'Inspect store purchases, transaction receipts, and order tracking logs.',
      path: '/dashboard/customer/purchases',
      icon: ShoppingBag,
      badge: `${recentOrders?.length || 0} orders`,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Welcome Greeting Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="serif-font text-3xl font-bold text-slate-800 mb-2">Welcome Back, {user.name}</h1>
          <p className="text-sm text-slate-505 text-slate-500">Track your active bookings, view recommended services, and access your retail store order receipts.</p>
        </div>
        <Link 
          to="/book" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
        >
          Book Appointment
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Portal Spendings</span>
          <h2 className="text-3xl font-extrabold text-indigo-600">
            ₹{loading ? '0.00' : totalSpent?.toFixed(2)}
          </h2>
          <span className="text-xs text-slate-450 text-slate-400 font-medium">Aggregated completed bookings</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sessions Completed</span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {loading ? '...' : totalAppointments} Visits
          </h2>
          <span className="text-xs text-slate-450 text-slate-400 font-medium">Across all stylists</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preferred Treatment</span>
          <h2 className="text-xl font-extrabold text-slate-800 truncate mt-1">
            {loading ? '...' : favoriteServiceName}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Your most frequented service</span>
        </div>
      </div>

      {/* Grid boxes for separate customer child pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-655 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {loading ? '...' : card.badge}
                  </span>
                </div>
                <Link 
                  to={card.path} 
                  className="text-xs text-indigo-655 hover:text-indigo-850 font-bold flex items-center gap-1 text-indigo-600 transition-colors"
                >
                  View Details
                  <ArrowRight size={12} />
                </Link>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{card.title}</h3>
              <p className="text-xs text-slate-550 text-slate-500 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default CustomerDashboard;
