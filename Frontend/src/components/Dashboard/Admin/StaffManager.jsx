import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, Plus, Trash2, Edit, CalendarDays, Check, X } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

function StaffManager() {
  const { token } = useSelector(state => state.auth);
  
  // Registry states
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time off states
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('Haircut');
  const [rate, setRate] = useState(15);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState(null);

  const loadStaff = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setStaff(resData.data);
      }
    } catch (err) {
      console.error('Failed to load staff roster:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaves = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/staff/time-off', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setLeaves(resData.data);
      }
    } catch (err) {
      console.error('Failed to load leave requests:', err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    loadStaff();
    loadLeaves();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill out Name and Email.');
      return;
    }

    try {
      if (editingEmpId) {
        // Edit flow
        const response = await fetch(`http://localhost:5000/api/staff/${editingEmpId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            specializations: [specialty],
            commissionRate: Number(rate)
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          loadStaff();
          resetForm();
        } else {
          alert(resData.message || 'Failed to update employee details.');
        }
      } else {
        // Create flow
        const response = await fetch('http://localhost:5000/api/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            email,
            password: 'staffpassword123',
            role: specialty === 'Facials' ? 'Receptionist' : 'Barber',
            specializations: [specialty],
            commissionRate: Number(rate),
            workingHours: { start: '09:00', end: '17:00' },
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          })
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          loadStaff();
          resetForm();
        } else {
          alert(resData.message || 'Failed to register new employee.');
        }
      }
    } catch (err) {
      alert('Could not connect to staff service.');
    }
  };

  const handleEdit = (emp) => {
    setEditingEmpId(emp._id);
    setName(emp.name);
    setEmail(emp.email);
    setSpecialty(emp.specializations?.[0] || 'Haircut');
    setRate(emp.commissionRate || 15);
    setShowAddForm(true);
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          loadStaff();
        } else {
          alert(resData.message || 'Failed to delete employee.');
        }
      } catch (err) {
        alert('Could not connect to delete employee.');
      }
    }
  };

  const handleLeaveAction = async (id, actionStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/staff/time-off/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: actionStatus })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        loadLeaves();
      } else {
        alert(resData.message || 'Failed to process leave request.');
      }
    } catch (err) {
      alert('Could not connect to update leave status.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRate(15);
    setEditingEmpId(null);
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-8 col-span-2">
      
      {/* Employee Registry Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            Employee & Stylist Registry
          </h3>
          <button 
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }} 
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer animate-fade-in"
          >
            <Plus size={14} /> Add Stylist
          </button>
        </div>

        {/* Add Employee Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-inner animate-fade-in">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all" 
                placeholder="John Doe" 
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all disabled:opacity-50" 
                placeholder="john@salon.com" 
                disabled={!!editingEmpId}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Specialty</label>
              <select 
                value={specialty} 
                onChange={e => setSpecialty(e.target.value)} 
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              >
                <option value="Haircut">Haircut</option>
                <option value="Beard Styling">Beard Styling</option>
                <option value="Hair Coloring">Hair Coloring</option>
                <option value="Facials">Facials</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Commission Rate (%)</label>
              <input 
                type="number" 
                value={rate} 
                onChange={e => setRate(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all" 
                min="1" 
                max="100" 
              />
            </div>
            <div className="md:col-span-2 flex gap-2.5 mt-2">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer">
                {editingEmpId ? 'Update Stylist' : 'Save Stylist'}
              </button>
              <button type="button" onClick={resetForm} className="border border-slate-200 hover:bg-white text-slate-655 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">Cancel</button>
            </div>
          </form>
        )}

        {/* Staff Table */}
        <div className="border border-slate-100 rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">ID</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stylist Name</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Email</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Specialty</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Rate (%)</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                    Loading employee registry...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                    No staff members registered.
                  </td>
                </tr>
              ) : (
                staff.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">{emp._id?.substring(emp._id.length - 8)}</td>
                    <td className="p-4 font-bold text-slate-800">{emp.name}</td>
                    <td className="p-4 text-slate-600">{emp.email}</td>
                    <td className="p-4 text-slate-600">{emp.specializations?.[0] || 'General'}</td>
                    <td className="p-4 font-bold text-indigo-600">{emp.commissionRate || 15}%</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(emp)} 
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => handleRemove(emp._id)} 
                          className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Approvals Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <CalendarDays size={20} className="text-indigo-600" />
          Stylist Leaves & Blockers Approvals Desk
        </h3>

        <div className="border border-slate-100 rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stylist</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Date Range</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Block Reason</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Decisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingLeaves ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                    Loading requested leave sheets...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                    No leave or schedule blocking requests pending.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{leave.barber?.name}</td>
                    <td className="p-4 text-slate-655 text-xs font-semibold">
                      {leave.startDate} {leave.startDate !== leave.endDate && `to ${leave.endDate}`}
                    </td>
                    <td className="p-4 text-slate-600 text-xs italic">{leave.reason}</td>
                    <td className="p-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="p-4">
                      {leave.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleLeaveAction(leave._id, 'Approved')}
                            className="p-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded transition-colors cursor-pointer"
                            title="Approve Blocker"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                            className="p-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded transition-colors cursor-pointer"
                            title="Reject Blocker"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Evaluated</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default StaffManager;
