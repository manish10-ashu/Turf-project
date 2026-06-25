import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Trophy, Lightbulb, Users, Clock, Award, Star } from 'lucide-react';
import { reviewAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { adminAPI } from '../services/api';
import { useSettings } from "../context/SettingsContext";



const HomePage = () => {
  const [reviews, setReviews] = useState([]);
const { settings } = useSettings();
useEffect(() => {
  console.log("SETTINGS FROM CONTEXT:", settings);
}, [settings]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await reviewAPI.getReviews();
        if (data.success) {
          setReviews(data.reviews.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };
    fetchReviews();
  }, []);

  const facilities = [
    {
      icon: <Sparkles className="h-8 w-8 text-brand-emerald" />,
      title: 'FIFA Grade Artificial Grass',
      desc: 'Top tier synthetic turf offering premium cushioning, high performance play, and injury protection.'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-brand-emerald" />,
      title: 'Advanced LED Floodlights',
      desc: 'Perfect stadium-quality illumination for evening sessions and night tournaments without shadows.'
    },
    {
      icon: <Users className="h-8 w-8 text-brand-emerald" />,
      title: 'Spacious Changing Rooms',
      desc: 'Hygienic lockers, shower areas, and changing spaces to refresh before and after your matches.'
    },
    {
      icon: <Trophy className="h-8 w-8 text-brand-emerald" />,
      title: 'Multi-Sport Adaptability',
      desc: 'Accurately marked and sized layout perfect for both 5v5/6v6 Football and Box Cricket sessions.'
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden pt-40 md:pt-32">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('/images/turf-hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/20" />

        {/* Floating background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-emerald/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
           <span className="text-xs md:text-sm uppercase tracking-widest font-black text-brand-emerald bg-brand-emerald/10 px-5 py-2 rounded-full border border-brand-emerald/20 inline-block mb-6 backdrop-blur-md">
  🎯        {settings?.heroSubtitle !== undefined ? settings.heroSubtitle : "Dehradun's Ultimate Sports Arena"}
             </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white mb-6 leading-none"
          >
            PLAY LIKE A <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-emerald via-brand-emerald-light to-brand-amber bg-clip-text text-transparent">
             {settings?.heroTitle || "CHAMPION"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10 font-normal leading-relaxed"
          >
            Experience the finest multi-sport synthetic turf , Equipped with stadium-grade floodlights, premium facilities, and 24/7 availability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/booking">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-2xl shadow-brand-emerald/40">
                Book Slot Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                View Rates & Slots
              </Button>
            </Link>
             <Link to="/my-bookings">
           My Bookings
          </Link>
          </motion.div>
         
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="World Class Amenities" subtitle="Our Facilities" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((fac, idx) => (
              <Card key={idx} delay={idx * 0.1} className="flex flex-col items-center text-center p-8">
                <div className="p-4 bg-brand-emerald/10 rounded-2xl mb-6 flex items-center justify-center">
                  {fac.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">{fac.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{fac.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Promo Call To Action */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/images/turf-action.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full mb-3 inline-block">
              ⚡ FAST & EASY BOOKING
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-6 leading-tight">
              Ready to Kick Off <br />Your Next Match?
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-lg">
              Check real-time availability for our premium turf. Select a convenient time slot, book instantly online, and round up your team!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking">
                <Button variant="primary" size="lg">Book a Slot</Button>
              </Link>
              <Link to="/about">
                <Button variant="glass" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6">
            <Card hoverEffect={false} className="p-6 text-center border-white/5">
              <Trophy className="h-8 w-8 text-brand-emerald mx-auto mb-4" />
              <h4 className="text-2xl font-black font-display text-slate-900 dark:text-white">50+</h4>
              <p className="text-xs text-slate-500 mt-1">Tournaments Hosted</p>
            </Card>
            <Card hoverEffect={false} className="p-6 text-center border-white/5">
              <Users className="h-8 w-8 text-brand-emerald mx-auto mb-4" />
              <h4 className="text-2xl font-black font-display text-slate-900 dark:text-white">1000+</h4>
              <p className="text-xs text-slate-500 mt-1">Active Players</p>
            </Card>
            <Card hoverEffect={false} className="p-6 text-center border-white/5">
              <Clock className="h-8 w-8 text-brand-emerald mx-auto mb-4" />
              <h4 className="text-2xl font-black font-display text-slate-900 dark:text-white">24/7</h4>
              <p className="text-xs text-slate-500 mt-1">Booking Support</p>
            </Card>
            <Card hoverEffect={false} className="p-6 text-center border-white/5">
              <Award className="h-8 w-8 text-brand-emerald mx-auto mb-4" />
              <h4 className="text-2xl font-black font-display text-slate-900 dark:text-white">4.8★</h4>
              <p className="text-xs text-slate-500 mt-1">Customer Reviews</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="What Our Players Say" subtitle="Testimonials" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <Card key={idx} delay={idx * 0.1} className="relative p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-brand-amber mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic mb-6 leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                    <div className="h-10 w-10 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center font-bold font-display">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                      <p className="text-xs text-slate-500">Regular Player</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-500">
                Loading player experiences...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
