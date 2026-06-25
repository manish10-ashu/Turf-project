import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-full glass border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-slate-700" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
