
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    filter: 'blur(10px)'
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)'
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    filter: 'blur(10px)'
  }
};

const pageTransition = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 120,
  duration: 0.6
};

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen w-full"
      >
        {/* Page Content */}
        {children}

        {/* Transition Particles */}
        {isClient && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [
                    Math.random() * dimensions.width,
                    Math.random() * dimensions.width,
                    Math.random() * dimensions.width
                  ],
                  y: [
                    Math.random() * dimensions.height,
                    Math.random() * dimensions.height,
                    Math.random() * dimensions.height
                  ]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-primary rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
