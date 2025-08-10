
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  isVisible?: boolean;
}

export default function LoadingScreen({ 
  message = 'Loading...', 
  progress, 
  isVisible = true 
}: LoadingScreenProps) {
  const [particleCount, setParticleCount] = useState(12);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Adjust particle count based on screen size
    const updateParticleCount = () => {
      const width = window.innerWidth;
      if (width < 768) setParticleCount(6);
      else if (width < 1024) setParticleCount(8);
      else setParticleCount(12);
    };

    updateParticleCount();
    window.addEventListener('resize', updateParticleCount);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', updateParticleCount);
    };
  }, []);

  const coreVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const orbitalVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const particleVariants = {
    animate: (i: number) => ({
      y: [-20, -100],
      x: [0, Math.sin(i) * 50],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: i * 0.3,
        ease: "easeInOut"
      }
    })
  };

  const waveVariants = {
    animate: (i: number) => ({
      scale: [0, 3],
      opacity: [0.8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.5,
        ease: "easeOut"
      }
    })
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress || 0}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      {/* Background Quantum Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`bg-particle-${i}`}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            custom={i}
            variants={particleVariants}
            animate="animate"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Container */}
      <div className="relative text-center space-y-8 max-w-md mx-auto px-4">
        {/* Core Loading Orb */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Inner Core */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-quantum-purple to-quantum-green"
            variants={coreVariants}
            initial="initial"
            animate="animate"
            style={{
              boxShadow: '0 0 40px hsl(184 100% 50% / 0.5), 0 0 80px hsl(262 83% 65% / 0.3)'
            }}
          />

          {/* Quantum Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 40px hsl(184 100% 50% / 0.5)',
                '0 0 80px hsl(262 83% 65% / 0.8)',
                '0 0 40px hsl(184 100% 50% / 0.5)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Orbital Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/40"
            variants={orbitalVariants}
            animate="animate"
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-quantum-purple/60"
            variants={orbitalVariants}
            animate="animate"
            style={{ animationDirection: 'reverse' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-quantum-green/40"
            variants={orbitalVariants}
            animate="animate"
          />

          {/* Ripple Waves */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute inset-0 rounded-full border border-primary/20"
              custom={i}
              variants={waveVariants}
              animate="animate"
            />
          ))}

          {/* Energy Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`energy-${i}`}
              className="absolute w-2 h-2 bg-primary rounded-full"
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <motion.h3 
            className="text-xl md:text-2xl font-semibold gradient-text"
            animate={{ 
              opacity: [0.6, 1, 0.6],
              textShadow: [
                '0 0 10px hsl(184 100% 50% / 0.5)',
                '0 0 20px hsl(184 100% 50% / 0.8)',
                '0 0 10px hsl(184 100% 50% / 0.5)'
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {message}
          </motion.h3>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full max-w-xs mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-quantum-purple to-quantum-green rounded-full relative"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                >
                  {/* Progress Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 10px hsl(184 100% 50% / 0.5)',
                        '0 0 20px hsl(184 100% 50% / 0.8)',
                        '0 0 10px hsl(184 100% 50% / 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Quantum Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={`float-particle-${i}`}
              className="absolute w-1 h-1 bg-gradient-to-r from-primary to-quantum-purple rounded-full"
              custom={i}
              variants={particleVariants}
              animate="animate"
              style={{
                left: `${50 + Math.cos(i * 30) * 30}%`,
                top: `${50 + Math.sin(i * 30) * 30}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Holographic Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          animate={{
            y: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Energy Flow Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`energy-line-${i}`}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"
            style={{
              left: `${25 + i * 16.66}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}
