import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-12 px-6 text-slate-600 text-sm mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* About column */}
        <div>
          <h3 className="serif-font text-slate-900 text-lg font-bold tracking-wider mb-5">AURUM SALON</h3>
          <p className="line-height-relaxed text-slate-500 mb-5">
            Experience the gold standard in hair care and styling. Our team of expert artists is dedicated to crafting a look that reflects your unique beauty and style.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2.5 rounded-full bg-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="p-2.5 rounded-full bg-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="p-2.5 rounded-full bg-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs mb-5">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            <li><Link to="/" className="text-slate-500 hover:text-indigo-600 transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-slate-500 hover:text-indigo-600 transition-colors">About Us</Link></li>
            <li><Link to="/services" className="text-slate-500 hover:text-indigo-600 transition-colors">Services & Pricing</Link></li>
            <li><Link to="/book" className="text-slate-500 hover:text-indigo-600 transition-colors">Book Appointment</Link></li>
          </ul>
        </div>

        {/* Hours Column */}
        <div>
          <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs mb-5">Opening Hours</h3>
          <ul className="flex flex-col gap-3">
            <li className="flex justify-between">
              <span className="text-slate-500">Mon - Fri:</span>
              <span className="text-slate-900 font-medium">9:00 AM - 8:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Saturday:</span>
              <span className="text-slate-900 font-medium">9:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Sunday:</span>
              <span className="text-slate-900 font-medium">10:00 AM - 4:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-slate-900 font-bold uppercase tracking-wider text-xs mb-5">Get In Touch</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-2.5 items-start">
              <MapPin size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-500">102 Luxury Plaza, Royal Ring Road, City Centre</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone size={16} className="text-indigo-600 flex-shrink-0" />
              <span className="text-slate-500">+1 (555) 019-2834</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail size={16} className="text-indigo-600 flex-shrink-0" />
              <span className="text-slate-500">appointments@aurumsalon.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Aurum Salon Management Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
