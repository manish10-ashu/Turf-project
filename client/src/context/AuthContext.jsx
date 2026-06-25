import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from "./SettingsContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateSettingsLocal } = useSettings();
 


  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
       const { data } = await axios.get(
           `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: {
              Authorization: `Bearer ${token}`
                } });
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth verification failed', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
              const { data } = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/auth/login`,
             { email, password }
         );
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role
        });
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/register`,
  {
    name,
    email,
    password,
    phone
  }
);     if (data.success) {
        localStorage.setItem('token', data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role
        });
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
