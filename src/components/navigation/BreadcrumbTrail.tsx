
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, CheckCircle, Circle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';

interface BreadcrumbStep {
  id: string;
  label: string;
  path?: string;
  status: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
}

interface BreadcrumbTrailProps {
  steps?: BreadcrumbStep[];
  workflow?: 'analysis' | 'story' | 'report';
}

const workflowSteps = {
  analysis: [
    { id: 'upload', label: 'Data Upload', path: '/upload', status: 'completed' as const },
    { id: 'cleaning', label: 'Data Cleaning', path: '/cleaning', status: 'completed' as const },
    { id: 'analysis', label: 'Analysis', path: '/visualize', status: 'current' as const },
    { id: 'insights', label: 'Insights', path: '/insights', status: 'pending' as const },
    { id: 'report', label: 'Report', path: '/reports', status: 'pending' as const }
  ],
  story: [
    { id: 'data', label: 'Data Review', path: '/upload', status: 'completed' as const },
    { id: 'narrative', label: 'Narrative Building', path: '/story', status: 'current' as const },
    { id: 'visuals', label: 'Visual Story', path: '/visualize', status: 'pending' as const },
    { id: 'publish', label: 'Publish', path: '/reports', status: 'pending' as const }
  ],
  report: [
    { id: 'template', label: 'Template', path: '/reports', status: 'completed' as const },
    { id: 'content', label: 'Content', path: '/reports/content', status: 'current' as const },
    { id: 'review', label: 'Review', path: '/reports/review', status: 'pending' as const },
    { id: 'export', label: 'Export', path: '/reports/export', status: 'pending' as const }
  ]
};

export default function BreadcrumbTrail({ steps, workflow = 'analysis' }: BreadcrumbTrailProps) {
  const location = useLocation();
  
  const currentSteps = steps || workflowSteps[workflow];

  const getStatusIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-quantum-green" />;
      case 'current':
        return <Circle className="w-3 h-3 text-primary animate-pulse" />;
      case 'pending':
        return <Circle className="w-3 h-3 text-muted-foreground/30" />;
    }
  };

  const getStatusColor = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'text-quantum-green';
      case 'current':
        return 'text-primary font-semibold';
      case 'pending':
        return 'text-muted-foreground/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:block"
    >
      <Card className="glass px-6 py-3 border border-border/30">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-2">
            {/* Observatory Home */}
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/" 
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="w-3 h-3" />
                <span className="hidden sm:inline">Observatory</span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <ChevronRight className="w-3 h-3" />
            </BreadcrumbSeparator>

            {/* Workflow Steps */}
            {currentSteps.map((step, index) => {
              const isLast = index === currentSteps.length - 1;
              const canNavigate = step.status === 'completed' || step.status === 'current';

              return (
                <React.Fragment key={step.id}>
                  <BreadcrumbItem>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      {getStatusIcon(step.status)}
                      
                      {canNavigate && step.path ? (
                        <BreadcrumbLink
                          href={step.path}
                          className={`${getStatusColor(step.status)} hover:text-primary transition-colors`}
                        >
                          {step.label}
                        </BreadcrumbLink>
                      ) : isLast ? (
                        <BreadcrumbPage className={getStatusColor(step.status)}>
                          {step.label}
                        </BreadcrumbPage>
                      ) : (
                        <span className={getStatusColor(step.status)}>
                          {step.label}
                        </span>
                      )}
                    </motion.div>
                  </BreadcrumbItem>

                  {!isLast && (
                    <BreadcrumbSeparator>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.05 }}
                      >
                        <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    </BreadcrumbSeparator>
                  )}

                  {/* Progress Line */}
                  {!isLast && step.status === 'completed' && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                      className="absolute top-1/2 h-0.5 bg-gradient-to-r from-quantum-green to-primary"
                      style={{
                        left: `${(index + 1) * (100 / currentSteps.length)}%`,
                        width: `${100 / currentSteps.length}%`,
                        transformOrigin: 'left center'
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Progress Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: `${(currentSteps.filter(s => s.status === 'completed').length / currentSteps.length) * 100}%` 
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-quantum-green to-primary quantum-glow"
        />
      </Card>
    </motion.div>
  );
}
