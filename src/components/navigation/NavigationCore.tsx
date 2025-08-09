
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  Zap, 
  BarChart3, 
  MessageCircle, 
  FileText, 
  Grid3X3,
  Brain,
  Settings,
  Command
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  description: string;
  audioNote?: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Observatory',
    icon: <Home className="w-5 h-5" />,
    path: '/',
    color: 'from-primary/30 to-primary/10',
    description: 'Mission Control Hub',
    audioNote: 'A4'
  },
  {
    id: 'upload',
    label: 'Data Intake',
    icon: <Upload className="w-5 h-5" />,
    path: '/upload',
    color: 'from-quantum-green/30 to-quantum-green/10',
    description: 'Import Datasets',
    audioNote: 'C4'
  },
  {
    id: 'cleaning',
    label: 'Clean Chamber',
    icon: <Zap className="w-5 h-5" />,
    path: '/cleaning',
    color: 'from-quantum-purple/30 to-quantum-purple/10',
    description: 'Data Processing',
    audioNote: 'E4'
  },
  {
    id: 'visualize',
    label: 'Insight Gallery',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/visualize',
    color: 'from-yellow-500/30 to-yellow-500/10',
    description: 'Visual Analytics',
    audioNote: 'G4'
  },
  {
    id: 'explorer',
    label: '3D Explorer',
    icon: <Grid3X3 className="w-5 h-5" />,
    path: '/explorer',
    color: 'from-cyan-500/30 to-cyan-500/10',
    description: 'Holographic Views',
    audioNote: 'B4'
  },
];

interface NavigationCoreProps {
  isCommandPaletteOpen?: boolean;
  onCommandPaletteToggle?: () => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export default function NavigationCore({ 
  isCommandPaletteOpen, 
  onCommandPaletteToggle,
  isVisible = true,
  onToggleVisibility
}: NavigationCoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTrail, setActiveTrail] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useTheme();

  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

  useEffect(() => {
    setActiveTrail(currentItem.id);
  }, [currentItem.id]);

  const handleNavigation = (item: NavItem) => {
    if (settings.soundEnabled && item.audioNote) {
      // Play audio note (placeholder for actual audio implementation)
      console.log(`Playing note: ${item.audioNote}`);
    }
    
    setActiveTrail(item.id);
    
    // Smooth navigation with transition delay
    setTimeout(() => {
      navigate(item.path);
    }, 150);
  };

  const handleKeyPress = (e: React.KeyboardEvent, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(item);
    }
  };

  return (
    <>
      {/* Desktop Navigation Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-6 right-6 z-50 hidden md:block"
      >
        <motion.button
          onClick={onToggleVisibility}
          className={`
            relative w-12 h-12 rounded-xl glass border border-border/30 
            flex items-center justify-center group overflow-hidden
            transition-all duration-300 quantum-glow-hover
            ${isVisible ? 'bg-gradient-to-br from-primary/20 to-primary/5' : 'hover:bg-muted/20'}
          `}
          whileHover={{ scale: 1.05, rotateY: 10 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isVisible ? "Hide navigation" : "Show navigation"}
        >
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-quantum-purple/10 rounded-xl"
            animate={{ 
              opacity: isVisible ? [0.3, 0.6, 0.3] : 0,
              scale: isVisible ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Icon with rotation animation */}
          <motion.div
            animate={{ 
              rotate: isVisible ? 0 : 180,
              scale: isVisible ? 1 : 0.8
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-10"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`transition-colors duration-300 ${isVisible ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <motion.path
                d="M3 12h18M3 6h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </svg>
          </motion.div>
          
          {/* Hover particles */}
          <AnimatePresence>
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: '50%',
                  y: '50%'
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute w-1 h-1 bg-primary rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
              />
            ))}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Desktop Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block"
          >
            <Card 
              className={`
                glass p-2 transition-all duration-500 group
                ${isExpanded ? 'w-64' : 'w-16'}
              `}
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
        >
          {/* Command Palette Trigger */}
          <motion.button
            onClick={onCommandPaletteToggle}
            className="w-12 h-12 rounded-lg glass mb-2 flex items-center justify-center quantum-glow-hover"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open Command Palette (Ctrl+K)"
          >
            <Command className="w-5 h-5 text-primary" />
          </motion.button>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = currentItem.id === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  onKeyDown={(e) => handleKeyPress(e, item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    relative w-full h-12 rounded-lg flex items-center transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} quantum-glow border border-current` 
                      : 'hover:bg-muted/20'
                    }
                  `}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Navigate to ${item.label}: ${item.description}`}
                >
                  {/* Trail Indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12">
                    <motion.div
                      animate={{ 
                        scale: isHovered ? 1.2 : 1,
                        rotate: isActive ? 360 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                  </div>

                  {/* Label & Description */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 text-left ml-2"
                      >
                        <div className="font-medium text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Particles */}
                  <AnimatePresence>
                    {isHovered && (
                      <>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ 
                              opacity: 0, 
                              scale: 0,
                              x: '0%',
                              y: '0%'
                            }}
                            animate={{ 
                              opacity: [0, 1, 0], 
                              scale: [0, 1, 0],
                              x: `${(Math.random() - 0.5) * 100}%`,
                              y: `${(Math.random() - 0.5) * 100}%`
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.1,
                              repeat: Infinity,
                              repeatDelay: 0.5
                            }}
                            className="absolute w-1 h-1 bg-primary rounded-full pointer-events-none"
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 pt-2 border-t border-border/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-quantum-green rounded-full animate-pulse" />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground"
                >
                  Observatory Online
                </motion.span>
              )}
            </div>
          </motion.div>
        </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Card className="glass border-t border-border/20 rounded-t-3xl px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map((item) => {
              const isActive = currentItem.id === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-xl
                    transition-all duration-300 min-w-0
                    ${isActive 
                      ? `bg-gradient-to-t ${item.color} quantum-glow` 
                      : 'hover:bg-muted/20'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                  aria-label={item.label}
                >
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0 
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className={`
                    text-xs mt-1 transition-colors
                    ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}
                  `}>
                    {item.label.split(' ')[0]}
                  </span>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
