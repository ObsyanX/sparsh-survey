import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Brain, Settings, Command, FileText } from "lucide-react";
import Spline from '@splinetool/react-spline';
import FileUpload from "@/components/FileUpload";
import ProcessingTimeline from "@/components/ProcessingTimeline";
import LoadingScreen from "@/components/LoadingScreen";
import InsightBoard from "@/components/InsightBoard";
import DataScorecard from "@/components/DataScorecard";
import ChatBot from "@/components/ChatBot";
import AutoInsightEngine from "@/components/AutoInsightEngine";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import DataStoryMode from "@/components/DataStoryMode";
import PresentationMode from "@/components/PresentationMode";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import Footer from "@/components/ui/Footer";

// Lazy loaded components
import LazyGlobe3D from "@/components/3d/LazyGlobe3D";
import LazyAsset3DManager from "@/components/3d/LazyAsset3DManager";
import LazyChartEngine from "@/components/charts/LazyChartEngine";

// Enhanced background and navigation
import AmbientSoundSystem from "@/components/audio/AmbientSoundSystem";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import KPICard from "@/components/KPICard";

interface Insight {
  id: string;
  type: 'correlation' | 'trend' | 'anomaly' | 'statistic';
  title: string;
  description: string;
  value: string | number;
  priority: 'high' | 'medium' | 'low';
  isPinned: boolean;
  timestamp: Date;
}

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [activeMode, setActiveMode] = useState<'analysis' | 'story' | '3d' | 'presentation' | 'simulation'>('analysis');
  const [showAIPanel, setShowAIPanel] = useState(false);
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
  // Mock data state
  const [insights] = useState<Insight[]>([
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

  const handleFileUpload = (file: File) => {
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
                {/* Spline Background with loading optimization */}
                <div className="absolute inset-0 w-full h-full z-[-1]">
                  <Spline 
                    scene="https://prod.spline.design/Lws6iY4vBNT0NXoF/scene.splinecode"
                    style={{ width: '100%', height: '100%',  }}
                  />
                </div>
                
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Text Content in Foreground */}
                <div className="relative z-10 text-center max-w-4xl px-6 pt-8 md:pt-12">
                  <h1 className="text-5xl md:text-6xl font-bold gradient-text pb-1 leading-relaxed">
                    Welcome, Data Navigator
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground mt-6 leading-relaxed">
                    Step into the Survey Deck — where your <span className="text-primary">.csv</span> file becomes a gateway to clarity. Watch AI transform raw survey data into immersive, beautifully crafted PDF insights. 
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
  
                {/* <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass p-6 text-center space-y-3"
                >
                  {/* <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">Ambient Mode</h3>
                  <p className="text-xs text-muted-foreground">Living data artwork experience</p> }
                </motion.div> */}
                
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FileUpload onFileUpload={handleFileUpload} />
            </motion.div>
          </div>
        ) : (
          // Analysis Interface with lazy loading
          <div className="space-y-8">
            {/* Mode-Specific Content */}
            {activeMode === 'analysis' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  <KPICard
                    title="Total Records"
                    value={15847}
                    icon={<BarChart3 className="w-5 h-5" />}
                    color="cyan"
                    delay={0.1}
                  />
                  <KPICard
                    title="Data Quality"
                    value={98}
                    suffix="%"
                    icon={<Brain className="w-5 h-5" />}
                    color="green"
                    delay={0.2}
                  />
                  <KPICard
                    title="Insights Found"
                    value={23}
                    icon={<Settings className="w-5 h-5" />}
                    color="purple"
                    delay={0.3}
                  />
                </div>

                {/* Main Analysis Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                    <InsightBoard insights={insights} />
                    <LazyChartEngine dataset={[]} />
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <DataScorecard />
                    <KnowledgeGraph insights={insights} />
                  </div>
                </div>

                {/* Auto-Insight Engine */}
                <AutoInsightEngine 
                  dataset={uploadedFile ? [uploadedFile] : undefined}
                  isActive={true}
                />
              </motion.div>
            )}

            {activeMode === '3d' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LazyGlobe3D className="w-full" />
                  <LazyAsset3DManager className="w-full" />
                </div>
              </motion.div>
            )}

            {activeMode === 'story' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <DataStoryMode dataset={uploadedFile} />
              </motion.div>
            )}

            {activeMode === 'presentation' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PresentationMode />
              </motion.div>
            )}

            {activeMode === 'simulation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ScenarioSimulator />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot */}
      <ChatBot />
      
      {/* AI Panel Toggle */}
      {isAnalysisReady && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-20 right-4 md:bottom-24 md:right-24 z-40"
        >
          <Button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`w-12 h-12 rounded-full ${
              showAIPanel 
                ? 'bg-gradient-to-br from-destructive to-destructive/80' 
                : 'bg-gradient-to-br from-quantum-purple to-quantum-purple/80'
            } quantum-glow-hover`}
            variant="default"
          >
            <Brain className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
