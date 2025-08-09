
import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NavigationToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function NavigationToggle({ isVisible, onToggle }: NavigationToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-6 right-6 z-[60] hidden md:block"
    >
      <Card className="glass p-0 overflow-hidden">
        <motion.button
          onClick={onToggle}
          className="relative w-12 h-12 flex items-center justify-center quantum-glow-hover transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isVisible ? 'Hide Navigation' : 'Show Navigation'}
        >
          <motion.div
            animate={{ rotate: isVisible ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isVisible ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-primary" />
            )}
          </motion.div>
          
          {/* Pulse effect when hidden */}
          {!isVisible && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>
      </Card>
    </motion.div>
  );
}
