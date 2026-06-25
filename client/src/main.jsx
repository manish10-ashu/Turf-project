import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext';

// Import AuthProvider from AuthContext instead of AuthProvider.jsx (AuthContext exports both)
import { AuthProvider as CustomAuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <CustomAuthProvider>
          <App />
        </CustomAuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);