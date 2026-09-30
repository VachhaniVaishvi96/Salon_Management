import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Scissors, User, Calendar, Clock, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

function BookAppointment() {
  // 1. Fetch authentication status and JWT token from Redux store
  const { isAuthenticated, token } = useSelector(state => state.auth);

  // 2. Auth Guard: If the user is NOT logged in, redirect them to the Sign In page immediately
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Backend loaded data states
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Load Services and Barbers from backend
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const sRes = await fetch('http://localhost:5000/api/services');
        const sData = await sRes.json();
        
        const bRes = await fetch('http://localhost:5000/api/users/barbers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bData = await bRes.json();

        if (sData.success) {
          setServices(sData.data);
        }
        if (bData.success) {
          setBarbers(bData.data);
        }
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [token]);

  // Load available time slots when date and barber change
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      setLoadingSlots(true);
      fetch(`http://localhost:5000/api/appointments/available-slots?barberId=${selectedBarber._id}&date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setAvailableSlots(resData.data);
        } else {
          setAvailableSlots([]);
        }
        setLoadingSlots(false);
      })
      .catch(err => {
        console.error('Failed to load slots:', err);
        setAvailableSlots([]);
        setLoadingSlots(false);
      });
    }
  }, [selectedBarber, selectedDate, token]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setStep(4);
  };

  const handleSubmitBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          service: selectedService._id,
          barber: selectedBarber._id,
          date: selectedDate,
          timeSlot: selectedTimeSlot
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setBookingId(resData.data._id);
        setBookingConfirmed(true);
      } else {
        alert(resData.message || 'Failed to submit appointment reservation.');
      }
    } catch (err) {
      alert('Could not connect to appointment service.');
    }
  };

  const handleReset = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setBookingConfirmed(false);
    setStep(1);
  };

  // Step Indicators
  const steps = [
    { number: 1, label: 'Service' },
    { number: 2, label: 'Stylist' },
    { number: 3, label: 'Schedule' },
    { number: 4, label: 'Confirm' }
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-slate-500 font-semibold">
        Loading salon booking catalog...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 flex flex-col gap-8 bg-slate-50 w-full">
      
      {/* Page Title */}
      <div className="text-center">
        <h1 className="serif-font text-4xl font-extrabold text-slate-900 mb-4">Schedule A Session</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">Follow our linear scheduler wizard to reserve your luxury grooming appointment.</p>
      </div>

      {/* Step Indicator Bar */}
      {!bookingConfirmed && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex justify-between items-center relative overflow-x-auto gap-4">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center gap-2.5 z-10 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                step === s.number 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100' 
                  : step > s.number 
                  ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                {s.number}
              </div>
              <span className={`text-xs font-bold ${
                step === s.number ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
              {idx < steps.length - 1 && <ChevronRight size={14} className="text-slate-300 ml-2" />}
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Content panels */}
      {bookingConfirmed ? (
        // Completed Screen
        <div className="bg-white border border-slate-200 shadow-md rounded-xl p-10 text-center flex flex-col items-center gap-6 animate-fade-in">
          <CheckCircle2 size={64} className="text-emerald-600" />
          <h2 className="serif-font text-3xl font-extrabold text-slate-800">Appointment Confirmed!</h2>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Your slot has been reserved. Please arrive 10 minutes prior to your scheduled shift.
          </p>

          <div className="border border-slate-100 rounded-lg p-5 w-full max-w-[400px] text-left flex flex-col gap-2.5 text-xs text-slate-500 font-semibold bg-slate-50 shadow-sm">
            <div><strong>Reservation ID:</strong> <span className="font-mono text-indigo-600 font-bold">{bookingId}</span></div>
            <div><strong>Treatment:</strong> {selectedService?.name} (₹{selectedService?.price})</div>
            <div><strong>Stylist:</strong> {selectedBarber?.name}</div>
            <div><strong>Date & Time:</strong> {selectedDate} at {selectedTimeSlot}</div>
          </div>

          <button 
            onClick={handleReset} 
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2"
          >
            Book Another Session
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8">
          
          {/* Step 1: Services */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Scissors size={18} className="text-indigo-600" />
                Step 1: Select Service
              </h3>
              
              <div className="flex flex-col gap-3">
                {services.map(s => (
                  <div 
                    key={s._id} 
                    onClick={() => handleServiceSelect(s)}
                    className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all hover:shadow-md ${
                      selectedService?._id === s._id 
                        ? 'border-indigo-600 bg-indigo-50/10 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{s.name}</h4>
                      <span className="text-xs text-slate-400 font-semibold">{s.category} • {s.duration} mins</span>
                    </div>
                    <span className="text-base font-extrabold text-indigo-600">
                      ₹{s.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Barbers */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                <User size={18} className="text-indigo-600" />
                Step 2: Choose Stylist
              </h3>

              <div className="flex flex-col gap-3">
                {barbers.map(b => (
                  <div 
                    key={b._id} 
                    onClick={() => handleBarberSelect(b)}
                    className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all hover:shadow-md ${
                      selectedBarber?._id === b._id 
                        ? 'border-indigo-600 bg-indigo-50/10 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{b.name}</h4>
                      <span className="text-xs text-slate-400 font-semibold">
                        {b.specializations?.join(', ') || 'General Grooming'}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStep(1)} 
                className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors mt-6 shadow-sm"
              >
                <ChevronLeft size={14} /> Back
              </button>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="serif-font text-base font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar size={18} className="text-indigo-600" />
                Step 3: Select Date & Time Slot
              </h3>

              {/* Date Input */}
              <div className="flex flex-col gap-1.5 mb-6 max-w-[300px]">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booking Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {selectedDate && (
                <div className="animate-fade-in">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5 block">Available Sessions</label>
                  
                  {loadingSlots ? (
                    <div className="text-xs text-slate-400 font-semibold py-2">Checking open slots...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-xs text-amber-600 font-semibold py-2">No available shifts on this day or the barber is on leave.</div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {availableSlots.map(t => (
                        <button
                          key={t.time}
                          disabled={!t.available}
                          onClick={() => handleSlotSelect(t.time)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            selectedTimeSlot === t.time 
                              ? 'bg-indigo-600 text-white border border-indigo-600' 
                              : t.available 
                              ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700' 
                              : 'bg-slate-100 border border-slate-150 text-slate-300 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          {t.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => setStep(2)} 
                className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors mt-6 shadow-sm"
              >
                <ChevronLeft size={14} /> Back
              </button>
            </div>
          )}

          {/* Step 4: Preview & Confirm */}
          {step === 4 && (
            <div className="animate-fade-in flex flex-col gap-6">
              <h3 className="serif-font text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock size={18} className="text-indigo-600" />
                Step 4: Verify Reservation Details
              </h3>

              <div className="border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 text-slate-650 text-slate-600 text-sm font-semibold">
                <div>
                  <span className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider block mb-1">Selected Service</span>
                  <div className="font-bold text-slate-800 text-base">{selectedService?.name}</div>
                  <div className="text-indigo-600 font-bold mt-0.5">₹{selectedService?.price.toFixed(2)} ({selectedService?.duration} mins)</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider block mb-1">Assigned Stylist</span>
                  <div className="font-bold text-slate-800 text-base">{selectedBarber?.name}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{selectedBarber?.specializations?.join(', ')}</div>
                </div>

                <div className="md:col-span-2 border-t border-slate-200 pt-4 mt-2">
                  <span className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider block mb-1">Appointment Shift</span>
                  <div className="font-bold text-slate-800 text-base">
                    {selectedDate} at <span className="text-indigo-600 font-black">{selectedTimeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3.5 mt-2">
                <button 
                  onClick={handleSubmitBooking} 
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Confirm Booking Session
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Change Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default BookAppointment;
