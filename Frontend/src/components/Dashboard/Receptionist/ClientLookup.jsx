import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, Search, UserCheck } from 'lucide-react';

function ClientLookup() {
  const { token } = useSelector(state => state.auth);
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        // 1. Load all users
        const uRes = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uData = await uRes.json();

        // 2. Load all appointments to calculate visits
        const aptRes = await fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const aptData = await aptRes.json();

        if (uData.success) {
          const customersOnly = uData.data.filter(u => u.role === 'Customer');
          
          // Calculate visits and tier for each client
          const mappedClients = customersOnly.map(user => {
            const customerApts = aptData.success 
              ? aptData.data.filter(apt => apt.customer?._id === user._id && apt.status === 'Completed') 
              : [];
            const visitsCount = customerApts.length;
            
            // Determine tier based on visits
            let tier = 'Standard';
            if (visitsCount >= 10) tier = 'VIP Platinum';
            else if (visitsCount >= 5) tier = 'VIP Gold';
            else if (visitsCount >= 3) tier = 'VIP Silver';

            return {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone || 'N/A',
              visits: visitsCount,
              tier
            };
          });

          setClients(mappedClients);
        }
      } catch (err) {
        console.error('Failed to load clients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [token]);

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <Users size={20} className="text-indigo-600" />
        Client Profile Directory
      </h3>

      <div className="relative mb-5">
        <input 
          type="text" 
          placeholder="Search clients by name/email..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 outline-none h-10 transition-all"
        />
        <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
      </div>

      {loading ? (
        <div className="text-slate-400 text-xs text-center py-6">Loading client directory...</div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
          {filtered.map(c => (
            <div key={c.id} className="border border-slate-100 rounded-lg p-3.5 bg-slate-50 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  {c.name}
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{c.tier}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{c.email}</div>
                <div className="text-[9px] text-slate-400 font-mono mt-1">ID: {c.id?.substring(c.id.length - 8)}</div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="text-xs font-bold text-slate-800">{c.visits} Completed</div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                  <UserCheck size={10} /> Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientLookup;
