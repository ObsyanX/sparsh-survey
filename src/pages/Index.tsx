import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Brain, Command, FileText } from "lucide-react";
// Fix: Changed the import to use a CDN to resolve the module.
import Spline from 'https://esm.sh/@splinetool/react-spline';

// Mock components to make the example runnable
const ProcessingTimeline = () => <div className="flex items-center justify-center h-screen"><div className="text-xl">Processing...</div></div>;
const LoadingScreen = ({ message }: { message: string }) => <div className="flex items-center justify-center h-screen"><div className="text-xl">{message}</div></div>;
const Footer = () => <footer className="text-center p-4 text-sm text-gray-500">Footer Content</footer>;
const ThemeToggle = () => <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800">Toggle</button>;
const AmbientSoundSystem = ({ isActive }: { isActive: boolean }) => null; // Mocked, no output

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [activeMode, setActiveMode] = useState<'analysis' | 'story' | '3d' | 'presentation' | 'simulation'>('analysis');
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Add state for DataUpload integration
  const [uploadedData, setUploadedData] = useState<{ id: string; filename: string; preview: any[] } | null>(null);
  // Add state for background optimization and theme detection
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const splineRef = useRef<any>(null);

  // Check if device is mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    // Initial check
    checkTheme();
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  useEffect(() => {
    const forceCursorVisibility = () => {
      const cursorElement = document.querySelector('.animated-cursor') as HTMLElement;
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

  // Handler for DataUpload component
  const handleDataUploaded = (data: { dataset_id: string; filename: string; preview: any[] }) => {
    console.log('Data uploaded successfully:', data);
    setUploadedData({ id: data.dataset_id, filename: data.filename, preview: data.preview });

    // Automatically transition to analysis ready state
    setIsAnalysisReady(true);
    setShowAIPanel(true);
  };

  const handleVisualize = (data: any) => {
    console.log('Visualizing:', data);
  };

  const handleExport = (data: any) => {
    console.log('Exporting:', data);
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveMode(moduleId as 'analysis' | 'story' | '3d' | 'presentation' | 'simulation');
  };

  // Get appropriate Spline URL based on theme
  const getSplineURL = () => {
    return isDarkMode
      ? "https://prod.spline.design/Lws6iY4vBNT0NXoF/scene.splinecode"  // Night mode (original)
      : "https://prod.spline.design/3i9rq8XpVu70n2WP/scene.splinecode"; // Day mode (new)
  };

  // Get theme-appropriate gradient colors
  const getThemeGradients = () => {
    if (isDarkMode) {
      return {
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 53, 255, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 255, 135, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)
        `,
        overlay: 'bg-gradient-to-b from-black/30 via-black/5 to-black/20',
        mobileGradient: `
          radial-gradient(circle at 25% 75%, rgba(120, 53, 255, 0.3) 0%, transparent 60%),
          radial-gradient(circle at 75% 25%, rgba(0, 255, 135, 0.2) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
          linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)
        `,
        mobileOverlay: 'bg-gradient-to-b from-black/20 via-transparent to-black/40',
        particles: 'bg-blue-300/60'
      };
    } else {
      return {
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 200, 100, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(100, 200, 255, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 150, 200, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 250, 255, 0.7) 100%)
        `,
        overlay: 'bg-gradient-to-b from-white/20 via-white/5 to-white/30',
        mobileGradient: `
          radial-gradient(circle at 25% 75%, rgba(255, 200, 100, 0.25) 0%, transparent 60%),
          radial-gradient(circle at 75% 25%, rgba(100, 200, 255, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(255, 150, 200, 0.15) 0%, transparent 60%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 250, 255, 0.8) 50%, rgba(250, 245, 255, 0.6) 100%)
        `,
        mobileOverlay: 'bg-gradient-to-b from-white/30 via-transparent to-white/40',
        particles: 'bg-blue-500/60'
      };
    }
  };

  const themeColors = getThemeGradients();

  if (isUploading) {
    return <LoadingScreen message="Uploading dataset to processors..." />;
  }

  if (isProcessing) {
    return <ProcessingTimeline />;
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <ThemeToggle />
      <AmbientSoundSystem isActive={isAnalysisReady} />

      <div className="container mx-auto px-4 py-8">
        {!isAnalysisReady ? (
          <div className="space-y-12 mt-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? 'border border-white/10 bg-black/20 text-white/90'
                  : 'bg-white/80 border border-black/10 text-slate-700 shadow-lg backdrop-blur-sm'
              }`}>
                <Command className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="text-sm font-medium">Data Observatory • Status: Orbital</span>
              </div>

              <div className="relative min-h-screen flex justify-center mb-16 overflow-hidden">
                {!isMobile ? (
                  <div className="absolute inset-0 w-full h-full z-0">
                    {!splineError && (
                      <Spline
                        key={isDarkMode ? 'dark' : 'light'}
                        ref={splineRef}
                        scene={getSplineURL()}
                        style={{
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          willChange: 'transform',
                          backfaceVisibility: 'hidden',
                        }}
                        onLoad={() => {
                          console.log('Spline loaded successfully for', isDarkMode ? 'dark' : 'light', 'mode');
                          setSplineLoaded(true);
                          const canvas = splineRef.current?.shadowRoot?.querySelector('canvas');
                          if (canvas) {
                            canvas.style.transform = 'translateZ(0)';
                            canvas.style.transformStyle = 'preserve-3d';
                            if (window.innerWidth >= 1024) {
                              canvas.style.imageRendering = 'auto';
                            } else if (window.innerWidth >= 768) {
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
                    {splineError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 w-full h-full"
                        style={{ background: themeColors.background }}
                      />
                    )}
                    {!splineLoaded && !splineError && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 flex items-center justify-center ${
                          isDarkMode
                            ? 'bg-gradient-to-br from-gray-900/90 to-gray-900/70'
                            : 'bg-gradient-to-br from-white/95 to-slate-50/90'
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
                            isDarkMode ? 'border-blue-400' : 'border-blue-600'
                          }`} />
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>Loading 3D environment...</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full z-0"
                    style={{ background: themeColors.mobileGradient }}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={`${isDarkMode}-${i}`}
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
                          className={`absolute w-1 h-1 rounded-full ${themeColors.particles}`}
                          style={{
                            boxShadow: `0 0 ${Math.random() * 10 + 5}px ${
                              isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.4)'
                            }`,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div className={`absolute inset-0 z-5 ${
                  isMobile ? themeColors.mobileOverlay : themeColors.overlay
                }`} />
                <div className="relative z-10 text-center max-w-4xl px-6 pt-8 md:pt-12">
                  <h1 className={`text-5xl md:text-6xl font-bold pb-3 leading-relaxed transition-all duration-500 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-300 via-purple-400 to-green-300 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent'
                  }`}>
                    Hey Data Navigator — <span className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>Metryx</span> has you covered.
                  </h1>
                  <p className={`text-xl md:text-2xl mt-6 leading-relaxed transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Turn your <span className={`font-semibold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>.csv</span> file into instant, AI-powered data, beautifully crafted into immersive PDF insights.
                  </p>
                  <div className={`text-xl md:text-2xl mt-8 inline-flex items-center font-medium transition-colors duration-500 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Decode. Discover. Deliver.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  {
                    icon: Upload,
                    title: "Data Intake",
                    description: "Beam aboard your survey datasets",
                    color: isDarkMode ? 'text-blue-400' : 'text-blue-600',
                    bgColor: isDarkMode ? 'from-blue-500/20 to-blue-500/5' : 'from-blue-500/20 to-blue-500/5',
                    particleColor: isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                  },
                  {
                    icon: Brain,
                    title: "AI Analysis",
                    description: "Multi-agent intelligence processing",
                    color: isDarkMode ? 'text-purple-400' : 'text-purple-600',
                    bgColor: isDarkMode ? 'from-purple-500/20 to-purple-500/5' : 'from-purple-500/20 to-purple-500/5',
                    particleColor: isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                  },
                  {
                    icon: BarChart3,
                    title: "3D Visualization",
                    description: "Immersive and interactive data exploration",
                    color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
                    bgColor: isDarkMode ? 'from-emerald-500/20 to-emerald-500/5' : 'from-emerald-500/20 to-emerald-500/5',
                    particleColor: isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
                  },
                  {
                    icon: FileText,
                    title: "Narrative Studio",
                    description: "Build intelligent data stories using AI",
                    color: isDarkMode ? 'text-yellow-400' : 'text-orange-600',
                    bgColor: isDarkMode ? 'from-yellow-500/20 to-yellow-500/5' : 'from-orange-500/20 to-orange-500/5',
                    particleColor: isDarkMode ? 'bg-yellow-400' : 'bg-orange-500'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={`${isDarkMode}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotateX: -5,
                      z: 50
                    }}
                    className="relative" style={{ perspective: '1000px' }}
                  >
                    <div className={`p-6 text-center space-y-3 cursor-pointer transition-all duration-500 relative overflow-hidden group rounded-3xl ${
                      isDarkMode
                        ? 'border border-white/10 bg-gray-800/20 hover:border-white/20 hover:shadow-2xl'
                        : 'bg-white/90 border border-black/10 hover:border-black/20 shadow-lg hover:shadow-2xl backdrop-blur-sm'
                    }`}>
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse ${
                        isDarkMode
                          ? 'bg-gradient-to-b from-transparent via-blue-500/10 to-transparent'
                          : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'
                      }`} />
                      <div className="relative z-10 space-y-3">
                        <motion.div
                          whileHover={{ scale: 1.2, rotateY: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${item.bgColor} flex items-center justify-center`}
                        >
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </motion.div>
                        <h3 className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>{item.title}</h3>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>{item.description}</p>
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{
                              opacity: 0, scale: 0, x: '50%', y: '50%'
                            }}
                            animate={{
                              opacity: [0, 1, 0], scale: [0, 1, 0],
                              x: `${50 + (Math.random() - 0.5) * 200}%`,
                              y: `${50 + (Math.random() - 0.5) * 200}%`
                            }}
                            transition={{
                              duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1
                            }}
                            className={`absolute w-1 h-1 rounded-full ${item.particleColor}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center space-y-8 max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-4"
              >
                <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'border border-white/10 bg-black/20 text-white/90'
                    : 'bg-white/90 border border-black/10 text-slate-700 shadow-lg backdrop-blur-sm'
                }`}>
                  <Upload className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className="text-sm font-medium">Data Portal • Status: Ready for Upload</span>
                </div>
                <h2 className={`text-3xl md:text-4xl font-bold transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-300 via-purple-400 to-green-300 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent'
                }`}>
                  Initialize Data Transfer
                </h2>
                <p className={`text-lg leading-relaxed transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Access the dedicated upload chamber where your datasets undergo processing and AI-driven analysis
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6, delay: 1, type: "spring", stiffness: 100
                }}
                className="relative"
              >
                <motion.button
                  onClick={() => window.location.href = 'https://fancy-babka-8c3992.netlify.app/upload'}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: isDarkMode
                      ? "0 20px 40px rgba(59, 130, 246, 0.2)"
                      : "0 20px 40px rgba(37, 99, 235, 0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative px-8 py-4 text-lg font-semibold rounded-xl overflow-hidden transition-all duration-300 ${
                    isDarkMode
                      ? 'text-white border border-white/20 bg-blue-500/20 hover:border-blue-400/50'
                      : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-500/20 shadow-xl'
                  }`}
                  style={isDarkMode ? {
                    backdropFilter: 'blur(20px)',
                  } : {}}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-400/10 to-purple-400/10'
                      : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                  }`} />
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <Upload className="w-5 h-5" />
                    <span>Enter Upload Portal</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={isDarkMode ? 'text-emerald-300' : 'text-blue-200'}
                    >
                      →
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0],
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 60 - 30,
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.8,
                          repeat: Infinity,
                        }}
                        className={`absolute w-1 h-1 rounded-full top-1/2 left-1/2 ${
                          isDarkMode ? 'bg-emerald-300' : 'bg-blue-200'
                        }`}
                      />
                    ))}
                  </div>
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="space-y-4"
              >
                <div className="flex justify-center items-center space-x-6 text-2xl opacity-60">
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>📊</motion.span>
                  <span className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>→</span>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}>🧠</motion.span>
                  <span className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>→</span>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}>📄</motion.span>
                </div>
                <div className="text-center space-y-2">
                  <p className={`font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    Advanced Analytics • Processing • Instant Reports
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Experience next-generation data transformation in our dedicated upload environment
                  </p>
                </div>
                <div className={`flex justify-center items-center space-x-8 text-xs font-medium transition-colors duration-300 ${
                  isDarkMode ? 'opacity-70' : 'opacity-80'
                }`}>
                  <div className="text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
                    <span className={isDarkMode ? 'text-white/80' : 'text-slate-700'}>Upload</span>
                  </div>
                  <div className={`w-8 h-0.5 ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-purple-400' : 'bg-gradient-to-r from-emerald-500 to-purple-500'}`}></div>
                  <div className="text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                    <span className={isDarkMode ? 'text-white/80' : 'text-slate-700'}>Process</span>
                  </div>
                  <div className={`w-8 h-0.5 ${isDarkMode ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}></div>
                  <div className="text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    <span className={isDarkMode ? 'text-white/80' : 'text-slate-700'}>Analyze</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className={`text-3xl font-bold mb-4 transition-all duration-500 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-300 via-purple-400 to-green-300 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent'
              }`}>Analysis Dashboard</h2>
              <p className={`transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>Your data analysis results will appear here</p>
            </motion.div>
          </div>
        )}
      </div>

      <div className="transition-colors duration-500">
        <Footer />
      </div>
    </div>
  );
};

export default Index;