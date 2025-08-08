
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DataMetric {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  status: 'excellent' | 'good' | 'needs-attention' | 'critical';
  icon: React.ReactNode;
  description: string;
}

interface DataScorecardProps {
  dataset?: any;
  className?: string;
}

export default function DataScorecard({ dataset, className = '' }: DataScorecardProps) {
  const [metrics, setMetrics] = useState<DataMetric[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock metrics calculation - would be replaced with real analysis
  useEffect(() => {
    const calculateMetrics = () => {
      const mockMetrics: DataMetric[] = [
        {
          id: 'completeness',
          label: 'Data Completeness',
          value: 98,
          maxValue: 100,
          status: 'excellent',
          icon: <CheckCircle className="w-4 h-4" />,
          description: '98% of cells contain valid data'
        },
        {
          id: 'consistency',
          label: 'Data Consistency',
          value: 94,
          maxValue: 100,
          status: 'good',
          icon: <Shield className="w-4 h-4" />,
          description: 'Consistent formats across columns'
        },
        {
          id: 'insights',
          label: 'Insights Discovered',
          value: 15,
          maxValue: 20,
          status: 'good',
          icon: <TrendingUp className="w-4 h-4" />,
          description: '15 unique insights identified'
        },
        {
          id: 'anomalies',
          label: 'Anomalies Flagged',
          value: 1,
          maxValue: 5,
          status: 'excellent',
          icon: <AlertTriangle className="w-4 h-4" />,
          description: 'Only 1 anomaly requiring attention'
        },
        {
          id: 'quality',
          label: 'Overall Quality',
          value: 89,
          maxValue: 100,
          status: 'good',
          icon: <Target className="w-4 h-4" />,
          description: 'High quality dataset ready for analysis'
        }
      ];

      setMetrics(mockMetrics);
      
      // Calculate weighted overall score
      const totalScore = mockMetrics.reduce((sum, metric) => {
        const percentage = (metric.value / metric.maxValue) * 100;
        return sum + percentage;
      }, 0);
      
      setOverallScore(Math.round(totalScore / mockMetrics.length));
      setIsLoading(false);
    };

    // Simulate loading delay
    setTimeout(calculateMetrics, 1500);
  }, [dataset]);

  const getStatusColor = (status: DataMetric['status']) => {
    switch (status) {
      case 'excellent': return 'from-quantum-green/20 to-quantum-green/5 border-quantum-green/30 text-quantum-green';
      case 'good': return 'from-primary/20 to-primary/5 border-primary/30 text-primary';
      case 'needs-attention': return 'from-quantum-purple/20 to-quantum-purple/5 border-quantum-purple/30 text-quantum-purple';
      case 'critical': return 'from-destructive/20 to-destructive/5 border-destructive/30 text-destructive';
    }
  };

  const getStatusBadge = (status: DataMetric['status']) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-quantum-green/10 text-quantum-green border-quantum-green/30">Excellent</Badge>;
      case 'good': return <Badge className="bg-primary/10 text-primary border-primary/30">Good</Badge>;
      case 'needs-attention': return <Badge variant="secondary">Needs Review</Badge>;
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
    }
  };

  const getOverallStatusColor = () => {
    if (overallScore >= 90) return 'text-quantum-green';
    if (overallScore >= 75) return 'text-primary';
    if (overallScore >= 60) return 'text-quantum-purple';
    return 'text-destructive';
  };

  if (isLoading) {
    return (
      <Card className={`glass p-4 sm:p-6 ${className}`}>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Analyzing Dataset Quality...</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <div className="h-2.5 sm:h-3 bg-muted rounded animate-pulse" />
                  <div className="h-1.5 sm:h-2 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`glass p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Data Quality Scorecard</h3>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <div className={`text-xl sm:text-2xl font-bold ${getOverallStatusColor()}`}>
            {overallScore}%
          </div>
          <div className="text-xs text-muted-foreground">Overall Score</div>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="space-y-3 sm:space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`glass p-3 sm:p-4 rounded-lg bg-gradient-to-br ${getStatusColor(metric.status)} border`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="p-1.5 sm:p-2 rounded bg-current/10 flex-shrink-0">
                  {metric.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm truncate">{metric.label}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{metric.description}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(metric.status)}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">
                  {metric.value}
                  {metric.id === 'completeness' || metric.id === 'consistency' || metric.id === 'quality' ? '%' : ''}
                  {metric.maxValue !== 100 && ` / ${metric.maxValue}`}
                </span>
                <span className="text-muted-foreground">
                  {Math.round((metric.value / metric.maxValue) * 100)}%
                </span>
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
              >
                <Progress 
                  value={(metric.value / metric.maxValue) * 100} 
                  className="h-1.5 sm:h-2"
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/30"
      >
        <div className="text-center space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your dataset is <span className={`font-semibold ${getOverallStatusColor()}`}>
              {overallScore >= 90 ? 'excellent' : 
               overallScore >= 75 ? 'good' : 
               overallScore >= 60 ? 'fair' : 'needs improvement'}
            </span> and ready for advanced analysis.
          </p>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs flex-wrap gap-y-1">
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-quantum-green" />
              <span>{metrics.filter(m => m.status === 'excellent').length} Excellent</span>
            </span>
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span>{metrics.filter(m => m.status === 'good').length} Good</span>
            </span>
            {metrics.filter(m => m.status === 'needs-attention' || m.status === 'critical').length > 0 && (
              <span className="flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-quantum-purple" />
                <span>{metrics.filter(m => m.status === 'needs-attention' || m.status === 'critical').length} Need Review</span>
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
