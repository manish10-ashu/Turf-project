import React from 'react';

const Badge = ({
  children,
  variant = 'primary', // primary, secondary, success, warning, danger
  className = ''
}) => {
  const styles = {
    primary: 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    success: 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30',
    warning: 'bg-brand-amber/10 text-brand-amber border border-brand-amber/20',
    danger: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
