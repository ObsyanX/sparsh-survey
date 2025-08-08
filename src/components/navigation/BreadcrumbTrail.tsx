import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, CheckCircle, Circle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
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
  analysis: [{
    id: 'upload',
    label: 'Data Upload',
    path: '/upload',
    status: 'completed' as const
  }, {
    id: 'cleaning',
    label: 'Data Cleaning',
    path: '/cleaning',
    status: 'completed' as const
  }, {
    id: 'analysis',
    label: 'Analysis',
    path: '/visualize',
    status: 'current' as const
  }, {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    status: 'pending' as const
  }, {
    id: 'report',
    label: 'Report',
    path: '/reports',
    status: 'pending' as const
  }],
  story: [{
    id: 'data',
    label: 'Data Review',
    path: '/upload',
    status: 'completed' as const
  }, {
    id: 'narrative',
    label: 'Narrative Building',
    path: '/story',
    status: 'current' as const
  }, {
    id: 'visuals',
    label: 'Visual Story',
    path: '/visualize',
    status: 'pending' as const
  }, {
    id: 'publish',
    label: 'Publish',
    path: '/reports',
    status: 'pending' as const
  }],
  report: [{
    id: 'template',
    label: 'Template',
    path: '/reports',
    status: 'completed' as const
  }, {
    id: 'content',
    label: 'Content',
    path: '/reports/content',
    status: 'current' as const
  }, {
    id: 'review',
    label: 'Review',
    path: '/reports/review',
    status: 'pending' as const
  }, {
    id: 'export',
    label: 'Export',
    path: '/reports/export',
    status: 'pending' as const
  }]
};
export default function BreadcrumbTrail({
  steps,
  workflow = 'analysis'
}: BreadcrumbTrailProps) {
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
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:block">
      
    </motion.div>;
}