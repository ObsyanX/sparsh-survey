import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, TrendingUp, AlertTriangle, BarChart3, Download, Expand, X, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface Insight {
  id: string;
  title: string;
  description: string;
  value: string | number;
  type: 'anomaly' | 'trend' | 'statistic' | 'correlation';
  priority: 'high' | 'medium' | 'low';
  details?: string;
  chart?: React.ReactNode;
  isPinned: boolean;
  timestamp: Date;
}

interface InsightBoardProps {
  insights?: Insight[];
  onExportInsight?: (insight: Insight) => void;
}

export default function InsightBoard({ insights = [], onExportInsight }: InsightBoardProps) {
  const [pinnedInsights, setPinnedInsights] = useState<Insight[]>([]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'timestamp' | 'type'>('priority');
  const [filterType, setFilterType] = useState<string>('all');

  const [pinnedListRef] = useAutoAnimate({ duration: 200 });
  const [allListRef] = useAutoAnimate({ duration: 200 });

  // Mock insights if none provided
  const defaultInsights: Insight[] = [
    {
      id: '1',
      title: 'Income Disparity Detected',
      description: 'Significant wage gap between urban and rural regions',
      value: '42%',
      type: 'anomaly',
      priority: 'high',
      details: 'Urban areas show 42% higher average income compared to rural regions. This pattern is consistent across all education levels and suggests potential policy intervention opportunities.',
      isPinned: false,
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Education-Employment Correlation',
      description: 'Strong positive correlation between education and employment',
      value: '0.84',
      type: 'correlation',
      priority: 'medium',
      details: 'Correlation coefficient of 0.84 indicates that higher education levels strongly predict employment status. This relationship is particularly strong in metropolitan areas.',
      isPinned: true,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      title: 'Data Quality Alert',
      description: 'Missing values concentrated in income column',
      value: '1,247',
      type: 'anomaly',
      priority: 'high',
      details: '1,247 missing values (12.3% of dataset) found primarily in income column. Pattern suggests non-random missing data, possibly related to privacy concerns.',
      isPinned: false,
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: '4',
      title: 'Seasonal Employment Trend',
      description: 'Cyclical pattern in employment rates',
      value: '+18%',
      type: 'trend',
      priority: 'medium',
      details: 'Employment rates show 18% seasonal increase during Q4, primarily in retail and logistics sectors. This pattern has been consistent over the past 3 years.',
      isPinned: false,
      timestamp: new Date(Date.now() - 10800000)
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  const togglePin = (insightId: string) => {
    const insight = displayInsights.find(i => i.id === insightId);
    if (!insight) return;

    if (pinnedInsights.find(p => p.id === insightId)) {
      setPinnedInsights(prev => prev.filter(p => p.id !== insightId));
    } else {
      setPinnedInsights(prev => [...prev, insight]);
    }
  };

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'anomaly': return <AlertTriangle className="w-5 h-5" />;
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'statistic': return <BarChart3 className="w-5 h-5" />;
      case 'correlation': return <BarChart3 className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high': return 'from-destructive/20 to-destructive/5 border-destructive/30';
      case 'medium': return 'from-quantum-purple/20 to-quantum-purple/5 border-quantum-purple/30';
      case 'low': return 'from-primary/20 to-primary/5 border-primary/30';
    }
  };

  const filteredInsights = displayInsights
    .filter(insight => filterType === 'all' || insight.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'timestamp':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Insight Board</h2>
          <p className="text-muted-foreground">Key findings and data discoveries</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter Controls */}
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass px-3 py-1 rounded-lg text-sm border border-border/30"
          >
            <option value="all">All Types</option>
            <option value="anomaly">Anomalies</option>
            <option value="trend">Trends</option>
            <option value="statistic">Statistics</option>
            <option value="correlation">Correlations</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="glass px-3 py-1 rounded-lg text-sm border border-border/30"
          >
            <option value="priority">Priority</option>
            <option value="timestamp">Recent</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      {/* Pinned Insights */}
      {pinnedInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Pin className="w-4 h-4 text-quantum-purple" />
            <span>Pinned Insights</span>
          </h3>
          
          <div ref={pinnedListRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedInsights.map((insight) => (
              <InsightCard
                key={`pinned-${insight.id}`}
                insight={insight}
                isPinned={true}
                onTogglePin={togglePin}
                onExpand={setExpandedInsight}
                onExport={onExportInsight}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Insights ({filteredInsights.length})</h3>
        
        <div ref={allListRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              isPinned={pinnedInsights.some(p => p.id === insight.id)}
              onTogglePin={togglePin}
              onExpand={setExpandedInsight}
              onExport={onExportInsight}
            />
          ))}
        </div>
      </div>

      {/* Expanded Insight Modal */}
      <AnimatePresence>
        {expandedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const insight = displayInsights.find(i => i.id === expandedInsight);
                if (!insight) return null;
                
                return (
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${getPriorityColor(insight.priority)}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{insight.title}</h3>
                          <p className="text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedInsight(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="text-3xl font-bold gradient-text">{insight.value}</div>
                      
                      {insight.details && (
                        <div className="glass p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Detailed Analysis</h4>
                          <p className="text-sm text-muted-foreground">{insight.details}</p>
                        </div>
                      )}

                      {insight.chart && (
                        <div className="glass p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Visualization</h4>
                          {insight.chart}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{insight.type}</Badge>
                          <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                            {insight.priority} priority
                          </Badge>
                        </div>
                        <Button
                          onClick={() => onExportInsight?.(insight)}
                          size="sm"
                          className="bg-gradient-to-r from-primary to-quantum-purple"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface InsightCardProps {
  insight: Insight;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onExpand: (id: string) => void;
  onExport?: (insight: Insight) => void;
}

function InsightCard({ insight, isPinned, onTogglePin, onExpand, onExport }: InsightCardProps) {
  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high': return 'from-destructive/20 to-destructive/5 border-destructive/30';
      case 'medium': return 'from-quantum-purple/20 to-quantum-purple/5 border-quantum-purple/30';
      case 'low': return 'from-primary/20 to-primary/5 border-primary/30';
    }
  };

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'statistic': return <BarChart3 className="w-4 h-4" />;
      case 'correlation': return <BarChart3 className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card className={`glass relative p-3 sm:p-4 bg-gradient-to-br ${getPriorityColor(insight.priority)} quantum-glow-hover transition-all duration-300 cursor-pointer`}>
        {/* Pin Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 h-8 w-8 p-0 touch-manipulation ${isPinned ? 'text-quantum-purple' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(insight.id);
          }}
          aria-label={isPinned ? "Unpin insight" : "Pin insight"}
        >
          <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
        </Button>

        <div className="space-y-2 sm:space-y-3" onClick={() => onExpand(insight.id)}>
          {/* Header */}
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className={`p-1.5 sm:p-2 rounded bg-gradient-to-br ${getPriorityColor(insight.priority)} flex-shrink-0`}>
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight">{insight.title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{insight.description}</p>
            </div>
          </div>

          {/* Value */}
          <div className="text-xl sm:text-2xl font-bold gradient-text">{insight.value}</div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Badge variant="outline" className="text-xs">{insight.type}</Badge>
              <span className="text-muted-foreground text-xs">
                {insight.timestamp.toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-6 sm:w-6 p-0 touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(insight.id);
                }}
                aria-label="Expand insight details"
              >
                <Expand className="w-3 h-3" />
              </Button>
              {onExport && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 sm:h-6 sm:w-6 p-0 touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(insight);
                  }}
                  aria-label="Export insight"
                >
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}