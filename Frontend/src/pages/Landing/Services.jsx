import React, { useState } from 'react';
import { Clock, Filter, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();

  const servicesData = [
    // Haircut
    { id: 'srv_101', name: 'Classic Scissor Cut', category: 'Haircut', price: 199, duration: 30, desc: 'A traditional wet trim and shear styling finished with a hot neck shave.' },
    { id: 'srv_105', name: 'Premium Cut & Wash', category: 'Haircut', price: 349, duration: 45, desc: 'Includes luxury wash, custom massage, blow dry, and precision haircut.' },
    { id: 'srv_106', name: 'Kids Hair Trim', category: 'Haircut', price: 149, duration: 20, desc: 'Gentle haircutting for young gentlemen under 12 years old.' },
    
    // Beard Styling
    { id: 'srv_102', name: 'Beard Styling & Trim', category: 'Beard Styling', price: 199, duration: 25, desc: 'Detailed razor line alignment and oil wash for a healthy luster.' },
    { id: 'srv_107', name: 'Royal Beard Treatment', category: 'Beard Styling', price: 349, duration: 40, desc: 'Warm towel wash, massage, conditioning oils, and precision sculpting.' },
    
    // Hair Coloring
    { id: 'srv_103', name: 'Vibrant Hair Coloring', category: 'Hair Coloring', price: 999, duration: 60, desc: 'Full coverage gray treatment or brand new highlights utilizing premium dyes.' },
    { id: 'srv_108', name: 'Dye Touch-up Line', category: 'Hair Coloring', price: 599, duration: 40, desc: 'Root touch-up to maintain styling consistency between color treatments.' },
    
    // Facial
    { id: 'srv_104', name: 'Hydrating Face Cleanse', category: 'Facial', price: 349, duration: 40, desc: 'Charcoal scrub exfoliation to extract impurities and unlock fresh pores.' },
    { id: 'srv_109', name: 'Clay Mask Skin Therapy', category: 'Facial', price: 449, duration: 30, desc: 'Mineral clay pack to soothe inflammation and hydrate skin cells.' }
  ];

  // Filters State
  const [maxPrice, setMaxPrice] = useState(1200);
  const [maxDuration, setMaxDuration] = useState(60);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleResetFilters = () => {
    setMaxPrice(1200);
    setMaxDuration(60);
    setSelectedCategory('All');
  };

  // Filter Logic
  const filteredServices = servicesData.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesPrice = s.price <= maxPrice;
    const matchesDuration = s.duration <= maxDuration;
    return matchesCategory && matchesPrice && matchesDuration;
  });

  // Grouped by Category for display
  const categories = ['All', 'Haircut', 'Beard Styling', 'Hair Coloring', 'Facial'];
  
  // Group the services that match the filters
  const grouped = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 flex flex-col gap-10 bg-slate-50 w-full">
      
      {/* Page Title */}
      <div className="text-center">
        <h1 className="serif-font text-4xl font-extrabold text-slate-900 mb-4">Services & Pricing Menu</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">Browse our premium treatment menu. Adjust filters below to match your budget or schedule constraints.</p>
      </div>

      {/* Filter Sidebar & Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-start">
        
        {/* Filter Controls Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-6 sticky top-[90px]">
          <h3 className="serif-font text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Filter size={18} className="text-indigo-600" />
            Filter Treatments
          </h3>

          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</label>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-500">Max Price</label>
              <span className="text-indigo-600">₹{maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="1200" 
              step="50"
              value={maxPrice} 
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>₹50</span>
              <span>₹1,200</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-500">Max Duration</label>
              <span className="text-slate-800">{maxDuration} mins</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="60" 
              step="5"
              value={maxDuration} 
              onChange={e => setMaxDuration(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>20 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Reset Filters */}
          <button 
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 justify-center py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Reset Filters
          </button>
        </div>

        {/* Menu Listings */}
        <div className="flex flex-col gap-10">
          {Object.keys(grouped).length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl text-center py-12 px-6 text-slate-400 text-sm font-semibold">
              No treatments match your current filter settings. Try adjusting the sliders.
            </div>
          ) : (
            Object.keys(grouped).map(catName => (
              <div key={catName}>
                <h2 className="serif-font text-2xl font-bold text-slate-800 border-b border-slate-200 pb-3 mb-6">
                  {catName}
                </h2>

                <div className="flex flex-col gap-4">
                  {grouped[catName].map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Clock size={12} /> {item.duration} min
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end gap-3 flex-shrink-0">
                        <span className="text-lg font-bold text-slate-800">
                          ₹{item.price.toFixed(2)}
                        </span>
                        <button 
                          onClick={() => navigate('/book')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Services;
