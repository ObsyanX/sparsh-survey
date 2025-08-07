
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, TrendingUp } from 'lucide-react';
import ObservatoryBackground from '@/components/backgrounds/ObservatoryBackground';
import CommandBridge from '@/components/navigation/CommandBridge';
import AmbientSoundSystem from '@/components/audio/AmbientSoundSystem';
import KPICard from '@/components/KPICard';
import FileUpload from '@/components/FileUpload';
import ChatBot from '@/components/ChatBot';
import ProcessingTimeline from '@/components/ProcessingTimeline';
import InsightBoard from '@/components/InsightBoard';
import DataStoryMode from '@/components/DataStoryMode';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import Globe3D from '@/components/Globe3D';
import AutoInsightEngine from '@/components/AutoInsightEngine';
import DataScorecard from '@/components/DataScorecard';
import KnowledgeGraph from '@/components/KnowledgeGraph';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState<'upload' | 'timeline' | 'insights' | 'story' | 'simulator' | '3d' | 'intelligence'>('upload');
  const [autoInsightActive, setAutoInsightActive] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setActiveSection('timeline');
    setAutoInsightActive(true);
    console.log('File uploaded:', file.name);
    
    // Play success sound if available
    if ((window as any).playInteractionSound) {
      (window as any).playInteractionSound('success');
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveSection(moduleId as any);
    
    // Play click sound if available
    if ((window as any).playInteractionSound) {
      (window as any).playInteractionSound('click');
    }
  };

  const availableModules = uploadedFile 
    ? ['upload', 'timeline', 'insights', 'intelligence', 'story', 'simulator', '3d']
    : ['upload'];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Background */}
      <ObservatoryBackground />
      
      {/* Ambient Sound System */}
      <AmbientSoundSystem activeModule={activeSection} isActive={true} />
      
      {/* Auto-Insight Engine (Fixed Position) */}
      {uploadedFile && (
        <AutoInsightEngine 
          dataset={uploadedFile}
          isActive={autoInsightActive}
          onInsightAccepted={(insight) => {
            console.log('Insight accepted:', insight);
            if ((window as any).playInteractionSound) {
              (window as any).playInteractionSound('success');
            }
          }}
          onInsightDismissed={(insight) => {
            console.log('Insight dismissed:', insight);
            if ((window as any).playInteractionSound) {
              (window as any).playInteractionSound('hover');
            }
          }}
        />
      )}
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Observatory Title */}
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.8, rotateY: -180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ duration: 1.2, type: "spring" }}
                  className="relative"
                >
                  <h1 className="text-6xl md:text-8xl font-bold gradient-text leading-tight">
                    DATA
                    <br />
                    OBSERVATORY
                  </h1>
                  
                  {/* Holographic scan lines */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
                </motion.div>
                
                <motion.p
                  className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Navigate through crystalline data pipelines in your personal orbital command station. 
                  Transform raw information into living knowledge with AI-powered precision.
                </motion.p>
              </div>

              {/* Mission Status Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <KPICard
                  title="Data Streams Processed"
                  value={15847}
                  icon={<Database className="w-6 h-6" />}
                  color="cyan"
                  delay={0.2}
                />
                <KPICard
                  title="Anomalies Detected"
                  value={342}
                  icon={<Shield className="w-6 h-6" />}
                  color="purple"
                  delay={0.4}
                />
                <KPICard
                  title="Observatory Efficiency"
                  value={98}
                  suffix="%"
                  icon={<TrendingUp className="w-6 h-6" />}
                  color="green"
                  delay={0.6}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Command Bridge Navigation */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <CommandBridge
              activeModule={activeSection}
              onModuleSelect={handleModuleSelect}
              availableModules={availableModules}
            />

            {/* Holographic Content Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <div className="relative min-h-[600px]">
                {/* Content with holographic frame */}
                <div className="relative glass p-8 rounded-lg border-2 border-border/30 quantum-glow-hover">
                  {/* Holographic corner decorations */}
                  {[0, 1, 2, 3].map((corner) => (
                    <div
                      key={corner}
                      className={`absolute w-6 h-6 border-2 border-primary/50 ${
                        corner === 0 ? 'top-2 left-2 border-r-0 border-b-0' :
                        corner === 1 ? 'top-2 right-2 border-l-0 border-b-0' :
                        corner === 2 ? 'bottom-2 left-2 border-r-0 border-t-0' :
                        'bottom-2 right-2 border-l-0 border-t-0'
                      }`}
                    />
                  ))}

                  {/* Dynamic Content */}
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                  >
                    {activeSection === 'upload' && <FileUpload onFileUpload={handleFileUpload} />}
                    {activeSection === 'timeline' && <ProcessingTimeline />}
                    {activeSection === 'insights' && <InsightBoard />}
                    {activeSection === 'intelligence' && (
                      <div className="space-y-8">
                        <DataScorecard dataset={uploadedFile} />
                        <KnowledgeGraph />
                      </div>
                    )}
                    {activeSection === 'story' && <DataStoryMode />}
                    {activeSection === 'simulator' && <ScenarioSimulator />}
                    {activeSection === '3d' && <Globe3D />}
                  </motion.div>
                </div>

                {/* Ambient particles around content */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/30 rounded-full"
                    animate={{
                      x: [0, Math.random() * 400 - 200],
                      y: [0, Math.random() * 400 - 200],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 4,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Observatory Footer */}
        <footer className="py-12 px-6 border-t border-border/30">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold gradient-text mb-4">
                ORBITAL DATA OBSERVATORY
              </h3>
              <p className="text-muted-foreground">
                Mission Status: OPERATIONAL • Next-Generation Survey Intelligence Platform
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-quantum-green rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">AI CORE ACTIVE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">QUANTUM PROCESSORS ONLINE</span>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>

      {/* Floating Communication Bay (Chat Bot) */}
      <ChatBot />
    </div>
  );
};

export default Index;
