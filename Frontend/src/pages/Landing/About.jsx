import React from 'react';
import { User, Award, Heart } from 'lucide-react';

function About() {
  const team = [
    { name: 'Marcus Vance', role: 'Master Barber', bio: 'With over 12 years of experience, Marcus specializes in classic scissor cuts, hot towel shaves, and modern beard designs.', specialty: 'Beard Styling & Trims' },
    { name: 'Sophia Loren', role: 'Lead Color Therapist', bio: 'Sophia is an award-winning dye therapist specializing in blonde tones, highlights, and custom balayages.', specialty: 'Hair Coloring & Dyes' },
    { name: 'Elena Rostova', role: 'Skin & Facial Consultant', bio: 'Elena provides advanced aesthetic dermatological care and soothing facial scrubs to rejuvenate active pores.', specialty: 'Facials & Derm-care' }
  ];

  const values = [
    { icon: Award, title: 'Artistry & Excellence', desc: 'We treat hair design as a fine art form, creating bespoke contours tailored for you.' },
    { icon: Heart, title: 'Relaxed Atmosphere', desc: 'Unwind in our custom lounge equipped with drinks, warm lighting, and soft music.' },
    { icon: User, title: 'Individualized Attention', desc: 'Each appointment is dedicated strictly to you. No rushed scissors or double bookings.' }
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50">
      
      {/* Hero Header */}
      <section className="py-20 px-6 bg-slate-100 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <h1 className="serif-font text-4xl font-extrabold text-slate-900">Our Salon Heritage</h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Established in 2018, Aurum Salon brings premium, boutique European grooming standards directly to the metropolitan heart.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <h2 className="serif-font text-3xl font-bold text-slate-800">The Gold Standard of Hair Artistry</h2>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
            Aurum was founded on a simple premise: grooming is not a chore; it is a ritual of self-appreciation. We wanted to eliminate the loud, rushed vibe of traditional barbershops and replace it with a calm, highly precise aesthetic experience.
          </p>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
            From our hot towel wraps to our custom-blended scalp conditioning oils, every detail in Aurum has been crafted to deliver visual excellence and a deep sense of relaxation.
          </p>
        </div>
        <div className="h-[350px] rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&auto=format&fit=crop")`
        }} />
      </section>

      {/* Core Values */}
      <section className="bg-slate-150 bg-slate-100/50 border-y border-slate-250 border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="serif-font text-3xl font-bold text-slate-900 mb-4">Our Salon Philosophy</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">The standards that guide our styling team on every single appointment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-indigo-600">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stylist Profiles */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="serif-font text-3xl font-bold text-slate-900 mb-4">Meet Our Artists</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">Our talented stylists are dedicated to crafting your signature look.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="h-[240px] rounded-lg border border-slate-250 border-slate-100 bg-cover bg-center bg-no-repeat" style={{
                backgroundImage: idx === 0 
                  ? `url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop")`
                  : idx === 1
                  ? `url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop")`
                  : `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop")`
              }} />

              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">{member.name}</h3>
                <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider">{member.role}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium flex-grow">
                {member.bio}
              </p>

              <div className="border-t border-slate-100 pt-3.5 text-xs text-slate-500 font-medium">
                Specializes in: <strong className="text-slate-850 text-slate-700">{member.specialty}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default About;
