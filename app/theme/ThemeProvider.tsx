import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { Theme, themes } from './../theme/themes';

type ThemeContextType = {
  theme: Theme;
  setTheme: (themeName: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  //load user theme from OS
  //const [themeName, setThemeName] = useState<'light' | 'dark'>(systemColorScheme || 'light');
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    //setThemeName(systemColorScheme || 'light');
    setThemeName('light');
  }, [systemColorScheme]);

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);