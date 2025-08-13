{/* Enhanced Upload Portal Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center space-y-8 max-w-3xl mx-auto"
              >
                {/* Elegant Text Above Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full glass">
                    <Upload className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Data Portal • Status: Ready for Upload • Theme: {isDarkMode ? '🌙' : '☀️'}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                    Initialiimport { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Brain, Settings, Command, FileText } from "lucide-react";
import Spline from '@splinetool/react-spline';

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [activeMode, setActiveMode] = useState('analysis');
  const [showAIPanel, setShowAIPanel] = useState(false);
  
  // Add state for DataUpload integration
  const [uploadedData, setUploadedData] = useState(null);

  // Add state for background optimization and theme detection
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const splineRef = useRef(null);

  // Theme detection - check for dark mode
  useEffect(() => {
    const detectTheme = () => {
      // Check for theme preference in various ways
      const htmlElement = document.documentElement;
      const hasThemeClass = htmlElement.classList.contains('dark');
      const themeAttribute = htmlElement.getAttribute('data-theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Priority: class > data-theme > system preference > default
      if (hasThemeClass) {
        setIsDarkMode(true);
      } else if (htmlElement.classList.contains('light')) {
        setIsDarkMode(false);
      } else if (themeAttribute === 'dark') {
        setIsDarkMode(true);
      } else if (themeAttribute === 'light') {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(systemPreference);
      }
    };

    detectTheme();

    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  // Check if device is mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get the appropriate Spline scene URL based on theme
  const getSplineScene = () => {
    if (isDarkMode) {
      return "https://prod.spline.design/Lws6iY4vBNT0NXoF/scene.splinecode"; // Night mode
    } else {
      return "https://my.spline.design/celestialflowabstractdigitalform-L97Y3gllTjo31hSiXkOJpA51/"; // Day mode
    }
  };

  // Reset Spline loading state when theme changes
  useEffect(() => {
    setSplineLoaded(false);
    setSplineError(false);
  }, [isDarkMode]);

  useEffect(() => {
    const forceCursorVisibility = () => {
      const cursorElement = document.querySelector('.animated-cursor');
      if (cursorElement) {
        cursorElement.style.opacity = '1';
        cursorElement.style.visibility = 'visible';
        cursorElement.style.zIndex = '9999';
      }
    };

    // Force cursor visibility after a delay
    setTimeout(forceCursorVisibility, 100);
    setTimeout(forceCursorVisibility, 500);
    setTimeout(forceCursorVisibility, 1000);

    // Also force on scroll and resize
    window.addEventListener('scroll', forceCursorVisibility);
    window.addEventListener('resize', forceCursorVisibility);

    return () => {
      window.removeEventListener('scroll', forceCursorVisibility);
      window.removeEventListener('resize', forceCursorVisibility);
    };
  }, []);

  // Mock data state
  const [insights] = useState([
    { 
      id: '1', 
      type: 'correlation', 
      title: 'Strong Education-Employment Link', 
      description: 'High correlation detected between education level and employment status',
      value: '0.78',
      priority: 'high',
      isPinned: false,
      timestamp: new Date()
    },
    { 
      id: '2', 
      type: 'anomaly', 
      title: 'Income Anomalies Found', 
      description: '12 data points exceed 3 standard deviations from mean',
      value: '12',
      priority: 'high',
      isPinned: false,
      timestamp: new Date()
    },
    { 
      id: '3', 
      type: 'trend', 
      title: 'Regional Disparity Trend', 
      description: 'Consistent income gaps observed across urban-rural divide',
      value: '3.2x',
      priority: 'medium',
      isPinned: false,
      timestamp: new Date()
    }
  ]);

  // Updated handler for DataUpload component
  const handleDataUploaded = (data) => {
    console.log('Data uploaded successfully:', data);
    setUploadedData({ id: data.dataset_id, filename: data.filename, preview: data.preview });
    
    // Create a mock File object for compatibility with existing code
    const mockFile = new File([], data.filename, { type: 'text/csv' });
    setUploadedFile(mockFile);
    
    // Automatically transition to analysis ready state
    setIsAnalysisReady(true);
    setShowAIPanel(true);
  };

  // Keep the old handleFileUpload for backward compatibility if needed
  const handleFileUpload = (file) => {
    setIsUploading(true);
    setUploadedFile(file);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsAnalysisReady(true);
        setShowAIPanel(true);
      }, 3000);
    }, 1500);
  };

  const handleVisualize = (data) => {
    console.log('Visualizing:', data);
  };

  const handleExport = (data) => {
    console.log('Exporting:', data);
  };

  const handleModuleSelect = (moduleId) => {
    setActiveMode(moduleId);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isAnalysisReady ? (
          // Welcome State - Data Navigator Introduction
          <div className="space-y-12 mt-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full glass">
                <Command className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  Data Observatory • Status: Orbital • Theme: {isDarkMode ? 'Night' : 'Day'}
                </span>
              </div>

              <div className="relative min-h-screen flex justify-center mb-16 overflow-hidden">
                {/* Conditional Background - Spline for md/lg screens, Gradient for mobile */}
                {!isMobile ? (
                  // Theme-aware Spline for md/lg screens
                  <div className="absolute inset-0 w-full h-full z-[-1]">
                    {!splineError && (
                      <Spline 
                        ref={splineRef}
                        scene={getSplineScene()}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          pointerEvents: 'none', // Disable interactions for performance
                          willChange: 'transform', // Optimize for animations
                          backfaceVisibility: 'hidden', // Optimize 3D rendering
                        }}
                        onLoad={() => {
                          console.log(`Spline loaded successfully - ${isDarkMode ? 'Night' : 'Day'} mode`);
                          setSplineLoaded(true);
                          
                          // Additional performance optimizations after load
                          const canvas = document.querySelector('canvas');
                          if (canvas) {
                            // Enable hardware acceleration
                            canvas.style.transform = 'translateZ(0)';
                            canvas.style.transformStyle = 'preserve-3d';
                            
                            // Optimize for different screen sizes
                            if (window.innerWidth >= 1024) {
                              // Full quality for large screens
                              canvas.style.imageRendering = 'auto';
                            } else if (window.innerWidth >= 768) {
                              // Medium quality for tablets
                              canvas.style.imageRendering = 'optimizeSpeed';
                              canvas.style.filter = 'contrast(1.1) brightness(1.05)';
                            }
                          }
                        }}
                        onError={() => {
                          console.warn('Spline failed to load, showing gradient fallback');
                          setSplineError(true);
                        }}
                      />
                    )}
                    
                    {/* Theme-aware fallback gradient for failed Spline loads */}
                    {splineError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 w-full h-full"
                        style={{
                          background: isDarkMode 
                            ? `
                                radial-gradient(circle at 20% 80%, rgba(120, 53, 255, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(0, 255, 135, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)
                              `
                            : `
                                radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                                radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                                linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)
                              `,
                        }}
                      />
                    )}
                    
                    {/* Loading indicator for Spline */}
                    {!splineLoaded && !splineError && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background/90 to-background/70"
                      >
                        <div className="text-center space-y-4">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Loading 3D environment... ({isDarkMode ? 'Night' : 'Day'} Mode)
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  // Theme-aware gradient background for mobile
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full z-[-1]"
                    style={{
                      background: isDarkMode
                        ? `
                            radial-gradient(circle at 25% 75%, rgba(120, 53, 255, 0.3) 0%, transparent 60%),
                            radial-gradient(circle at 75% 25%, rgba(0, 255, 135, 0.2) 0%, transparent 60%),
                            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
                            linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)
                          `
                        : `
                            radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
                            radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
                            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
                            linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 50%, rgba(241, 245, 249, 0.5) 100%)
                          `,
                    }}
                  >
                    {/* Theme-aware animated particles for mobile */}
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            opacity: 0,
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                          }}
                          animate={{
                            opacity: [0, 0.4, 0],
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                          }}
                          transition={{
                            duration: Math.random() * 8 + 12,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                          }}
                          className={`absolute w-1 h-1 rounded-full ${
                            isDarkMode ? 'bg-primary/60' : 'bg-blue-500/40'
                          }`}
                          style={{
                            boxShadow: isDarkMode
                              ? `0 0 ${Math.random() * 10 + 5}px rgba(59, 130, 246, 0.3)`
                              : `0 0 ${Math.random() * 8 + 3}px rgba(59, 130, 246, 0.2)`,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Theme-aware enhanced overlay */}
                <div className={`absolute inset-0 ${
                  isMobile 
                    ? (isDarkMode 
                        ? 'bg-gradient-to-b from-black/20 via-transparent to-black/40' 
                        : 'bg-gradient-to-b from-white/10 via-transparent to-white/20')
                    : (isDarkMode
                        ? 'bg-gradient-to-b from-black/30 via-black/5 to-black/20'
                        : 'bg-gradient-to-b from-white/20 via-white/5 to-white/10')
                }`} />
                
                {/* Text Content in Foreground */}
                <div className="relative z-10 text-center max-w-4xl px-6 pt-8 md:pt-12">
                  <h1 className="text-5xl md:text-6xl font-bold gradient-text pb-3 leading-relaxed">
                   Hey Data Navigator — <span className="text-primary">Metryx</span> has you covered.
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground mt-6 leading-relaxed">
                   Turn your <span className="text-primary">.csv</span> file into instant, AI-powered data, beautifully crafted into immersive PDF insights.
                  </p>
                  
                  <div className="text-xl md:text-2xl mt-8 inline-flex items-center text-primary font-medium">
                    Decode. Discover. Deliver.
                  </div>
                </div>
              </div>
              
              {/* Feature cards with optimized animations */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto rounded-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: -5,
                    z: 50
                  }}
                  className="relative perspective-1000"
                >
                  <div className="glass p-6 text-center space-y-3 cursor-pointer transition-all duration-500 relative overflow-hidden group hover:border-border/50 hover:shadow-2xl rounded-3xl">
                    {/* Holographic scan lines effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-3 ">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                      >
                        <Upload className="w-6 h-6 text-primary" />
                      </motion.div>
                      <h3 className="font-semibold">Data Intake</h3>
                      <p className="text-xs text-muted-foreground">Beam aboard your survey datasets</p>
                    </div>

                    {/* Hover particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                      {Array.from({ length: 6 }).map((_, i) => (
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
                            x: `${50 + (Math.random() - 0.5) * 200}%`,
                            y: `${50 + (Math.random() - 0.5) * 200}%`
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="absolute w-1 h-1 bg-primary rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Other feature cards would be similar - I'll include just one more for brevity */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: -5,
                    z: 50
                  }}
                  className="relative perspective-1000"
                >
                  <div className="glass p-6 text-center space-y-3 cursor-pointer transition-all duration-500 relative overflow-hidden group hover:border-border/50 hover:shadow-2xl rounded-3xl">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-pulse" />
                    
                    <div className="relative z-10 space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center"
                      >
                        <Brain className="w-6 h-6 text-purple-500" />
                      </motion.div>
                      <h3 className="font-semibold">AI Analysis</h3>
                      <p className="text-xs text-muted-foreground">Multi-agent intelligence processing</p>
                    </div>
                  </div>
                </motion.div>

                {/* Add other cards similarly */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: -5,
                    z: 50
                  }}
                  className="relative perspective-1000"
                >
                  <div className="glass p-6 text-center space-y-3 cursor-pointer transition-all duration-500 relative overflow-hidden group hover:border-border/50 hover:shadow-2xl rounded-3xl">
                    {/* Holographic scan lines effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center"
                      >
                        <BarChart3 className="w-6 h-6 text-green-500" />
                      </motion.div>
                      <h3 className="font-semibold">3D Visualization</h3>
                      <p className="text-xs text-muted-foreground">Immersive and interactive data exploration</p>
                    </div>

                    {/* Hover particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                      {Array.from({ length: 6 }).map((_, i) => (
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
                            x: `${50 + (Math.random() - 0.5) * 200}%`,
                            y: `${50 + (Math.random() - 0.5) * 200}%`
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="absolute w-1 h-1 bg-green-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: -5,
                    z: 50
                  }}
                  className="relative perspective-1000"
                >
                  <div className="glass p-6 text-center space-y-3 cursor-pointer transition-all duration-500 relative overflow-hidden group hover:border-border/50 hover:shadow-2xl rounded-3xl">
                    {/* Holographic scan lines effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center"
                      >
                        <FileText className="w-6 h-6 text-yellow-500" />
                      </motion.div>
                      <h3 className="font-semibold">Narrative Studio</h3>
                      <p className="text-xs text-muted-foreground">Build intelligent data stories using AI</p>
                      
                    </div>

                    {/* Hover particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                      {Array.from({ length: 6 }).map((_, i) => (
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
                            x: `${50 + (Math.random() - 0.5) * 200}%`,
                            y: `${50 + (Math.random() - 0.5) * 200}%`
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="absolute w-1 h-1 bg-yellow-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Upload Portal Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center space-y-8 max-w-3xl mx-auto"
            >
              {/* Elegant Text Above Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full glass">
                  <Upload className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Data Portal • Status: Ready for Upload</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                  Initialize Data Transfer
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Access the dedicated upload chamber where your datasets undergo 
                  quantum processing and AI-driven analysis
                </p>
              </motion.div>

              {/* Main Portal Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative"
              > 
                <motion.button
                  onClick={() => window.location.href = 'http://localhost:8080/upload'}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 text-lg font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 glass hover:border-primary/50"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <Upload className="w-5 h-5" />
                    <span>Enter Upload Portal</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-green-500"
                    >
                      →
                    </motion.div>
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          // Analysis Interface - This section remains for when user is in analysis mode
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold gradient-text mb-4">Analysis Dashboard</h2>
              <p className="text-muted-foreground">Your data analysis results will appear here</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;