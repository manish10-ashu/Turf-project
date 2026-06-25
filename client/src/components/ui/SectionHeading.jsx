import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({
  title,
  subtitle,
  center = true,
  className = ''
}) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-left'} ${className}`}>
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-xs uppercase tracking-widest font-bold text-brand-emerald bg-brand-emerald/10 px-4 py-1.5 rounded-full inline-block mb-3"
      >
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`h-1 bg-gradient-to-r from-brand-emerald to-brand-emerald-light rounded-full mt-4 ${center ? 'mx-auto' : ''}`}
      />
    </div>
  );
};

export default SectionHeading;
