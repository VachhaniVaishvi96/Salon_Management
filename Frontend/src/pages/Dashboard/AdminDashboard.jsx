import React, { useState } from 'react';
import AnalyticsPanel from '../../components/Dashboard/Admin/AnalyticsPanel';
import StaffManager from '../../components/Dashboard/Admin/StaffManager';
import PricingControls from '../../components/Dashboard/Admin/PricingControls';
import InventoryTracker from '../../components/Dashboard/Admin/InventoryTracker';
import OrderManager from '../../components/Dashboard/Admin/OrderManager';
import PayoutManager from '../../components/Dashboard/Admin/PayoutManager';
import { BarChart3, Users, Sliders, Package, ShoppingBag, Coins } from 'lucide-react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // Options: overview | staff | pricing | inventory | orders | payouts

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Info */}
      <div>
        <h1 className="serif-font text-3xl font-bold text-slate-800 mb-2">Administrator Operations Core</h1>
        <p className="text-sm text-slate-505 text-slate-500">Manage stylists, service prices, stock controls, customer order fulfillment, and commission payouts.</p>
      </div>

      {/* Premium Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 size={15} />
          Overview Stats
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'staff'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users size={15} />
          Stylist Registry
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pricing'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sliders size={15} />
          Pricing Controls
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Package size={15} />
          Inventory Tracker
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag size={15} />
          Customer Orders
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'payouts'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Coins size={15} />
          Payouts & Wages
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-2">
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <AnalyticsPanel />
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="animate-fade-in max-w-5xl">
            <StaffManager />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="animate-fade-in max-w-3xl">
            <PricingControls />
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="animate-fade-in max-w-5xl">
            <InventoryTracker />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in max-w-5xl">
            <OrderManager />
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="animate-fade-in max-w-5xl">
            <PayoutManager />
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
