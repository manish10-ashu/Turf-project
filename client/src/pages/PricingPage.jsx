import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pricingAPI } from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Calendar, Flame, Clock } from 'lucide-react';

const PricingPage = () => {
  const [pricing, setPricing] = useState([]);
  const [isWeekend, setIsWeekend] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data } = await pricingAPI.getPricing();
        if (data.success) {
          setPricing(data.pricing);
        }
      } catch (err) {
        console.error('Failed to load pricing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="Affordable Turf Rates" subtitle="Hourly Pricing" />

        {/* Pricing Mode Toggle */}
        <div className="flex justify-center items-center space-x-4 mb-16">
          <span className={`text-base font-bold ${!isWeekend ? 'text-brand-emerald' : 'text-slate-500'}`}>
            Weekday (Mon-Fri)
          </span>
          <button
            onClick={() => setIsWeekend(!isWeekend)}
            className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 relative focus:outline-none"
            aria-label="Toggle Weekend Pricing"
          >
            <motion.div
              layout
              className="w-6 h-6 bg-brand-emerald rounded-full shadow-md"
              animate={{ x: isWeekend ? 32 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-base font-bold ${isWeekend ? 'text-brand-emerald' : 'text-slate-500'}`}>
            Weekend (Sat-Sun)
          </span>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading turf pricing...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {pricing.map((p, idx) => (
              <Card 
                key={p._id || idx} 
                delay={idx * 0.05} 
                className={`relative p-6 flex flex-col justify-between overflow-hidden border ${
                  p.isPopular 
                    ? 'border-brand-emerald ring-2 ring-brand-emerald/10' 
                    : 'border-slate-100 dark:border-slate-800/60'
                }`}
              >
                {p.isPopular && (
                  <div className="absolute top-0 right-0 bg-brand-emerald text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center space-x-1">
                    <Flame className="h-3.5 w-3.5 fill-current" />
                    <span>Peak Slot</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 text-slate-500 mb-4">
                    <Clock className="h-5 w-5 text-brand-emerald" />
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                      {p.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black font-display text-slate-900 dark:text-white">
                      ₹{isWeekend ? p.weekendPrice : p.weekdayPrice}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ hour</span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Valid for up to 12-14 players. Includes floodlights, box goals/wickets, and mineral drinking water.
                  </p>
                </div>

                <Link to="/booking" className="block w-full">
                  <Button 
                    variant={p.isPopular ? 'primary' : 'secondary'} 
                    className="w-full"
                  >
                    Select Slot
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Pricing Policies Card */}
        <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto border border-slate-100 dark:border-slate-800/60">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-brand-emerald" />
            <span>Booking & Cancellation Policy</span>
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
            <li>Bookings can be made online up to 14 days in advance.</li>
            <li>Cancellations made 12 hours prior to the slot time receive a 100% refund.</li>
            <li>No refunds are provided for cancellations made within 12 hours of the slot.</li>
            <li>Please wear non-marking sports shoes or turf trainers. Metal cleats are prohibited.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
