import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Sliders, Check, Plus, X, Trash2 } from 'lucide-react';

function PricingControls() {
  const { token } = useSelector(state => state.auth);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit price state
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);

  // Add Service Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Haircut');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Haircut',
    'Beard Styling',
    'Hair Coloring',
    'Facial',
    'Spa',
    'Massage',
    'Manicure',
    'Pedicure',
    'Other'
  ];

  const loadServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const resData = await response.json();
      if (resData.success) {
        setServices(resData.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetAddForm = () => {
    setName('');
    setCategory('Haircut');
    setPrice('');
    setDuration('');
    setDescription('');
    setShowAddForm(false);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!name || !price || !duration) {
      alert('Please fill in Service Name, Price, and Duration.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          duration: Number(duration),
          description
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        loadServices();
        resetAddForm();
      } else {
        alert(resData.message || 'Failed to add new service.');
      }
    } catch (err) {
      alert('Could not connect to add service.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (id, currentPrice) => {
    setEditingId(id);
    setEditPrice(currentPrice);
  };

  const saveEdit = async (id) => {
    try {
      const service = services.find(s => s._id === id);
      if (!service) return;

      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: service.name,
          category: service.category,
          duration: service.duration,
          description: service.description,
          price: Number(editPrice)
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        loadServices();
        setEditingId(null);
      } else {
        alert(resData.message || 'Failed to adjust price.');
      }
    } catch (err) {
      alert('Could not connect to update price.');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          loadServices();
        } else {
          alert(resData.message || 'Failed to delete service.');
        }
      } catch (err) {
        alert('Could not connect to delete service.');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      {/* Header with Title and Add New Service Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5 border-b border-slate-100 pb-4">
        <div>
          <h3 className="serif-font text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sliders size={20} className="text-indigo-600" />
            Service & Pricing Controls
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Manage service offerings and update live prices across your salon menu.</p>
        </div>

        <button
          onClick={() => {
            if (showAddForm) resetAddForm();
            else setShowAddForm(true);
          }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0 self-start sm:self-auto"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
          {showAddForm ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {/* Add New Service Form */}
      {showAddForm && (
        <form onSubmit={handleAddService} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 animate-fade-in shadow-inner">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Plus size={14} className="text-indigo-600" />
            Add New Salon Service
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Keratin Hair Spa"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. 599"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration (Minutes) *</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. 45"
                min="5"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none transition-all"
                placeholder="Brief description of treatment or procedure..."
              />
            </div>
          </div>

          <div className="flex gap-2.5 mt-5">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Creating Service...' : 'Save New Service'}
            </button>
            <button
              type="button"
              onClick={resetAddForm}
              className="border border-slate-200 hover:bg-white text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      {loading ? (
        <div className="text-slate-400 text-xs text-center py-6">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-slate-400 text-xs text-center py-8">No services found. Click "Add New Service" to create one.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map(s => (
            <div key={s._id} className="border border-slate-100 rounded-lg p-3.5 bg-slate-50 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {s.category} • {s.duration} min
                  {s.description && <span className="text-slate-400 font-normal"> — {s.description}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {editingId === s._id ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-indigo-600">₹</span>
                    <input 
                      type="number" 
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
                    />
                    <button 
                      onClick={() => saveEdit(s._id)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                      title="Save Price"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600 font-extrabold text-sm mr-1">
                      ₹{s.price?.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => startEdit(s._id, s.price)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded transition-colors shadow-sm cursor-pointer"
                    >
                      Adjust
                    </button>
                    <button
                      onClick={() => handleDeleteService(s._id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PricingControls;
