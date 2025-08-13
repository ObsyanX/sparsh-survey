import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Brain, Command, FileText } from "lucide-react";
import Spline from '@splinetool/react-spline';
import ProcessingTimeline from "@/components/ProcessingTimeline";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/ui/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { useAutoAnimate } from '@formkit/auto-animate/react';

// Enhanced background and navigation
import AmbientSoundSystem from "@/components/audio/AmbientSoundSystem";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [activeMode, setActiveMode] = useState<'analysis' | 'story' | '3d' | 'presentation' | 'simulation'>('analysis');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [analysisGridRef] = useAutoAnimate({ duration: 180 });
  
  // Add state for DataUpload integration
  const [uploadedData, setUploadedData] = useState<{ id: string; filename: string; preview: any[] } | null>(null);

  // Add state for background optimization
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  if (isUploading) {
    return <LoadingScreen message="Uploading dataset to quantum processors..." />;
  }

  if (isProcessing) {
    return <ProcessingTimeline />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Theme Toggle */}
      <ThemeToggle />
      {/* Ambient Sound System */}
      <AmbientSoundSystem isActive={isAnalysisReady} />
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
                <span className="text-sm font-medium">Data Observatory • Status: Orbital</span>
              </div>

              <div className="relative min-h-screen flex justify-center mb-16 overflow-hidden">
                {/* Conditional Background - Spline for md/lg screens, Gradient for mobile */}
                {!isMobile ? (
                  // Optimized Spline for md/lg screens
                  <div className="absolute inset-0 w-full h-full z-[-1]">
                    {!splineError && (
                      <Spline 
                        ref={splineRef}
                        scene="https://prod.spline.design/Lws6iY4vBNT0NXoF/scene.splinecode"
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          pointerEvents: 'none', // Disable interactions for performance
                          willChange: 'transform', // Optimize for animations
                          backfaceVisibility: 'hidden', // Optimize 3D rendering
                        }}
                        onLoad={() => {
                          console.log('Spline loaded successfully');
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
                    
                    {/* Fallback gradient for failed Spline loads */}
                    {splineError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-quantum-purple/10 to-quantum-green/15"
                        style={{
                          background: `
                            radial-gradient(circle at 20% 80%, rgba(120, 53, 255, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(0, 255, 135, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                            linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)
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
                          <p className="text-sm text-muted-foreground">Loading 3D environment...</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  // Optimized gradient background for mobile
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full z-[-1]"
                    style={{
                      background: `
                        radial-gradient(circle at 25% 75%, rgba(120, 53, 255, 0.3) 0%, transparent 60%),
                        radial-gradient(circle at 75% 25%, rgba(0, 255, 135, 0.2) 0%, transparent 60%),
                        radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
                        linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)
                      `,
                    }}
                  >
                    {/* Animated particles for mobile */}
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
                          className="absolute w-1 h-1 bg-primary/60 rounded-full"
                          style={{
                            boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(59, 130, 246, 0.3)`,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Enhanced overlay - different for mobile vs desktop */}
                <div className={`absolute inset-0 ${
                  isMobile 
                    ? 'bg-gradient-to-b from-black/20 via-transparent to-black/40' 
                    : 'bg-gradient-to-b from-black/30 via-black/5 to-black/20'
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
                    {/* Holographic scan lines effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-quantum-purple/5 to-transparent animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-quantum-purple/20 to-quantum-purple/5 flex items-center justify-center"
                      >
                        <Brain className="w-6 h-6 text-quantum-purple" />
                      </motion.div>
                      <h3 className="font-semibold">AI Analysis</h3>
                      <p className="text-xs text-muted-foreground">Multi-agent intelligence processing</p>
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
                          className="absolute w-1 h-1 bg-quantum-purple rounded-full"
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
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent via-quantum-green/5 to-transparent animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-quantum-green/20 to-quantum-green/5 flex items-center justify-center"
                      >
                        <BarChart3 className="w-6 h-6 text-quantum-green" />
                      </motion.div>
                      <h3 className="font-semibold">3D Visualization</h3>
                      <p className="text-xs text-muted-foreground">Immersive and interactive data exploration
                      </p>
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
                          className="absolute w-1 h-1 bg-quantum-green rounded-full"
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

            {/* Interactive Upload Portal Section - Matching Site Theme */}
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
                  <Upload className="w-5 h-5 text-quantum-green" />
                  <span className="text-sm font-medium">Data Portal • Status: Ready for Upload</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                  Initialize Data Transfer
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Access the dedicated upload chamber where your datasets undergo 
                  processing and AI-driven analysis
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
                  onClick={() => window.location.href = 'https://fancy-babka-8c3992.netlify.app/upload'}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-quantum-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <Upload className="w-5 h-5" />
                    <span>Enter Upload Portal</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-quantum-green"
                    >
                      →
                    </motion.div>
                  </span>

                  {/* Subtle particle effect */}
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
                        className="absolute w-1 h-1 bg-quantum-green rounded-full top-1/2 left-1/2"
                      />
                    ))}
                  </div>
                </motion.button>
              </motion.div> 

              {/* Elegant Text Below Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="space-y-4"
              >
                <div className="flex justify-center items-center space-x-6 text-2xl opacity-60">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    📊
                  </motion.span>
                  <span className="text-quantum-green text-sm">→</span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  >
                    🧠
                  </motion.span>
                  <span className="text-quantum-purple text-sm">→</span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                  >
                    📄
                  </motion.span>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-quantum-green font-medium">
                    Advanced Analytics • Processing • Instant Reports
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Experience next-generation data transformation in our dedicated upload environment
                  </p>
                </div>

                {/* Process flow indicators */}
                <div className="flex justify-center items-center space-x-8 text-xs font-medium opacity-70">
                  <div className="text-center">
                    <div className="w-2 h-2 bg-quantum-green rounded-full mx-auto mb-1"></div>
                    <span>Upload</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-quantum-green to-quantum-purple"></div>
                  <div className="text-center">
                    <div className="w-2 h-2 bg-quantum-purple rounded-full mx-auto mb-1"></div>
                    <span>Process</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-quantum-purple to-primary"></div>
                  <div className="text-center">
                    <div className="w-2 h-2 bg-primary rounded-full mx-auto mb-1"></div>
                    <span>Analyze</span>
                  </div>
                </div>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;