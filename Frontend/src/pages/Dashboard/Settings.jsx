import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, ShieldCheck, KeyRound, Save } from 'lucide-react';
import { loginSuccess } from '../../store/authSlice';

function Settings() {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  // Profile forms states
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');

  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback states
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setProfileMessage({ text: 'Profile details updated successfully.', type: 'success' });
        // Sync Redux state
        dispatch(loginSuccess({
          id: resData.data._id || resData.data.id,
          name: resData.data.name,
          email: resData.data.email,
          role: resData.data.role,
          token: token // Retain existing JWT token
        }));
      } else {
        setProfileMessage({ text: resData.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setProfileMessage({ text: 'Could not connect to update profile.', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setPasswordMessage({ text: 'Password changed successfully.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ text: resData.message || 'Failed to change password.', type: 'error' });
      }
    } catch (err) {
      setPasswordMessage({ text: 'Could not connect to change password.', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="serif-font text-3xl font-bold text-slate-800 mb-2">Account Portal Settings</h1>
        <p className="text-sm text-slate-500">Update your credentials, modify phone contacts, or refresh your account password.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <User size={20} className="text-indigo-600" />
            Personal Profile Details
          </h3>

          {profileMessage.text && (
            <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
              profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-red-50 text-red-700 border border-red-150'
            }`}>
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Contact</label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                placeholder="No number configured"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Authorized Role</label>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 font-bold">
                <ShieldCheck size={14} className="text-indigo-600" />
                {user.role} (System Verified)
              </div>
            </div>

            <button 
              type="submit" 
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all mt-2 cursor-pointer"
            >
              <Save size={14} /> Update Profile
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <KeyRound size={20} className="text-indigo-600" />
            Security Password Manager
          </h3>

          {passwordMessage.text && (
            <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
              passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-red-50 text-red-700 border border-red-150'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all font-semibold"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all mt-2 cursor-pointer"
            >
              <Save size={14} /> Save New Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;
