import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: 'cyan' | 'purple' | 'green';
  delay?: number;
}

export default function KPICard({ title, value, suffix = '', icon, color, delay = 0 }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    animationRef.current = setTimeout(() => {
      const increment = value / 50; // Faster animation
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30); // Slightly slower interval for smoother animation
    }, delay);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [value, delay]);

  const colorClasses = {
    cyan: 'from-primary/20 to-primary/5 border-primary/30',
    purple: 'from-quantum-purple/20 to-quantum-purple/5 border-quantum-purple/30',
    green: 'from-quantum-green/20 to-quantum-green/5 border-quantum-green/30'
  };

  const glowClasses = {
    cyan: 'quantum-glow-hover text-primary',
    purple: 'hover:shadow-[0_0_30px_hsl(var(--quantum-purple)/0.3)] text-quantum-purple',
    green: 'hover:shadow-[0_0_30px_hsl(var(--quantum-green)/0.3)] text-quantum-green'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.01 }} // Reduced scale for better performance
      className="group"
      style={{ contain: 'layout style' }}
    >
      <Card className={`glass relative p-3 sm:p-4 md:p-6 bg-gradient-to-br ${colorClasses[color]} ${glowClasses[color]} transition-all duration-300`}>
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-15 transition-opacity duration-300 bg-gradient-glow" style={{ contain: 'layout style' }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
              {icon}
            </div>
            <div className="w-8 sm:w-12 h-1 sm:h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-60 animate-pulse" />
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
            <div className="flex items-baseline space-x-1">
              <motion.span 
                className="text-lg sm:text-xl md:text-2xl font-bold"
                key={displayValue}
                initial={{ scale: 1.1 }} // Reduced scale for better performance
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }} // Faster transition
              >
                {displayValue.toLocaleString()}
              </motion.span>
              {suffix && <span className="text-xs sm:text-sm opacity-60">{suffix}</span>}
            </div>
          </div>
          
          {/* Animated line */}
          <div className="mt-3 sm:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 rounded-full" style={{ contain: 'layout style' }} />
        </div>
      </Card>
    </motion.div>
  );
}