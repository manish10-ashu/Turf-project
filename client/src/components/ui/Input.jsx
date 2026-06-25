import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 rounded-full border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 pl-2">{error}</p>}
    </div>
  );
};

export default Input;
