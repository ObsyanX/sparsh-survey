import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Command,
  Eye,
  EyeOff,
  Menu,
  X
} from 'lucide-react';

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
    color: 'from-blue-500/30 to-blue-500/10',
    description: 'Mission Control Hub',
    audioNote: 'A4'
  },
  {
    id: 'upload',
    label: 'Data Intake',
    icon: <Upload className="w-5 h-5" />,
    path: '/upload',
    color: 'from-green-500/30 to-green-500/10',
    description: 'Import Datasets',
    audioNote: 'C4'
  },
  {
    id: 'cleaning',
    label: 'Clean Chamber',
    icon: <Zap className="w-5 h-5" />,
    path: '/cleaning',
    color: 'from-purple-500/30 to-purple-500/10',
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
  isCommandPaletteOpen: boolean;
  onCommandPaletteToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onNavigate?: (path: string, itemId: string) => void;
  currentPath?: string;
  variant?: 'sidebar' | 'overlay' | 'adaptive';
}

export default function NavigationCore({
  isCommandPaletteOpen,
  onCommandPaletteToggle,
  isVisible,
  onToggleVisibility,
  onNavigate,
  currentPath = '/',
  variant = 'adaptive'
}: NavigationCoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTrail, setActiveTrail] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const currentItem = navItems.find(item => item.path === currentPath) || navItems[0];

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which variant to show
  const getActiveVariant = () => {
    if (variant === 'adaptive') {
      return screenSize === 'mobile' ? 'overlay' : 'sidebar';
    }
    return variant;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onCommandPaletteToggle();
      }
      
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          onCommandPaletteToggle();
        }
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }

      // Toggle menu with 'm' key
      if (e.key === 'm' && !e.ctrlKey && !e.metaKey) {
        setIsMenuOpen(!isMenuOpen);
      }

      // Number key navigation
      if (e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key) - 1;
        if (index < navItems.length) {
          handleNavigation(navItems[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, onCommandPaletteToggle, isMenuOpen]);

  useEffect(() => {
    setActiveTrail(currentItem.id);
  }, [currentItem.id]);

  const handleNavigation = (item: NavItem) => {
    if (soundEnabled && item.audioNote) {
      console.log(`🎵 Playing note: ${item.audioNote} for ${item.label}`);
    }
    
    setActiveTrail(item.id);
    setIsMenuOpen(false);
    
    if (onNavigate) {
      setTimeout(() => {
        onNavigate(item.path, item.id);
      }, 150);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(item);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hidden state - just show the visibility toggle
  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed left-4 top-4 z-50"
      >
        <button
          onClick={onToggleVisibility}
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/30 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Eye className="w-5 h-5 text-white" />
        </button>
      </motion.div>
    );
  }

  const activeVariant = getActiveVariant();

  // Overlay Menu Variant
  if (activeVariant === 'overlay') {
    return (
      <>
        {/* Toggle Button */}
        <div className="fixed top-4 left-4 z-[70]">
          <motion.button
            onClick={toggleMenu}
            className={`
              relative w-14 h-14 rounded-2xl 
              bg-gradient-to-br from-black/80 to-black/60 
              backdrop-blur-xl border border-white/20
              flex items-center justify-center
              shadow-2xl shadow-black/30
              transition-all duration-300
              hover:shadow-2xl hover:shadow-blue-500/20
              ${isMenuOpen ? 'ring-2 ring-blue-500/50' : ''}
            `}
            whileHover={{ 
              scale: 1.05,
              rotate: 5
            }}
            whileTap={{ 
              scale: 0.95,
              rotate: -5
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated Menu Icon */}
            <motion.div
              animate={{ 
                rotate: isMenuOpen ? 180 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              className="relative"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.div>

            {/* Pulse Ring Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-blue-500/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Status Indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </div>

        {/* Navigation Menu Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  x: -100, 
                  y: -50,
                  scale: 0.8,
                  rotateY: -15
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  scale: 1,
                  rotateY: 0
                }}
                exit={{ 
                  opacity: 0, 
                  x: -100, 
                  y: -50,
                  scale: 0.8,
                  rotateY: -15
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.4
                }}
                className="fixed top-20 left-4 z-[65] w-80 max-w-[calc(100vw-2rem)]"
              >
                <div className="
                  bg-gradient-to-br from-black/90 to-black/70 
                  backdrop-blur-xl border border-white/20 
                  rounded-2xl shadow-2xl shadow-black/50
                  p-6 space-y-4
                ">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Observatory Controls
                      </h2>
                      <p className="text-sm text-gray-400">Navigate with precision</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-300">Online</span>
                    </div>
                  </div>

                  {/* Command Palette Button */}
                  <motion.button
                    onClick={onCommandPaletteToggle}
                    className="
                      w-full p-4 rounded-xl 
                      bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      border border-blue-500/30
                      flex items-center justify-between
                      hover:from-blue-500/30 hover:to-purple-500/30
                      transition-all duration-300
                      group
                    "
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Command className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Command Palette</span>
                    </div>
                    <kbd className="px-2 py-1 bg-black/30 text-xs text-gray-300 rounded">
                      Ctrl+K
                    </kbd>
                  </motion.button>

                  {/* Navigation Items */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {navItems.map((item, index) => {
                      const isActive = currentItem.id === item.id;
                      const isItemHovered = hoveredItem === item.id;
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleNavigation(item)}
                          onKeyDown={(e) => handleKeyPress(e, item)}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`
                            relative w-full p-4 rounded-xl 
                            flex items-center justify-between
                            transition-all duration-300
                            group
                            ${isActive 
                              ? `bg-gradient-to-r ${item.color} border border-current shadow-lg` 
                              : 'hover:bg-white/10 bg-black/20 border border-transparent'
                            }
                          `}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <motion.div
                              animate={{ 
                                scale: isItemHovered ? 1.2 : 1,
                                rotate: isActive ? 360 : 0 
                              }}
                              transition={{ duration: 0.3 }}
                              className={isActive ? 'text-white' : 'text-gray-300'}
                            >
                              {item.icon}
                            </motion.div>
                            <div className="text-left">
                              <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-200'}`}>
                                {item.label}
                              </div>
                              <div className={`text-xs ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                                {item.description}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-black/30 text-xs text-gray-300 rounded">
                              {index + 1}
                            </kbd>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-blue-400 rounded-full"
                              />
                            )}
                          </div>

                          <motion.div
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0"
                            animate={{ opacity: isItemHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Footer Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <motion.button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="
                        p-3 rounded-xl 
                        bg-black/30 border border-white/10
                        hover:bg-white/10 transition-all duration-300
                      "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Sound ${soundEnabled ? 'On' : 'Off'}`}
                    >
                      <Settings className={`w-4 h-4 ${soundEnabled ? 'text-green-400' : 'text-gray-400'}`} />
                    </motion.button>

                    <div className="text-xs text-gray-400">Press M to toggle menu</div>

                    <motion.button
                      onClick={onToggleVisibility}
                      className="
                        p-3 rounded-xl 
                        bg-black/30 border border-white/10
                        hover:bg-red-500/20 transition-all duration-300
                      "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Hide Navigation"
                    >
                      <EyeOff className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Sidebar Variant (Desktop)
  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
        >
          <div
            className={`
              relative flex flex-col items-center gap-2 p-3 rounded-xl 
              bg-black/20 backdrop-blur-md border border-white/10
              transition-all duration-300 ease-out
              ${isExpanded ? 'w-64' : 'w-16'}
              ${isHovered ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg'}
            `}
            onMouseEnter={() => {
              setIsHovered(true);
              setIsExpanded(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsExpanded(false);
            }}
          >
            {/* Command Palette Trigger */}
            <div className="group relative">
              <motion.button
                onClick={onCommandPaletteToggle}
                className="w-12 h-12 rounded-lg bg-black/20 backdrop-blur-md border border-white/10 mb-2 flex items-center justify-center hover:bg-blue-500/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Command className="w-5 h-5 text-blue-400" />
              </motion.button>
              
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Command Palette (Ctrl+K)
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <div className="space-y-2 w-full max-h-96 overflow-y-auto">
              {navItems.map((item, index) => {
                const isActive = currentItem.id === item.id;
                const isItemHovered = hoveredItem === item.id;
                
                return (
                  <div key={item.id} className="group relative">
                    <motion.button
                      onClick={() => handleNavigation(item)}
                      onKeyDown={(e) => handleKeyPress(e, item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        relative w-full h-12 rounded-lg flex items-center transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50
                        ${isActive 
                          ? `bg-gradient-to-r ${item.color} border border-current shadow-lg` 
                          : 'hover:bg-white/10 bg-black/10'
                        }
                      `}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Trail Indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-full"
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon */}
                      <div className="flex items-center justify-center w-12 h-12">
                        <motion.div
                          animate={{ 
                            scale: isItemHovered ? 1.2 : 1,
                            rotate: isActive ? 360 : 0 
                          }}
                          transition={{ duration: 0.3 }}
                          className={isActive ? 'text-white' : 'text-gray-300'}
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
                            <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-200'}`}>
                              {item.label}
                            </div>
                            <div className={`text-xs ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                              {item.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Keyboard Shortcut */}
                      {isExpanded && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="text-xs text-gray-400 bg-black/30 px-1 py-0.5 rounded">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </motion.button>

                    {/* Tooltip for collapsed state */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.label} - {item.description} ({index + 1})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="w-full border-t border-white/10 pt-2 mt-2 space-y-2">
              <div className="group relative">
                <motion.button
                  onClick={onToggleVisibility}
                  className="w-12 h-12 rounded-lg bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-all duration-200 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EyeOff className="w-5 h-5 text-red-400" />
                </motion.button>
                
                {!isExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Hide Navigation
                  </div>
                )}
              </div>
            </div>

            {/* Status Indicator */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 pt-2 border-t border-white/10 w-full"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-300">Observatory Online</span>
                  </div>
                  
                  <div className="text-center text-xs text-gray-400 space-y-1">
                    <div>Use 1-8 keys for quick nav</div>
                    <div>Press M for overlay menu</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-black/20 backdrop-blur-md border-t border-white/10 rounded-t-3xl px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item) => {
              const isActive = currentItem.id === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-xl
                    transition-all duration-300 min-w-0
                    ${isActive 
                      ? `bg-gradient-to-t ${item.color} shadow-lg` 
                      : 'hover:bg-white/10'
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
                    className={isActive ? 'text-white' : 'text-gray-300'}
                  >
                    {item.icon}
                  </motion.div>
                  <span className={`
                    text-xs mt-1 transition-colors
                    ${isActive ? 'text-white font-medium' : 'text-gray-400'}
                  `}>
                    {item.label.split(' ')[0]}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
            
            {/* Menu Toggle Button for Mobile */}
            <motion.button
              onClick={toggleMenu}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl
                transition-all duration-300 min-w-0
                ${isMenuOpen ? 'bg-blue-500/20' : 'hover:bg-white/10'}
              `}
              whileTap={{ scale: 0.95 }}
              aria-label="More Options"
            >
              <motion.div
                animate={{ 
                  rotate: isMenuOpen ? 180 : 0,
                  scale: isMenuOpen ? 1.1 : 1,
                  y: isMenuOpen ? -2 : 0 
                }}
                className={isMenuOpen ? 'text-blue-400' : 'text-gray-300'}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
              <span className={`
                text-xs mt-1 transition-colors
                ${isMenuOpen ? 'text-blue-400 font-medium' : 'text-gray-400'}
              `}>
                {isMenuOpen ? 'Close' : 'More'}
              </span>
              
              {/* Active Indicator */}
              {isMenuOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full"
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && screenSize === 'mobile' && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Bottom Sheet Menu */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed bottom-0 left-0 right-0 z-[65] md:hidden"
            >
              <div className="
                bg-gradient-to-t from-black/95 to-black/85 
                backdrop-blur-xl border-t border-white/20 
                rounded-t-3xl shadow-2xl
                p-6 pb-8 space-y-4
                max-h-[80vh] overflow-y-auto
              ">
                {/* Handle Bar */}
                <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4" />

                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Navigation Menu
                  </h2>
                  <p className="text-sm text-gray-400">Swipe down to close</p>
                </div>

                {/* Command Palette */}
                <motion.button
                  onClick={onCommandPaletteToggle}
                  className="
                    w-full p-4 rounded-xl 
                    bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                    border border-blue-500/30
                    flex items-center justify-center space-x-3
                    hover:from-blue-500/30 hover:to-purple-500/30
                    transition-all duration-300
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Command className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Command Palette</span>
                  <kbd className="px-2 py-1 bg-black/30 text-xs text-gray-300 rounded">
                    Ctrl+K
                  </kbd>
                </motion.button>

                {/* Grid of Navigation Items */}
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item, index) => {
                    const isActive = currentItem.id === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item)}
                        className={`
                          relative p-4 rounded-xl 
                          flex flex-col items-center space-y-2
                          transition-all duration-300
                          ${isActive 
                            ? `bg-gradient-to-br ${item.color} border border-current shadow-lg` 
                            : 'bg-black/30 border border-white/10 hover:bg-white/10'
                          }
                        `}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: isActive ? 360 : 0 
                          }}
                          transition={{ duration: 0.5 }}
                          className={isActive ? 'text-white' : 'text-gray-300'}
                        >
                          {item.icon}
                        </motion.div>
                        
                        <div className="text-center">
                          <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-200'}`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                            {item.description}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-black"
                          />
                        )}

                        {/* Keyboard Shortcut Badge */}
                        <div className="absolute top-2 right-2">
                          <span className="text-xs text-gray-400 bg-black/50 px-1.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <motion.button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="
                      flex items-center space-x-2 p-3 rounded-xl 
                      bg-black/30 border border-white/10
                      hover:bg-white/10 transition-all duration-300
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className={`w-4 h-4 ${soundEnabled ? 'text-green-400' : 'text-gray-400'}`} />
                    <span className="text-xs text-gray-300">
                      Sound {soundEnabled ? 'On' : 'Off'}
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={onToggleVisibility}
                    className="
                      flex items-center space-x-2 p-3 rounded-xl 
                      bg-black/30 border border-white/10
                      hover:bg-red-500/20 transition-all duration-300
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <EyeOff className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-gray-300">Hide Nav</span>
                  </motion.button>
                </div>

                {/* Quick Tips */}
                <div className="text-center text-xs text-gray-500 pt-2 border-t border-white/5">
                  <div>Use number keys 1-8 for quick navigation</div>
                  <div>Press M to toggle menu • Ctrl+K for commands</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}