import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { settings, toggleTheme, isTransitioning } = useTheme();
  const isDark = settings.theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-6 left-6 z-50"
    >
      <motion.button
        onClick={toggleTheme}
        disabled={isTransitioning}
        className={`
          relative w-12 h-12 rounded-full glass overflow-hidden
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-primary/50
          ${isTransitioning ? 'pointer-events-none' : 'cursor-pointer'}
        `}
        whileHover={{ 
          scale: 1.1,
          boxShadow: isDark 
            ? "0 0 30px hsl(184 100% 50% / 0.4)" 
            : "0 0 30px hsl(45 100% 50% / 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: isDark 
            ? 'hsl(var(--glass-bg))' 
            : 'hsl(var(--glass-bg))',
          border: `1px solid ${isDark 
            ? 'hsl(var(--glass-border))' 
            : 'hsl(var(--glass-border))'}`,
          boxShadow: isDark 
            ? 'var(--shadow-glass)' 
            : 'var(--shadow-glass)'
        }}
      >
        {/* Liquid background effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: isDark 
              ? 'var(--liquid-flow)' 
              : 'var(--liquid-flow)',
            backgroundSize: '200% 200%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Icon container with glass effect */}
        <motion.div
          className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: isDark 
              ? 'hsl(var(--card) / 0.8)' 
              : 'hsl(var(--card) / 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDark 
              ? 'hsl(var(--border) / 0.3)' 
              : 'hsl(var(--border) / 0.3)'}`
          }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Moon 
                  className="w-5 h-5 text-primary" 
                  style={{ color: 'hsl(var(--primary))' }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Sun 
                  className="w-5 h-5 text-primary" 
                  style={{ color: 'hsl(var(--primary))' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Particle effects during transition */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: isDark 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--primary))',
                    left: '50%',
                    top: '50%'
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i * 60) * Math.PI / 180) * 30,
                    y: Math.sin((i * 60) * Math.PI / 180) * 30
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, hsl(184 100% 50% / 0.3), transparent 70%)' 
              : 'radial-gradient(circle, hsl(45 100% 50% / 0.3), transparent 70%)'
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
      >
        <div className="px-3 py-1 text-xs rounded-lg glass">
          <span className="text-foreground">
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
