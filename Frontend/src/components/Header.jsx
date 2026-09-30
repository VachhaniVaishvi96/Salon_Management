import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Scissors, LogIn, LayoutDashboard } from 'lucide-react';
import { logout } from '../store/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const getDashboardPath = () => {
    if (!user || !user.role) return '/login';
    const role = user.role.toLowerCase();
    if (role === 'customer') return '/dashboard/customer';
    if (role === 'barber') return '/dashboard/barber';
    if (role === 'receptionist') return '/dashboard/receptionist';
    if (role === 'admin') return '/dashboard/admin';
    return '/login';
  };

  return (
    <header className="sticky top-0 z-50 h-17.5 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="bg-linear-to-r from-indigo-600 to-violet-600 w-9.5 height-[38px] h-9.5 rounded-full flex items-center justify-center shadow-md shadow-indigo-200">
          <Scissors size={18} className="text-white" />
        </div>
        <span className="serif-font text-xl font-bold tracking-wide bg-linear-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">
          AURUM
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex items-center gap-8">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About Us</Link>
        <Link to="/services" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Services</Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button 
              onClick={() => navigate(getDashboardPath())} 
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
            >
              <LayoutDashboard size={16} />
              Portal
            </button>
            <button 
              onClick={handleAuthAction} 
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={handleAuthAction} 
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
          >
            <LogIn size={16} />
            Sign In
          </button>
        )}
        
        <button 
          onClick={() => navigate('/book')} 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Book Appointment
        </button>
      </div>
    </header>
  );
}

export default Header;
