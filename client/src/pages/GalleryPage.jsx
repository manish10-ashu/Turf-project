import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSettings } from "../context/SettingsContext";
import { galleryAPI } from '../services/api';

const GalleryPage = () => {
  const { settings } = useSettings();
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedImgIdx, setSelectedImgIdx] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchGallery = async () => {
    try {
      const { data } = await galleryAPI.getGallery();

      let oldImages = [];

      if (data.success) {
        oldImages = data.gallery;
      }

      const settingsImages = (settings?.gallery || []).map((url, index) => ({
        _id: `settings-${index}`,
        imageUrl: url,
        title: `Gallery Image ${index + 1}`,
        category: "Facilities"
      }));

      setImages([...oldImages, ...settingsImages]);
    } catch (err) {
      console.error("Failed to load gallery images", err);
    } finally {
      setLoading(false);
    }
  };

  fetchGallery();
}, [settings]);
  const categories = ['All', 'Football', 'Cricket', 'Facilities', 'Events'];

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedImgIdx(prev => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedImgIdx(prev => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="Our Facility Photos" subtitle="Arena Gallery" />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white shadow-lg shadow-brand-emerald/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-emerald dark:hover:border-brand-emerald'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading gallery images...</div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, idx) => (
                <motion.div
                  key={img._id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedImgIdx(idx)}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-md hover:shadow-xl transition-shadow bg-slate-200 dark:bg-slate-900"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider mb-1">
                      {img.category}
                    </span>
                    <h4 className="text-lg font-bold text-white font-display">
                      {img.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImgIdx !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
              <button
                onClick={() => setSelectedImgIdx(null)}
                className="absolute top-6 right-6 text-white hover:text-brand-emerald transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <X className="h-7 w-7" />
              </button>

              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
                <motion.img
                  key={selectedImgIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  src={filteredImages[selectedImgIdx].imageUrl}
                  alt={filteredImages[selectedImgIdx].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                />
                <h4 className="text-white text-lg font-bold font-display mt-4 text-center">
                  {filteredImages[selectedImgIdx].title}
                </h4>
                <span className="text-brand-emerald text-sm uppercase tracking-wider mt-1">
                  {filteredImages[selectedImgIdx].category}
                </span>
              </div>

              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPage;
