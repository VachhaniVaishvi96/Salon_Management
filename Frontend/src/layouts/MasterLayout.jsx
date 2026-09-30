import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';

function MasterLayout() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Authentication Route Protection Guard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Right side content pane */}
      <div className="ml-64 flex-grow flex flex-col min-h-screen w-[calc(100%-16rem)]">
        {/* Dashboard Top Header Bar */}
        <header className="h-[70px] bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-10 sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Welcome back, <span className="text-indigo-600 font-bold">{user.name}</span>!
            </h2>
            <p className="text-xs text-slate-500">
              Active Session: <strong className="text-slate-700">{user.role} Portal</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md border border-slate-200 font-medium">
              Location: <strong>Main Salon</strong>
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md border border-emerald-200 font-semibold">
              System Online
            </span>
          </div>
        </header>

        {/* Dashboard Sub-content Scroll Area */}
        <main className="flex-grow p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MasterLayout;
