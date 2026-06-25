import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageSquare } from 'lucide-react';
import { useSettings } from "../../context/SettingsContext";


const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <span className="text-2xl font-black font-display tracking-wider bg-gradient-to-r from-brand-emerald to-brand-emerald-light bg-clip-text text-transparent">
            {settings?.turfName || "HOMEGROUND"}
            </span>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Premium multi-sport turf in Balawala, Dehradun. Host of exciting box cricket tournaments, intensive football training, and friendly casual matches.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-slate-900 hover:bg-brand-emerald hover:text-white rounded-full text-slate-400 transition-all duration-300" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-brand-emerald hover:text-white rounded-full text-slate-400 transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-brand-emerald hover:text-white rounded-full text-slate-400 transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-bold font-display text-lg mb-4">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-brand-emerald flex-shrink-0" />
                <span className="text-sm">Everyday: 6:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-brand-emerald flex-shrink-0" />
                <span className="text-sm">24/7 Bookings on request</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="h-4 w-4 text-brand-emerald flex-shrink-0 mt-0.5" />
                <span className="text-sm">Night slots require booking at least 3 hours in advance.</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-display text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-emerald transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-emerald transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-emerald transition-colors">Photos Gallery</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-brand-emerald transition-colors">Turf Rates</Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-brand-emerald transition-colors">Book a Slot</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-emerald transition-colors">Contact Page</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold font-display text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-5 w-5 text-brand-emerald flex-shrink-0 mt-0.5" />
                <span>S{settings?.address || "Default Address"}1</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-brand-emerald flex-shrink-0" />
                <span>{settings?.contactNumber || "+91 7339942407"}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-brand-emerald flex-shrink-0" />
                <span>{settings?.email || "contact@homegroundturf.com"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings?.turfName || "HOMEGROUND"} All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
