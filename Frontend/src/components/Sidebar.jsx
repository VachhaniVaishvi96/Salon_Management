import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Calendar, 
  ShoppingBag, 
  ClipboardList, 
  Scissors,
  LogOut,
  ShieldCheck,
  Award,
  History
} from 'lucide-react';
import { changeRole, logout, loginSuccess } from '../store/authSlice';

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const activeRole = user.role;

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    
    // Credentials mapping for background role switching
    const roleCredentials = {
      Customer: { email: 'alex@example.com', password: 'customer123' },
      Barber: { email: 'marcus@salon.com', password: 'barber123' },
      Receptionist: { email: 'emily@salon.com', password: 'recep123' },
      Admin: { email: 'admin@salon.com', password: 'admin123' }
    };

    const creds = roleCredentials[newRole];
    if (creds) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(creds)
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          dispatch(loginSuccess({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            token: data.token
          }));
        }
      } catch (err) {
        console.error('Failed background role synchronization:', err);
      }
    } else {
      dispatch(changeRole(newRole));
    }
    
    // Redirect to the appropriate dashboard
    const rolePath = newRole.toLowerCase();
    navigate(`/dashboard/${rolePath}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Menu lists by role
  const menus = {
    Customer: [
      { name: 'Overview', path: '/dashboard/customer', icon: User },
      { name: 'Upcoming Visits', path: '/dashboard/customer/appointments', icon: Calendar },
      { name: 'Favored Treatments', path: '/dashboard/customer/treatments', icon: Award },
      { name: 'Past Visit Ledger', path: '/dashboard/customer/ledger', icon: History },
      { name: 'Retail Purchases', path: '/dashboard/customer/purchases', icon: ShoppingBag },
      { name: 'Product Store', path: '/dashboard/store', icon: ShoppingBag }
    ],
    Barber: [
      { name: 'Assignments', path: '/dashboard/barber', icon: ClipboardList },
    ],
    Receptionist: [
      { name: 'Master Grid', path: '/dashboard/receptionist', icon: Calendar },
    ],
    Admin: [
      { name: 'Management', path: '/dashboard/admin', icon: ShieldCheck },
      { name: 'Product Store', path: '/dashboard/store', icon: ShoppingBag }
    ]
  };

  const roleMenu = menus[activeRole] || [];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col p-6 z-50">
      {/* Brand logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 w-9 h-9 rounded-full flex items-center justify-center shadow-md shadow-indigo-150">
          <Scissors size={16} className="text-white" />
        </div>
        <span className="serif-font text-xl font-bold tracking-wide text-slate-800">
          AURUM PORTAL
        </span>
      </div>

      {/* Role Selector Card for Demo/Evaluation */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 shadow-sm">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
          Testing User Role
        </div>
        <select 
          value={activeRole} 
          onChange={handleRoleChange}
          className="w-full bg-white text-indigo-600 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-bold outline-none cursor-pointer shadow-sm focus:border-indigo-500"
        >
          <option value="Customer">Customer</option>
          <option value="Barber">Barber / Stylist</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Admin">Administrator</option>
        </select>
      </div>

      {/* Navigation Menus */}
      <nav className="flex flex-col gap-2 flex-grow overflow-y-auto pr-1">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider pl-2 mb-2">
          Menu Options
        </div>
        {roleMenu.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.path}
              end
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-slate-605 text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Area with User Profile and Logout */}
      <div className="border-t border-slate-100 pt-5 flex flex-col gap-4">
        
        {/* Clickable Profile Card leading to settings */}
        <Link 
          to="/dashboard/settings" 
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
          title="Account Portal Settings"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex flex-shrink-0 items-center justify-center group-hover:border-indigo-300 transition-colors">
            <User size={18} className="text-indigo-600" />
          </div>
          <div className="overflow-hidden text-left">
            <div className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
              {user.name || 'Anonymous'}
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              {activeRole}
            </div>
          </div>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-655 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
