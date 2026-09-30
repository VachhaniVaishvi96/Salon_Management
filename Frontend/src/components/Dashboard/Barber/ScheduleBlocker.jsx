import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Plus, HelpCircle, CalendarRange } from 'lucide-react';
import StatusBadge from '../../StatusBadge';

function ScheduleBlocker() {
  const { token } = useSelector(state => state.auth);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  const loadBlockers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/staff/my-time-off', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) {
        setBlocks(resData.data);
      }
    } catch (err) {
      console.error('Failed to load schedule blockers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockers();
  }, [token]);

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!date || !start || !end || !reason) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/staff/time-off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          startDate: date,
          endDate: date, // Single day blocker
          reason: `${reason} [${start} - ${end}]`
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        // Reload list
        loadBlockers();
        setDate('');
        setStart('');
        setEnd('');
        setReason('');
      } else {
        alert(resData.message || 'Failed to request schedule block.');
      }
    } catch (err) {
      alert('Could not connect to time off service.');
    }
  };

  const handleRemovePrompt = () => {
    alert('Blockers that are approved or pending cannot be deleted directly by styling staff. Please contact the administrative desk.');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <CalendarRange size={20} className="text-indigo-600" />
        Schedule Blocker Controls
      </h3>

      {/* Form */}
      <form onSubmit={handleAddBlock} className="mb-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-450 text-slate-400 font-bold uppercase tracking-wider">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-250 border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider">Reason</label>
            <input 
              type="text" 
              placeholder="e.g. Lunch" 
              value={reason} 
              onChange={e => setReason(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-250 border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider">Start Time</label>
            <input 
              type="time" 
              value={start} 
              onChange={e => setStart(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-255 border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider">End Time</label>
            <input 
              type="time" 
              value={end} 
              onChange={e => setEnd(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-255 border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>
        </div>

        <button type="submit" className="flex items-center gap-1 border border-indigo-600 hover:bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors self-start mt-2 shadow-sm cursor-pointer">
          <Plus size={14} /> Add Blocker
        </button>
      </form>

      {/* Block List */}
      <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Active Blockers</h4>
      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
        {loading ? (
          <div className="text-slate-400 text-xs text-center py-4">Loading active blockers...</div>
        ) : blocks.length === 0 ? (
          <div className="text-slate-400 text-xs text-center py-4 font-semibold">No active schedule blocks.</div>
        ) : (
          blocks.map(b => (
            <div key={b._id} className="flex justify-between items-center bg-slate-50 border border-slate-150 border-slate-200 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="text-xs font-bold text-slate-800">{b.reason}</div>
                <div className="text-[10px] text-slate-450 text-slate-400 flex gap-2.5 mt-1 font-semibold">
                  <span>{b.startDate}</span>
                  {b.startDate !== b.endDate && (
                    <>
                      <span>to</span>
                      <span>{b.endDate}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={b.status} />
                <button 
                  onClick={handleRemovePrompt}
                  className="text-slate-400 hover:text-indigo-600 transition-colors bg-transparent border-none cursor-pointer"
                  title="Contact Admin to delete"
                >
                  <HelpCircle size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ScheduleBlocker;
