
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

export default function LoadingScreen({ message = 'Loading...', progress }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Logo/Icon */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-24 h-24 mx-auto relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-r-quantum-purple animate-spin animation-reverse"></div>
        </motion.div>

        {/* Message */}
        <div className="space-y-2">
          <motion.h3 
            className="text-xl font-semibold gradient-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {message}
          </motion.h3>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-64 mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-primary to-quantum-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/60 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `calc(50% + ${Math.random() * 400 - 200}px)`,
              top: `calc(50% + ${Math.random() * 400 - 200}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
