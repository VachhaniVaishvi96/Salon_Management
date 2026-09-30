import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Clock, User, XCircle } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

function UpcomingVisits() {
  const { token } = useSelector(state => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load appointments from backend
  const loadAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        // Filter out completed and cancelled appointments
        const active = resData.data.filter(apt => 
          apt.status !== 'Completed' && apt.status !== 'Cancelled'
        );
        setAppointments(active);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          loadAppointments();
        } else {
          alert(resData.message || 'Failed to cancel appointment.');
        }
      } catch (err) {
        alert('Could not connect to service to cancel booking.');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full relative">
      <h3 className="serif-font text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
        <Calendar size={20} className="text-indigo-600" />
        Upcoming Appointments
      </h3>

      {loading ? (
        <div className="text-slate-400 text-center py-10 text-sm font-medium">
          Loading upcoming appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-slate-400 text-center py-10 text-sm font-medium">
          No upcoming appointments scheduled.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-slate-50 border border-slate-200 rounded-lg p-5 relative shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-800">{apt.service?.name}</h4>
                  <span className="text-sm text-indigo-600 font-bold">₹{apt.totalAmount?.toFixed(2)}</span>
                </div>
                <StatusBadge status={apt.status} />
              </div>

              <div className="flex flex-col gap-2 text-sm text-slate-600 font-semibold mb-6">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span>Stylist: {apt.barber?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Date: {apt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  <span>Time: {apt.timeSlot}</span>
                </div>
              </div>

              {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                <button 
                  onClick={() => handleCancel(apt._id)}
                  className="absolute bottom-5 right-5 bg-transparent border-none text-red-655 text-red-600 hover:text-red-800 cursor-pointer flex items-center gap-1 text-xs font-bold transition-all"
                >
                  <XCircle size={14} />
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingVisits;
