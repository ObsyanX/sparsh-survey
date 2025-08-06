import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, Sparkles, Weight, FileText, Download, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
  duration?: number;
}

interface ProcessingTimelineProps {
  currentStep?: number;
  onStepComplete?: (step: number) => void;
}

export default function ProcessingTimeline({ currentStep = 0, onStepComplete }: ProcessingTimelineProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: TimelineStep[] = [
    {
      id: 'upload',
      title: 'Upload',
      description: 'Dataset received and validated',
      icon: <Upload className="w-5 h-5" />,
      status: 'pending',
      duration: 1000
    },
    {
      id: 'schema',
      title: 'Schema Mapping',
      description: 'Data types and structure analyzed',
      icon: <MapPin className="w-5 h-5" />,
      status: 'pending',
      duration: 2000
    },
    {
      id: 'cleaning',
      title: 'Cleaning',
      description: 'Missing values and outliers processed',
      icon: <Sparkles className="w-5 h-5" />,
      status: 'pending',
      duration: 3000
    },
    {
      id: 'weighting',
      title: 'Weighting',
      description: 'Statistical weights applied',
      icon: <Weight className="w-5 h-5" />,
      status: 'pending',
      duration: 1500
    },
    {
      id: 'report',
      title: 'Report Generation',
      description: 'Insights and visualizations created',
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
      duration: 2500
    },
    {
      id: 'download',
      title: 'Download',
      description: 'Ready for export and sharing',
      icon: <Download className="w-5 h-5" />,
      status: 'pending',
      duration: 500
    }
  ];

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const triggerStepSequence = () => {
    let stepIndex = 0;
    const processStep = () => {
      if (stepIndex < steps.length) {
        setActiveStep(stepIndex);
        
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, stepIndex]);
          onStepComplete?.(stepIndex);
          stepIndex++;
          if (stepIndex < steps.length) {
            setTimeout(processStep, 500);
          }
        }, steps[stepIndex].duration);
      }
    };
    processStep();
  };

  const getStepStatus = (index: number): TimelineStep['status'] => {
    if (completedSteps.includes(index)) return 'completed';
    if (index === activeStep) return 'active';
    return 'pending';
  };

  return (
    <Card className="glass p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold gradient-text mb-2">Data Processing Pipeline</h3>
          <p className="text-muted-foreground">Real-time workflow visualization</p>
        </div>
        <motion.button
          onClick={triggerStepSequence}
          className="px-4 py-2 bg-gradient-to-r from-primary to-quantum-purple rounded-lg text-sm font-medium quantum-glow-hover"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Processing
        </motion.button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-12 left-6 right-6 h-0.5 bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-quantum-purple"
            initial={{ width: 0 }}
            animate={{ 
              width: completedSteps.length > 0 
                ? `${(completedSteps.length / steps.length) * 100}%` 
                : activeStep > 0 
                  ? `${(activeStep / steps.length) * 100}%`
                  : '0%'
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            
            return (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Icon Container */}
                <motion.div
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 z-10
                    ${status === 'completed' 
                      ? 'bg-quantum-green border-quantum-green quantum-glow' 
                      : status === 'active'
                        ? 'bg-gradient-to-br from-primary to-quantum-purple border-primary quantum-glow animate-glow-pulse'
                        : 'bg-quantum-surface border-border'
                    }
                  `}
                  animate={status === 'active' ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 360]
                  } : {}}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity },
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                  }}
                >
                  <AnimatePresence mode="wait">
                    {status === 'completed' ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                      >
                        <CheckCircle className="w-5 h-5 text-quantum-surface" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={
                          status === 'active' ? 'text-primary-foreground' : 'text-muted-foreground'
                        }
                      >
                        {step.icon}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Particles for active step */}
                  {status === 'active' && (
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          animate={{
                            x: [0, Math.cos(i * 45 * Math.PI / 180) * 30],
                            y: [0, Math.sin(i * 45 * Math.PI / 180) * 30],
                            opacity: [1, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Step Info */}
                <div className="space-y-1">
                  <h4 className={`
                    text-sm font-semibold
                    ${status === 'completed' 
                      ? 'text-quantum-green' 
                      : status === 'active'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }
                  `}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-24">
                    {step.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <motion.div
                  className={`
                    mt-2 w-2 h-2 rounded-full
                    ${status === 'completed' 
                      ? 'bg-quantum-green' 
                      : status === 'active'
                        ? 'bg-primary animate-pulse'
                        : 'bg-border'
                    }
                  `}
                  animate={status === 'active' ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {completedSteps.length} of {steps.length} steps completed
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-quantum-green"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm font-medium">
            {Math.round((completedSteps.length / steps.length) * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
}