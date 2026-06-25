import { createContext, useContext, useEffect, useState } from "react";
import { adminAPI } from "../services/api";

import { settingsAPI } from "../services/api";
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

const fetchSettings = async () => {
  try {
    const { data } = await settingsAPI.getSettings();

    if (data?.success) {
      setSettings({ ...data.settings }); // 🔥 IMPORTANT
    }
  } catch (err) {
    console.error(err);
  }
   finally {
    setLoading(false);
   }
};
  const updateSettingsLocal = (newSettings) => {
    setSettings(newSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        setSettings,
        reload: fetchSettings,
        updateSettingsLocal,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};