
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, BarChart3, Type, BookOpen, Settings, Eye, Download, ArrowRight, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  specialty: string;
  icon: React.ReactNode;
  color: string;
  status: 'idle' | 'processing' | 'complete';
}

interface AIMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; type: 'follow-up' | 'visualize' | 'export'; data?: any }>;
}

interface AIAgentSystemProps {
  dataset?: any;
  onVisualize?: (data: any) => void;
  onExport?: (data: any) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

export default function AIAgentSystem({ dataset, onVisualize, onExport, isVisible = false, onClose }: AIAgentSystemProps) {
  const [agents] = useState<AIAgent[]>([
    {
      id: 'insight',
      name: 'Insight Agent',
      specialty: 'Correlation Analysis',
      icon: <Brain className="w-4 h-4" />,
      color: '#00F5FF',
      status: 'idle'
    },
    {
      id: 'visual',
      name: 'Visual Agent',
      specialty: 'Chart Generation',
      icon: <BarChart3 className="w-4 h-4" />,
      color: '#8B5CF6',
      status: 'idle'
    },
    {
      id: 'language',
      name: 'Language Agent',
      specialty: 'Content Creation',
      icon: <Type className="w-4 h-4" />,
      color: '#00FF88',
      status: 'idle'
    },
    {
      id: 'narrative',
      name: 'Narrative Agent',
      specialty: 'Story Building',
      icon: <BookOpen className="w-4 h-4" />,
      color: '#FF6B9D',
      status: 'idle'
    }
  ]);

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [conductorStatus, setConductorStatus] = useState('Coordinating agents...');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Simulate AI agent coordination
  useEffect(() => {
    if (dataset) {
      simulateAgentCoordination();
    }
  }, [dataset]);

  const simulateAgentCoordination = () => {
    setConductorStatus('Analyzing dataset structure...');
    
    // Simulate agent responses
    setTimeout(() => {
      const insightMessage: AIMessage = {
        id: 'insight-1',
        agentId: 'insight',
        content: 'I detected a strong correlation (r=0.78) between education level and employment status. This relationship appears consistent across all geographic regions.',
        timestamp: new Date(),
        actions: [
          { label: 'Explore Relationship', type: 'follow-up', data: { correlation: 0.78 } },
          { label: 'Generate Chart', type: 'visualize', data: { type: 'correlation', variables: ['education', 'employment'] } }
        ]
      };
      setMessages(prev => [...prev, insightMessage]);
    }, 1500);

    setTimeout(() => {
      const visualMessage: AIMessage = {
        id: 'visual-1',
        agentId: 'visual',
        content: 'Based on your data structure, I recommend a stacked bar chart for education vs employment, a geographic heatmap for regional analysis, and a scatter plot matrix for multi-variable exploration.',
        timestamp: new Date(),
        actions: [
          { label: 'Create Charts', type: 'visualize', data: { charts: ['bar', 'heatmap', 'scatter'] } },
          { label: 'View 3D Version', type: 'visualize', data: { mode: '3d' } }
        ]
      };
      setMessages(prev => [...prev, visualMessage]);
    }, 3000);

    setTimeout(() => {
      const narrativeMessage: AIMessage = {
        id: 'narrative-1',
        agentId: 'narrative',
        content: 'I can structure this analysis into a compelling data story: "The Education Advantage - How Learning Transforms Employment Outcomes". This would include 4 chapters with embedded visualizations and key insights.',
        timestamp: new Date(),
        actions: [
          { label: 'Build Story', type: 'follow-up', data: { story: true } },
          { label: 'Export Presentation', type: 'export', data: { format: 'story' } }
        ]
      };
      setMessages(prev => [...prev, narrativeMessage]);
    }, 4500);

    setTimeout(() => {
      setConductorStatus('Agents synchronized - Ready for interaction');
    }, 5000);
  };

  const handleAction = (action: any, message: AIMessage) => {
    switch (action.type) {
      case 'visualize':
        onVisualize?.(action.data);
        break;
      case 'export':
        onExport?.(action.data);
        break;
      case 'follow-up':
        // Add follow-up logic
        console.log('Follow-up action:', action.data);
        break;
    }
  };

  const getAgentById = (id: string) => agents.find(agent => agent.id === id);

  if (!isVisible) return null;

  return (
    <>
      {/* Collapse/Expand Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        size="icon"
        variant="outline"
        className="fixed right-2 top-32 z-50 glass border-primary/30 hover:border-primary/50 transition-all duration-300"
      >
        {isCollapsed ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <motion.div 
        className="fixed right-6 top-24 w-96 z-50 space-y-4"
        animate={{ 
          x: isCollapsed ? 400 : 0,
          opacity: isCollapsed ? 0 : 1 
        }}
        transition={{ 
          type: "spring",
          damping: 20,
          stiffness: 300,
          duration: 0.4
        }}
      >
        {/* AI Conductor Status */}
        <Card className="glass p-4 border border-primary/30 relative">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <div className="text-sm font-semibold">AI Conductor</div>
              <div className="text-xs text-muted-foreground">{conductorStatus}</div>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              {onClose && (
                <Button
                  onClick={onClose}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Agent Status Panel */}
        <Card className="glass p-4 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Active Agents</div>
            <Badge variant="outline" className="text-xs">
              {agents.filter(a => a.status !== 'idle').length} working
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-transparent to-white/5"
              >
                <div 
                  className="p-1.5 rounded"
                  style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                >
                  {agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{agent.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{agent.specialty}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Agent Messages */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          <AnimatePresence>
            {messages.map((message) => {
              const agent = getAgentById(message.agentId);
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  className="relative"
                >
                  <Card className="glass p-4 border border-border/30">
                    {/* Agent Header */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div 
                        className="p-1.5 rounded"
                        style={{ backgroundColor: `${agent?.color}20`, color: agent?.color }}
                      >
                        {agent?.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{agent?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <p className="text-sm text-foreground mb-3 leading-relaxed">
                      {message.content}
                    </p>

                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.type === 'export' ? 'default' : 'outline'}
                            onClick={() => handleAction(action, message)}
                            className="text-xs h-7"
                          >
                            {action.type === 'visualize' && <Eye className="w-3 h-3 mr-1" />}
                            {action.type === 'export' && <Download className="w-3 h-3 mr-1" />}
                            {action.type === 'follow-up' && <ArrowRight className="w-3 h-3 mr-1" />}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Agent Color Indicator */}
                    <div 
                      className="absolute top-0 left-0 w-1 h-full rounded-l-lg opacity-60"
                      style={{ backgroundColor: agent?.color }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
