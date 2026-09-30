import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CalendarRange, ShieldAlert } from 'lucide-react';

function StylistAllocator() {
  const { token } = useSelector(state => state.auth);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const loadStaffAllocation = async () => {
      try {
        // 1. Fetch active barbers
        const bRes = await fetch('http://localhost:5000/api/users/barbers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bData = await bRes.json();

        // 2. Fetch today's appointments to calculate booking load
        const aptRes = await fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const aptData = await aptRes.json();

        // 3. Fetch approved time-offs to verify status
        const toRes = await fetch('http://localhost:5000/api/staff/time-off', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const toData = await toRes.json();

        if (bData.success) {
          const mapped = bData.data.map(barber => {
            // Count today's active appointments
            const activeLoad = aptData.success
              ? aptData.data.filter(apt => 
                  apt.barber?._id === barber._id && 
                  apt.date === todayStr && 
                  ['Pending', 'Confirmed', 'In Progress'].includes(apt.status)
                ).length
              : 0;

            // Check if barber is on approved time-off today
            const isOnLeave = toData.success
              ? toData.data.some(leave => 
                  leave.barber?._id === barber._id && 
                  leave.status === 'Approved' && 
                  leave.startDate <= todayStr && 
                  leave.endDate >= todayStr
                )
              : false;

            return {
              name: barber.name,
              status: isOnLeave ? 'On Break' : 'On Shift',
              activeBookings: activeLoad,
              skills: barber.specializations || ['Grooming']
            };
          });

          setStaff(mapped);
        }
      } catch (err) {
        console.error('Failed to load stylist allocation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStaffAllocation();
  }, [token]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <CalendarRange size={20} className="text-indigo-600" />
        Stylist Allocation & Shift Logs
      </h3>

      {loading ? (
        <div className="text-slate-400 text-xs text-center py-6">Loading stylist rosters...</div>
      ) : staff.length === 0 ? (
        <div className="text-slate-400 text-xs text-center py-6">No stylists active today.</div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
          {staff.map((s, idx) => (
            <div 
              key={idx} 
              className={`border rounded-lg p-3.5 flex flex-col shadow-sm hover:shadow-md transition-shadow ${
                s.status === 'On Shift' 
                  ? 'bg-emerald-50/20 border-emerald-100' 
                  : 'bg-amber-50/20 border-amber-100'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  s.status === 'On Shift' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>{s.status}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {s.skills.map((sk, sIdx) => (
                  <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">{sk}</span>
                ))}
              </div>

              <div className="text-xs text-slate-505 text-slate-550 text-slate-500 font-semibold flex justify-between items-center">
                <span>Load: <strong className="text-slate-700">{s.activeBookings} Bookings Today</strong></span>
                {s.activeBookings > 2 && (
                  <span className="text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 text-[10px]">
                    <ShieldAlert size={10} /> High Load
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StylistAllocator;
