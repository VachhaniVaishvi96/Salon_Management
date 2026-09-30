import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function FavoredTreatments() {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavored = async () => {
      try {
        // Load booking history
        const aptRes = await fetch('http://localhost:5000/api/appointments/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const aptData = await aptRes.json();
        
        if (aptData.success && aptData.data.length > 0) {
          // Count occurrences
          const counts = {};
          aptData.data.forEach(apt => {
            if (apt.service) {
              const id = apt.service._id;
              if (!counts[id]) {
                counts[id] = {
                  _id: id,
                  name: apt.service.name,
                  price: apt.service.price,
                  desc: apt.service.description || 'Professional grooming service',
                  count: 0
                };
              }
              counts[id].count += 1;
            }
          });
          
          const sorted = Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 2);
            
          setTreatments(sorted);
        } else {
          // Fallback: load popular services from the catalog
          const sRes = await fetch('http://localhost:5000/api/services');
          const sData = await sRes.json();
          if (sData.success) {
            const defaults = sData.data.slice(0, 2).map(s => ({
              _id: s._id,
              name: s.name,
              price: s.price,
              desc: s.description || 'Professional grooming service',
              count: 0 // Indicates a recommended/popular service
            }));
            setTreatments(defaults);
          }
        }
      } catch (err) {
        console.error('Failed to load favored treatments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavored();
  }, [token]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <h3 className="serif-font text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <Award size={20} className="text-indigo-600" />
        Favored Treatments
      </h3>

      {loading ? (
        <div className="text-slate-400 text-center py-10 text-sm font-medium">
          Loading recommendations...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {treatments.map((t) => (
            <div key={t._id} className="bg-indigo-50/20 border border-indigo-50 rounded-lg p-4 flex justify-between items-center gap-4 hover:border-indigo-100 transition-all">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {t.count > 0 ? `${t.count} visits` : 'Recommended'}
                  </span>
                </div>
                <p className="text-xs text-slate-550 text-slate-500 mb-1.5 leading-relaxed font-medium">
                  {t.desc}
                </p>
                <span className="text-xs font-bold text-slate-800">₹{t.price?.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate('/book')}
                className="flex items-center gap-1 border border-indigo-600 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <Zap size={12} />
                Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoredTreatments;
