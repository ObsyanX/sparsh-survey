
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'high-contrast';
export type BackgroundTexture = 'gradient' | 'glass' | 'matrix' | 'starfield';
export type FontFamily = 'inter' | 'dyslexia-friendly' | 'monospace';
export type MotionIntensity = 'none' | 'reduced' | 'normal' | 'enhanced';

interface ThemeSettings {
  theme: Theme;
  backgroundTexture: BackgroundTexture;
  fontFamily: FontFamily;
  motionIntensity: MotionIntensity;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
  fontSize: number;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (updates: Partial<ThemeSettings>) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const defaultSettings: ThemeSettings = {
  theme: 'dark',
  backgroundTexture: 'starfield',
  fontFamily: 'inter',
  motionIntensity: 'normal',
  animationsEnabled: true,
  soundEnabled: false,
  highContrast: false,
  fontSize: 16,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('quantum-survey-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quantum-survey-settings', JSON.stringify(settings));
    
    // Apply CSS custom properties based on settings
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    root.style.setProperty('--font-size-base', `${settings.fontSize}px`);
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-font', settings.fontFamily);
    root.setAttribute('data-motion', settings.motionIntensity);
    root.setAttribute('data-background', settings.backgroundTexture);
  }, [settings]);

  const updateSettings = (updates: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setIsTransitioning(true);
    // Simplified toggle between dark and light only
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    
    updateSettings({ theme: nextTheme });
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
