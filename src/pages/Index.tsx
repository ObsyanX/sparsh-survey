import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, TrendingUp, Users, GraduationCap, DollarSign, Shield, Zap, Rocket } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import StarField from '@/components/StarField';
import SimpleBackground from '@/components/backgrounds/SimpleBackground';

// Lazy load heavy components
const LazyGlobe3D = lazy(() => import('@/components/3d/LazyGlobe3D'));
const LazyAsset3DManager = lazy(() => import('@/components/3d/LazyAsset3DManager'));
const LazyChartEngine = lazy(() => import('@/components/charts/LazyChartEngine'));

// Mock data for demonstration
const mockKPIData = [
  { id: 'income', label: 'Average Income', value: '$52,000', change: '+8.5%', trend: 'up', icon: DollarSign },
  { id: 'employment', label: 'Employment Rate', value: '94.2%', change: '+2.1%', trend: 'up', icon: Users },
  { id: 'education', label: 'Education Index', value: '0.87', change: '+0.03', trend: 'up', icon: GraduationCap },
  { id: 'security', label: 'Safety Score', value: '8.9/10', change: '+0.2', trend: 'up', icon: Shield }
];

const mockAssets = [
  {
    id: 'kpi-income',
    name: 'Income Indicator',
    type: 'placeholder' as const,
    status: 'loaded' as const,
    position: [-2, 0, 0] as [number, number, number],
    scale: [0.5, 0.5, 0.5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number]
  },
  {
    id: 'kpi-employment',
    name: 'Employment Tower', 
    type: 'placeholder' as const,
    status: 'loaded' as const,
    position: [0, 0, 0] as [number, number, number],
    scale: [0.5, 1, 0.5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number]
  },
  {
    id: 'kpi-education',
    name: 'Education Sphere',
    type: 'placeholder' as const,
    status: 'loaded' as const,
    position: [2, 0, 0] as [number, number, number],
    scale: [0.7, 0.7, 0.7] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number]
  }
];

function KPICard({ kpi, index }: { kpi: typeof mockKPIData[0]; index: number }) {
  const IconComponent = kpi.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="glass p-6 hover:bg-white/5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'}>
            {kpi.change}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{kpi.value}</h3>
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function ComponentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-64 bg-background/50 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-background/50 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <SimpleBackground />
      <StarField />
      
      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <Rocket className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium text-primary">Observatory AI</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Intelligent Data Observatory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience the future of data visualization with our quantum-powered analytics platform.
            Real-time insights, 3D visualizations, and AI-driven predictions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              <Zap className="w-5 h-5 mr-2" />
              Explore Data
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Globe className="w-5 h-5 mr-2" />
              View Globe
            </Button>
          </div>
        </motion.div>

        {/* KPI Dashboard */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Live KPI Dashboard</h2>
            <p className="text-muted-foreground">Real-time metrics from our data observatory</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockKPIData.map((kpi, index) => (
              <KPICard key={kpi.id} kpi={kpi} index={index} />
            ))}
          </div>
        </section>

        {/* 3D Visualization Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">3D Data Visualization</h2>
            <p className="text-muted-foreground">Interactive 3D models powered by quantum computing</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Globe Visualization */}
            <Suspense fallback={<ComponentSkeleton />}>
              <LazyGlobe3D />
            </Suspense>

            {/* Asset Manager */}
            <Suspense fallback={<ComponentSkeleton />}>
              <LazyAsset3DManager assets={mockAssets} />
            </Suspense>
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Advanced Analytics</h2>
            <p className="text-muted-foreground">AI-powered insights and predictive modeling</p>
          </motion.div>

          <Suspense fallback={<ComponentSkeleton />}>
            <LazyChartEngine />
          </Suspense>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <Card className="glass p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of organizations already using Observatory AI to unlock 
              the full potential of their data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <TrendingUp className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Schedule Demo
              </Button>
            </div>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}