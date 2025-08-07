
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Network, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GraphNode {
  id: string;
  label: string;
  type: 'variable' | 'insight' | 'action' | 'correlation';
  value?: number;
  connections: string[];
  position: { x: number; y: number };
  color: string;
}

interface KnowledgeGraphProps {
  insights?: any[];
  variables?: string[];
  className?: string;
}

export default function KnowledgeGraph({ insights = [], variables = [], className = '' }: KnowledgeGraphProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate mock knowledge graph data
  useEffect(() => {
    const mockNodes: GraphNode[] = [
      // Variable nodes
      {
        id: 'education_level',
        label: 'Education Level',
        type: 'variable',
        connections: ['employment_status', 'income', 'correlation_1'],
        position: { x: 100, y: 100 },
        color: '#00F5FF'
      },
      {
        id: 'employment_status',
        label: 'Employment Status',
        type: 'variable',
        connections: ['education_level', 'income', 'correlation_1', 'insight_1'],
        position: { x: 300, y: 100 },
        color: '#00F5FF'
      },
      {
        id: 'income',
        label: 'Income',
        type: 'variable',
        connections: ['education_level', 'employment_status', 'outlier_1'],
        position: { x: 200, y: 250 },
        color: '#00F5FF'
      },
      {
        id: 'age',
        label: 'Age',
        type: 'variable',
        connections: ['missing_data_1'],
        position: { x: 400, y: 200 },
        color: '#00F5FF'
      },
      // Insight nodes
      {
        id: 'correlation_1',
        label: 'Strong Correlation',
        type: 'correlation',
        value: 0.74,
        connections: ['education_level', 'employment_status'],
        position: { x: 200, y: 50 },
        color: '#A855F7'
      },
      {
        id: 'insight_1',
        label: 'Employment Prediction',
        type: 'insight',
        connections: ['employment_status', 'action_1'],
        position: { x: 450, y: 100 },
        color: '#10B981'
      },
      {
        id: 'outlier_1',
        label: 'Income Outliers',
        type: 'insight',
        value: 12,
        connections: ['income', 'action_2'],
        position: { x: 100, y: 300 },
        color: '#EF4444'
      },
      {
        id: 'missing_data_1',
        label: 'Missing Data Pattern',
        type: 'insight',
        connections: ['age'],
        position: { x: 500, y: 250 },
        color: '#EF4444'
      },
      // Action nodes
      {
        id: 'action_1',
        label: 'Explore Relationship',
        type: 'action',
        connections: ['insight_1'],
        position: { x: 550, y: 150 },
        color: '#F59E0B'
      },
      {
        id: 'action_2',
        label: 'Review Outliers',
        type: 'action',
        connections: ['outlier_1'],
        position: { x: 50, y: 350 },
        color: '#F59E0B'
      }
    ];

    setNodes(mockNodes);
  }, [insights, variables]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleReset = () => {
    setZoom(1);
    setCenter({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const getNodeTypeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'variable': return '📊';
      case 'insight': return '💡';
      case 'action': return '⚡';
      case 'correlation': return '🔗';
    }
  };

  const getNodeSize = (node: GraphNode) => {
    const baseSize = 30;
    const connectionBonus = node.connections.length * 3;
    return Math.min(baseSize + connectionBonus, 50);
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <Card className={`glass p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Knowledge Graph</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="relative bg-background/50 rounded-lg border border-border/30 overflow-hidden" style={{ height: '400px' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="cursor-pointer"
          style={{ transform: `scale(${zoom}) translate(${center.x}px, ${center.y}px)` }}
        >
          {/* Connections */}
          <g className="connections">
            {nodes.map(node => 
              node.connections.map(connectionId => {
                const targetNode = nodes.find(n => n.id === connectionId);
                if (!targetNode) return null;
                
                const isSelected = selectedNode === node.id || selectedNode === connectionId;
                
                return (
                  <motion.line
                    key={`${node.id}-${connectionId}`}
                    x1={node.position.x}
                    y1={node.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={isSelected ? node.color : 'hsl(var(--border))'}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeOpacity={isSelected ? 0.8 : 0.3}
                    strokeDasharray={node.type === 'correlation' ? '5,5' : 'none'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: Math.random() * 0.5 }}
                  />
                );
              })
            )}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node, index) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleNodeClick(node.id)}
                className="cursor-pointer"
              >
                <motion.circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r={getNodeSize(node)}
                  fill={node.color}
                  fillOpacity={selectedNode === node.id ? 0.3 : 0.1}
                  stroke={node.color}
                  strokeWidth={selectedNode === node.id ? 3 : 2}
                  className="hover:fill-opacity-20 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                />
                
                <text
                  x={node.position.x}
                  y={node.position.y - getNodeSize(node) - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-current"
                  style={{ fontSize: '10px' }}
                >
                  {node.label}
                </text>
                
                <text
                  x={node.position.x}
                  y={node.position.y + 3}
                  textAnchor="middle"
                  style={{ fontSize: '12px' }}
                >
                  {getNodeTypeIcon(node.type)}
                </text>
                
                {node.value && (
                  <text
                    x={node.position.x}
                    y={node.position.y + getNodeSize(node) + 15}
                    textAnchor="middle"
                    className="text-xs fill-current opacity-70"
                    style={{ fontSize: '8px' }}
                  >
                    {node.value}
                  </text>
                )}
              </motion.g>
            ))}
          </g>
        </svg>
      </div>

      {/* Node Details Panel */}
      {selectedNodeData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 glass rounded-lg border border-border/30"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{selectedNodeData.label}</h4>
            <Badge variant="outline">{selectedNodeData.type}</Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              {selectedNodeData.connections.length} connections
            </p>
            
            {selectedNodeData.value && (
              <p className="text-muted-foreground">
                Value: <span className="font-medium">{selectedNodeData.value}</span>
              </p>
            )}
            
            <div className="flex flex-wrap gap-1">
              {selectedNodeData.connections.map(connId => {
                const connNode = nodes.find(n => n.id === connId);
                return connNode ? (
                  <Badge key={connId} variant="secondary" className="text-xs">
                    {connNode.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Variables</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A855F7' }} />
          <span>Correlations</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-quantum-green" />
          <span>Insights</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
          <span>Actions</span>
        </div>
      </div>
    </Card>
  );
}
