import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Shield, Calendar, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from "../../context/SettingsContext";


const Navbar = () => {
  const { settings } = useSettings();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' }
  ];

  const activeStyle = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
      isActive ? 'text-brand-emerald' : 'text-slate-700 hover:text-brand-emerald dark:text-slate-300 dark:hover:text-brand-emerald'
    }`;
      console.log("SETTINGS:", settings);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-md border-b border-slate-100 dark:border-slate-900 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black font-display tracking-wider bg-gradient-to-r from-brand-emerald to-brand-emerald-light bg-clip-text text-transparent">
             {settings?.turfName || "HOMEGROUND"}
            </span>
          </Link>

          {/* Navigation - show on all screen sizes */}
          <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={activeStyle}>
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-emerald rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-slate-700 hover:text-brand-emerald dark:text-slate-300 dark:hover:text-brand-emerald font-semibold text-sm transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Auth CTA & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/booking"
                  className="flex items-center space-x-1 px-5 py-2.5 bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-brand-emerald/30 transition-all duration-300"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Slot</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-brand-emerald dark:text-slate-300 dark:hover:text-brand-emerald transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-brand-emerald/30 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile auth buttons */}
          <div className="md:hidden flex items-center justify-center space-x-3">
            <ThemeToggle />
            {user ? (
              <Link
                to="/booking"
                className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white rounded-full font-semibold text-xs shadow-md"
              >
                <Calendar className="h-3 w-3" />
                <span>Book</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-3 py-2 bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white rounded-full font-semibold text-xs shadow-md"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-100 dark:border-slate-900 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-brand-emerald/10 text-brand-emerald'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <Shield className="h-5 w-5 text-brand-emerald" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-900 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/booking"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white rounded-full font-bold text-center shadow-md"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Book a Slot</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="py-3 text-center border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="py-3 text-center bg-gradient-to-r from-brand-emerald to-brand-emerald-dark text-white rounded-full font-bold shadow-md"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
