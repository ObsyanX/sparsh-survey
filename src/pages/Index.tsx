import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, TrendingUp, Zap, BarChart3, Users, FileText } from 'lucide-react';
import StarField from '@/components/StarField';
import KPICard from '@/components/KPICard';
import FileUpload from '@/components/FileUpload';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('File uploaded:', file.name);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Star Field Background */}
      <StarField />
      
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
              {/* Main Title */}
              <div className="space-y-4">
                <motion.h1
                  className="text-6xl md:text-8xl font-bold gradient-text leading-tight"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  QUANTUM
                  <br />
                  SURVEY
                </motion.h1>
                
                <motion.p
                  className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Next-generation data analysis platform with AI-powered insights and immersive visualizations
                </motion.p>
              </div>

              {/* Floating UI Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <KPICard
                  title="Rows Cleaned"
                  value={15847}
                  icon={<Database className="w-6 h-6" />}
                  color="cyan"
                  delay={0.2}
                />
                <KPICard
                  title="Outliers Detected"
                  value={342}
                  icon={<Shield className="w-6 h-6" />}
                  color="purple"
                  delay={0.4}
                />
                <KPICard
                  title="Accuracy Score"
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

        {/* Upload Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Upload Your <span className="gradient-text">Dataset</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Drop your CSV or Excel files and watch as our AI analyzes, cleans, and transforms your data in real-time
              </p>
            </motion.div>

            <FileUpload onFileUpload={handleFileUpload} />

            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="glass p-6 rounded-lg max-w-md mx-auto">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">File Ready for Analysis</h3>
                  <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Powerful <span className="gradient-text">Features</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced analytics tools designed for the future of data science
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Real-time Processing",
                  description: "Lightning-fast data processing with instant visual feedback and live updates",
                  color: "cyan"
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "3D Visualizations",
                  description: "Immersive charts and graphs that bring your data to life with interactive 3D elements",
                  color: "purple"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "AI Assistant",
                  description: "Conversational AI that understands your data and provides intelligent insights",
                  color: "green"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <div className={`
                    glass p-8 rounded-lg quantum-glow-hover transition-all duration-300 h-full
                    ${feature.color === 'cyan' ? 'hover:border-primary/50' : ''}
                    ${feature.color === 'purple' ? 'hover:border-quantum-purple/50' : ''}
                    ${feature.color === 'green' ? 'hover:border-quantum-green/50' : ''}
                  `}>
                    <div className={`
                      p-4 rounded-lg mb-6 w-fit
                      ${feature.color === 'cyan' ? 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary' : ''}
                      ${feature.color === 'purple' ? 'bg-gradient-to-br from-quantum-purple/20 to-quantum-purple/5 text-quantum-purple' : ''}
                      ${feature.color === 'green' ? 'bg-gradient-to-br from-quantum-green/20 to-quantum-green/5 text-quantum-green' : ''}
                    `}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/30">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold gradient-text mb-4">QUANTUM SURVEY</h3>
              <p className="text-muted-foreground">
                The future of data analysis is here. Experience the power of quantum-enhanced insights.
              </p>
            </motion.div>
          </div>
        </footer>
      </div>

      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Index;