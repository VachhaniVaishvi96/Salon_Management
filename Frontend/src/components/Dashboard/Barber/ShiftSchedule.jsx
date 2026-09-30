import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList, User, Clock, CalendarDays } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

function ShiftSchedule() {
  const { token } = useSelector(state => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString('en-CA');

  const loadAssignments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/barber', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setAppointments(resData.data);
      }
    } catch (err) {
      console.error('Failed to load assigned appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        // Reload list
        loadAssignments();
      } else {
        alert(resData.message || 'Failed to update appointment status.');
      }
    } catch (err) {
      alert('Could not connect to update appointment status.');
    }
  };

  // Filter lists: Today's date only vs Future dates only
  const todayAppointments = appointments.filter(apt => apt.date === todayStr);
  const upcomingAppointments = appointments.filter(apt => apt.date > todayStr);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 col-span-2 flex flex-col gap-8">
      
      {/* Today's Assignments */}
      <div>
        <h3 className="serif-font text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ClipboardList size={20} className="text-indigo-600" />
          Today's Appointments ({todayStr})
        </h3>

        <div className="border border-slate-100 rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Time</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Client</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Service Details</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Price</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Adjust Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                    Loading shift assignments...
                  </td>
                </tr>
              ) : todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                    No appointments assigned to you today.
                  </td>
                </tr>
              ) : (
                todayAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-indigo-600" />
                        {apt.timeSlot}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <User size={14} className="text-slate-400" />
                        {apt.customer?.name || 'Walk-in Client'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-655 font-semibold">{apt.service?.name}</td>
                    <td className="p-4 font-bold text-indigo-600">${apt.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="p-4">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt._id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 shadow-sm transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Assignments (Card Grid) */}
      <div>
        <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <CalendarDays size={20} className="text-indigo-600" />
          Upcoming Assignments (Future Dates)
        </h3>

        {loading ? (
          <div className="text-slate-400 text-sm font-medium py-10 text-center">
            Loading upcoming assignments...
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="text-slate-400 text-sm font-semibold py-10 text-center border border-slate-100 rounded-lg bg-slate-50/50">
            No upcoming appointments scheduled for future dates.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map((apt) => (
              <div key={apt._id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative">
                
                {/* Card Title Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 text-slate-800">{apt.service?.name}</h4>
                    <span className="text-xs text-indigo-600 font-bold">${apt.totalAmount?.toFixed(2)}</span>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>

                {/* Card Body Details */}
                <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-450 text-slate-400" />
                    <span>Client: {apt.customer?.name || 'Walk-in Client'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-450 text-slate-400" />
                    <span>Date & Time: {apt.date} at {apt.timeSlot}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="border-t border-slate-200/60 pt-3.5 flex justify-between items-center mt-auto">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adjust Status</span>
                  <select
                    value={apt.status}
                    onChange={(e) => updateStatus(apt._id, e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 shadow-sm transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ShiftSchedule;
