import { createContext, useContext, useEffect, useState } from 'react';

function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}

type SettingsContextType = {
  tempFahrenheit: boolean;
  setTempFahrenheit: (v: boolean) => void;
  areaMiles: boolean;
  setAreaMiles: (v: boolean) => void;
  hideHints: boolean;
  setHideHints: (v: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

const TEMP_FAHRENHEIT_KEY = 'tempFahrenheit';
const AREA_MILES_KEY = 'areaMiles';
const HIDE_HINTS_KEY = 'hideHints';

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [tempFahrenheit, setTempFahrenheit] =
    useLocalStorageState<boolean>(TEMP_FAHRENHEIT_KEY, false);

  const [areaMiles, setAreaMiles] = useLocalStorageState<boolean>(AREA_MILES_KEY, false);

  const [hideHints, setHideHints] = useLocalStorageState<boolean>(HIDE_HINTS_KEY, false);

  return (
    <SettingsContext.Provider value={{ tempFahrenheit, setTempFahrenheit, areaMiles, setAreaMiles, hideHints, setHideHints }}>
      {children}
    </SettingsContext.Provider>
  );
}
