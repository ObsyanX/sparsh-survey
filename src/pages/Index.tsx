
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Brain, Settings, Headphones, Command } from "lucide-react";

import FileUpload from "@/components/FileUpload";
import ProcessingTimeline from "@/components/ProcessingTimeline";
import LoadingScreen from "@/components/LoadingScreen";
import InsightBoard from "@/components/InsightBoard";
import DataScorecard from "@/components/DataScorecard";
import ChatBot from "@/components/ChatBot";
import AutoInsightEngine from "@/components/AutoInsightEngine";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import DataStoryMode from "@/components/DataStoryMode";
import Globe3D from "@/components/Globe3D";
import PresentationMode from "@/components/PresentationMode";
import ScenarioSimulator from "@/components/ScenarioSimulator";

// New AI-powered components
import AIAgentSystem from "@/components/ai/AIAgentSystem";
import Asset3DManager from "@/components/3d/Asset3DManager";
import ChartEngine from "@/components/charts/ChartEngine";

// Enhanced background and navigation
import ObservatoryBackground from "@/components/backgrounds/ObservatoryBackground";
import CommandBridge from "@/components/navigation/CommandBridge";
import AmbientSoundSystem from "@/components/audio/AmbientSoundSystem";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import KPICard from "@/components/KPICard";

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  value: number;
  priority: number;
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

  // Mock data state
  const [insights] = useState<Insight[]>([
    { 
      id: '1', 
      type: 'correlation', 
      title: 'Strong Education-Employment Link', 
      description: 'High correlation detected between education level and employment status',
      value: 0.78,
      priority: 1,
      isPinned: false,
      timestamp: new Date()
    },
    { 
      id: '2', 
      type: 'outlier', 
      title: 'Income Anomalies Found', 
      description: '12 data points exceed 3 standard deviations from mean',
      value: 12,
      priority: 2,
      isPinned: false,
      timestamp: new Date()
    },
    { 
      id: '3', 
      type: 'trend', 
      title: 'Regional Disparity Trend', 
      description: 'Consistent income gaps observed across urban-rural divide',
      value: 3.2,
      priority: 3,
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
        setShowAIPanel(true); // Activate AI agents after processing
      }, 3000);
    }, 1500);
  };

  const handleVisualize = (data: any) => {
    console.log('Visualizing:', data);
    // Implementation for visualization requests from AI agents
  };

  const handleExport = (data: any) => {
    console.log('Exporting:', data);
    // Implementation for export requests from AI agents
  };

  if (isUploading) {
    return <LoadingScreen message="Uploading dataset to quantum processors..." />;
  }

  if (isProcessing) {
    return <ProcessingTimeline />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced 3D Background */}
      <ObservatoryBackground />
      
      {/* Ambient Sound System */}
      <AmbientSoundSystem isActive={isAnalysisReady} />

      {/* Command Bridge Navigation */}
      <CommandBridge 
        activeModule={activeMode}
        onModuleSelect={setActiveMode}
        availableModules={['analysis', '3d', 'story', 'presentation', 'simulation']}
      />

      {/* AI Agent System */}
      <AIAgentSystem 
        dataset={uploadedFile ? [uploadedFile] : undefined}
        onVisualize={handleVisualize}
        onExport={handleExport}
        isVisible={showAIPanel}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isAnalysisReady ? (
          // Welcome State - Data Navigator Introduction
          <div className="space-y-12">
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
              
              <h1 className="text-5xl font-bold gradient-text">
                Welcome, Data Navigator
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                You are aboard the Quantum Survey Observatory, a cutting-edge AI-operated platform orbiting above a smart planet. 
                Your mission: explore, refine, and interpret knowledge from massive volumes of survey signals flowing through 
                crystalline data pipelines.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Data Intake</h3>
                  <p className="text-xs text-muted-foreground">Beam aboard your survey datasets</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="glass p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-quantum-purple/20 to-quantum-purple/5 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-quantum-purple" />
                  </div>
                  <h3 className="font-semibold">AI Analysis</h3>
                  <p className="text-xs text-muted-foreground">Multi-agent intelligence processing</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-quantum-green/20 to-quantum-green/5 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-quantum-green" />
                  </div>
                  <h3 className="font-semibold">3D Visualization</h3>
                  <p className="text-xs text-muted-foreground">Immersive data exploration</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">Ambient Mode</h3>
                  <p className="text-xs text-muted-foreground">Living data artwork experience</p>
                </motion.div>
              </div>
            </motion.div>

            {/* File Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FileUpload onFileUpload={handleFileUpload} />
            </motion.div>
          </div>
        ) : (
          // Analysis Interface
          <div className="space-y-8">
            {/* Mode-Specific Content */}
            {activeMode === 'analysis' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <InsightBoard insights={insights} />
                    <ChartEngine dataset={[]} />
                  </div>
                  
                  <div className="space-y-8">
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
                  <Globe3D data={[]} />
                  <Asset3DManager assets={[]} />
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

      {/* Floating Chatbot */}
      <ChatBot />
      
      {/* AI Panel Toggle */}
      {isAnalysisReady && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-24 right-24 z-40"
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
