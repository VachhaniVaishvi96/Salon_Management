import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Clock } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

function ReservationGrid() {
  const { token } = useSelector(state => state.auth);
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30'
  ];

  // Grid date state defaulting to local date (YYYY-MM-DD)
  const [gridDate, setGridDate] = useState(new Date().toLocaleDateString('en-CA'));

  // Dynamic state loaded from DB
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedCell, setSelectedCell] = useState(null);
  const [formClientId, setFormClientId] = useState('');
  const [formServiceId, setFormServiceId] = useState('');

  // Fetch initial data
  const loadGridData = async () => {
    try {
      // 1. Fetch active barbers
      const bRes = await fetch('http://localhost:5000/api/users/barbers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bData = await bRes.json();
      
      // 2. Fetch all appointments to filter for the selected date
      const aptRes = await fetch('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const aptData = await aptRes.json();

      // 3. Fetch up to 100 customer records directly to populate assignment dropdown
      const uRes = await fetch('http://localhost:5000/api/users?role=Customer&limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uData = await uRes.json();

      // 4. Fetch all services
      const sRes = await fetch('http://localhost:5000/api/services');
      const sData = await sRes.json();

      if (bData.success) setBarbers(bData.data);
      if (sData.success) setServices(sData.data);
      if (uData.success) setClients(uData.data);
      
      if (aptData.success) {
        // Filter appointments scheduled for the selected grid date
        const gridBookings = aptData.data.filter(apt => apt.date === gridDate);
        setAppointments(gridBookings);
      }
    } catch (err) {
      console.error('Failed to load matrix coordinator data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGridData();
  }, [token, gridDate]); // Reload grid whenever the selected date changes!

  const handleCellClick = (barber, time, booking) => {
    setSelectedCell({ barber, time, booking });
    if (booking) {
      setFormClientId(booking.customer?._id || '');
      setFormServiceId(booking.service?._id || '');
    } else {
      setFormClientId('');
      setFormServiceId('');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!formClientId || !formServiceId || !selectedCell) {
      alert('Please select both a client and a service.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customer: formClientId,
          service: formServiceId,
          barber: selectedCell.barber._id,
          date: gridDate,
          timeSlot: selectedCell.time
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        loadGridData();
        setSelectedCell(null);
      } else {
        alert(resData.message || 'Failed to place booking.');
      }
    } catch (err) {
      alert('Could not submit booking details.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedCell || !selectedCell.booking) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedCell.booking._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        loadGridData();
        setSelectedCell(null);
      } else {
        alert(resData.message || 'Failed to change booking status.');
      }
    } catch (err) {
      alert('Could not connect to update booking status.');
    }
  };

  const handleRemoveBooking = async () => {
    if (!selectedCell || !selectedCell.booking) return;
    if (window.confirm('Delete this reservation?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${selectedCell.booking._id}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          loadGridData();
          setSelectedCell(null);
        } else {
          alert(resData.message || 'Failed to cancel reservation.');
        }
      } catch (err) {
        alert('Could not connect to cancel reservation.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm py-16 text-center text-slate-500 font-semibold">
        Loading master reservation matrix...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-3 relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-600" />
          Multi-Stylist Master Reservation Matrix
        </h3>
        
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={gridDate}
            onChange={(e) => setGridDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none transition-all cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-medium">Click cells to assign/manage</span>
        </div>
      </div>

      {/* Grid Table */}
      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-[100px] text-center p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Time</th>
              {barbers.map(barber => (
                <th key={barber._id} className="text-center p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] truncate">{barber.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {timeSlots.map(time => (
              <tr key={time} className="divide-x divide-slate-100">
                <td className="text-center font-bold text-slate-700 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock size={12} className="text-indigo-600" />
                    {time}
                  </div>
                </td>
                {barbers.map(barber => {
                  const booking = appointments.find(b => 
                    b.barber?._id === barber._id && b.timeSlot === time
                  );
                  
                  return (
                    <td 
                      key={barber._id} 
                      onClick={() => handleCellClick(barber, time, booking)}
                      className="cursor-pointer p-2.5 hover:bg-indigo-50/20 transition-all"
                    >
                      {booking ? (
                        <div className="bg-indigo-50/20 border border-indigo-50 rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm">
                          <div className="font-bold text-slate-800 text-xs truncate">
                            {booking.customer?.name || 'Client'}
                          </div>
                          <div className="text-[10px] text-indigo-600 font-semibold truncate">
                            {booking.service?.name}
                          </div>
                          <div>
                            <StatusBadge status={booking.status} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-xs text-center font-medium italic py-5">
                          + Available
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Management Drawer Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl w-full max-w-[400px] flex flex-col gap-5 animate-fade-in">
            <div>
              <h3 className="serif-font text-lg font-bold text-slate-800 mb-1">
                {selectedCell.booking ? 'Manage Booking' : 'Create Reservation'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Stylist: <span className="text-slate-800 font-bold">{selectedCell.barber?.name}</span> <br />
                Time Slot: <span className="text-slate-800 font-bold">{selectedCell.time}</span> <br />
                Date: <span className="text-slate-800 font-bold">{gridDate}</span>
              </p>
            </div>

            {selectedCell.booking ? (
              // Manage Existing Booking Flow
              <>
                <div className="p-3.5 border border-slate-100 rounded-lg bg-slate-50 flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-slate-800">Client: {selectedCell.booking.customer?.name}</h4>
                  <p className="text-xs text-indigo-600 font-semibold">Service: {selectedCell.booking.service?.name}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    Current Status: <StatusBadge status={selectedCell.booking.status} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Set Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleStatusChange('Confirmed')} className="py-1.5 border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">Confirm</button>
                    <button onClick={() => handleStatusChange('In Progress')} className="py-1.5 border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">Start</button>
                    <button onClick={() => handleStatusChange('Completed')} className="py-1.5 border border-purple-200 hover:bg-purple-50 text-purple-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">Complete</button>
                    <button onClick={() => handleStatusChange('Cancelled')} className="py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">Cancel</button>
                  </div>

                  <button 
                    onClick={handleRemoveBooking} 
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all mt-2 cursor-pointer"
                  >
                    Delete Reservation
                  </button>
                </div>
              </>
            ) : (
              // Create New Booking Flow
              <form onSubmit={handleCreateBooking} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Client</label>
                  <select 
                    value={formClientId} 
                    onChange={e => setFormClientId(e.target.value)} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:border-indigo-500 outline-none cursor-pointer font-bold"
                    required
                  >
                    <option value="">-- Choose Client --</option>
                    {clients.map(c => (
                      <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Service</label>
                  <select 
                    value={formServiceId} 
                    onChange={e => setFormServiceId(e.target.value)} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:border-indigo-500 outline-none cursor-pointer font-bold"
                    required
                  >
                    <option value="">-- Choose Service --</option>
                    {services.map(s => (
                      <option key={s._id} value={s._id}>{s.name} (₹{s.price})</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all mt-2 cursor-pointer"
                >
                  Create Reservation
                </button>
              </form>
            )}

            <button 
              onClick={() => setSelectedCell(null)} 
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationGrid;
