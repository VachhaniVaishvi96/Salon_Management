import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Scissors, Clock, Star, ShieldCheck } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: Scissors, title: 'Master Stylists', desc: 'Our artists undergo continuous training to master the latest techniques.' },
    { icon: Clock, title: 'Easy Scheduling', desc: 'Book your slot in seconds with our dynamic real-time slot allocator.' },
    { icon: ShieldCheck, title: 'Premium Products', desc: 'We use strictly sulfate-free organic treatments and conditioners.' }
  ];

  const testimonials = [
    { name: 'Sarah Connor', role: 'VIP Member', quote: 'The service here is impeccable. Marcus does wonders with beard styling and grooming.', stars: 5 },
    { name: 'Alex Mercer', role: 'Loyal Customer', quote: 'A truly luxury experience. The design of the salon, the staff, the wash, everything is perfect.', stars: 5 }
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6 flex items-center justify-center text-center overflow-hidden border-b border-slate-200 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `linear-gradient(to right, rgba(248, 250, 252, 0.85), rgba(241, 245, 249, 0.9)), url("https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop")`
      }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center z-10">
          {/* <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="animate-spin-slow" /> The Gold Standard in Grooming
          </span> */}

          <h1 className="serif-font text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            Elevate Your Style. <br />
            Reveal Your <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Signature Look</span>.
          </h1>

          <p className="text-sm md:text-lg text-slate-500 max-w-xl mx-auto mb-4 leading-relaxed">
            Aurum is a boutique hair care and styling sanctuary. Experience bespoke grooming services tailored for the discerning individual.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate('/book')} 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Reserve Your Slot Now
            </button>
            <button 
              onClick={() => navigate('/services')} 
              className="px-6 py-3 border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-600 font-bold rounded-lg transition-all shadow-sm"
            >
              Explore Our Menu
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="serif-font text-3xl font-bold text-slate-900 mb-4">Why Choose Aurum?</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">We design hairstyles and provide treatments that accentuate your natural contours and personal aesthetic.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12.5 height-[50px] h-12.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-100/50 border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="serif-font text-3xl font-bold text-slate-900 mb-4">Client Appraisals</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">Read feedback from our members regarding their grooming sessions at our luxury parlour.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, sIdx) => (
                    <Star key={sIdx} size={16} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="italic text-slate-700 leading-relaxed font-medium">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <span className="text-xs text-indigo-600 font-semibold">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="max-w-7xl mx-auto py-20 px-6 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 md:p-14 flex flex-col items-center gap-6 shadow-md hover:shadow-lg transition-shadow max-w-4xl mx-auto">
          <h2 className="serif-font text-3xl md:text-4xl font-bold text-slate-800">Ready for a Transformative Session?</h2>
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed font-medium">
            Book now to reserve an elite stylist. Get access to our custom multi-step scheduler to preview stylist openings.
          </p>
          <button 
            onClick={() => navigate('/book')} 
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Schedule Appointment Now
          </button>
        </div>
      </section>

    </div>
  );
}

export default Home;
