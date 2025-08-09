
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Upload, 
  BarChart3, 
  Brain, 
  Zap,
  ArrowRight,
  Activity,
  Database,
  Sparkles
} from 'lucide-react';
import LazyGlobe3D from '@/components/3d/LazyGlobe3D';
import LazyChartEngine from '@/components/charts/LazyChartEngine';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

const Index = () => {
  usePerformanceMonitor();

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Smart Data Intake",
      description: "Seamlessly import and validate datasets with AI-powered quality checks",
      color: "from-quantum-green/20 to-quantum-green/5",
      delay: 0.1
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quantum Cleaning",
      description: "Advanced algorithms detect and resolve data inconsistencies automatically",
      color: "from-quantum-purple/20 to-quantum-purple/5",
      delay: 0.2
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Visual Intelligence",
      description: "Generate insightful charts and visualizations with zero configuration",
      color: "from-primary/20 to-primary/5",
      delay: 0.3
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Insights Engine",
      description: "Discover hidden patterns and generate actionable business intelligence",
      color: "from-secondary/20 to-secondary/5",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Badge variant="outline" className="mb-4 quantum-glow">
              <Sparkles className="w-3 h-3 mr-1" />
              Observatory v2.0 Active
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
              Data Science
              <br />
              Observatory
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform raw data into actionable insights with our AI-powered analytics platform.
              Experience the future of data science in a holographic interface.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button size="lg" className="quantum-glow-hover">
              <Activity className="w-5 h-5 mr-2" />
              Begin Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              <Database className="w-5 h-5 mr-2" />
              View Demo Data
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3D Globe Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Global Data Visualization
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore data patterns across the globe with our interactive 3D visualization engine
            </p>
          </motion.div>

          <LazyGlobe3D className="h-96" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Observatory Capabilities
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the power of our integrated data science platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
              >
                <Card className={`glass p-6 h-full quantum-glow-hover bg-gradient-to-br ${feature.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="quantum-glow rounded-lg p-3">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Engine Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Intelligent Chart Generation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI automatically selects the best visualization type for your data
            </p>
          </motion.div>

          <LazyChartEngine className="w-full" />
        </div>
      </section>
    </div>
  );
};

export default Index;
