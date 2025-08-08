import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SimpleBackground() {
  const { settings } = useTheme();

  if (settings.backgroundTexture !== 'starfield') return null;

  return (
    <div className="fixed inset-0 -z-10">
      {/* CSS-only starfield effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900">
        {/* Animated stars using CSS */}
        <div className="stars absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Floating particles */}
        <div className="particles absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}