import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverEffect ? { y: -6, transition: { duration: 0.2 } } : {}}
      className={`glass-card p-6 rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
