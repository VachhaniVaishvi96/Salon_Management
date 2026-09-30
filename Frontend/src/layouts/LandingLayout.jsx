import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LandingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-700">
      <Header />
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default LandingLayout;
