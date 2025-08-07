
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, TrendingUp, Map, Scatter3D, Eye } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartRecommendation {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  description: string;
  score: number;
  variables: string[];
  icon: React.ReactNode;
  data: any[];
  preview: React.ReactNode;
}

interface ChartEngineProps {
  dataset?: any[];
  onChartSelect?: (chart: ChartRecommendation) => void;
  className?: string;
}

export default function ChartEngine({ dataset = [], onChartSelect, className = '' }: ChartEngineProps) {
  const [recommendations, setRecommendations] = useState<ChartRecommendation[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for demonstrations
  const mockEmploymentData = [
    { education: 'Primary', employed: 45, unemployed: 55, total: 100 },
    { education: 'Secondary', employed: 62, unemployed: 38, total: 100 },
    { education: 'Tertiary', employed: 78, unemployed: 22, total: 100 },
    { education: 'Graduate', employed: 85, unemployed: 15, total: 100 }
  ];

  const mockRegionData = [
    { region: 'Urban', income: 75000, population: 2500000 },
    { region: 'Suburban', income: 68000, population: 1800000 },
    { region: 'Rural', income: 52000, population: 950000 }
  ];

  const mockAgeIncomeData = [
    { age: 25, income: 35000, education: 'Primary' },
    { age: 30, income: 45000, education: 'Secondary' },
    { age: 35, income: 65000, education: 'Tertiary' },
    { age: 40, income: 75000, education: 'Graduate' },
    { age: 45, income: 85000, education: 'Graduate' }
  ];

  const COLORS = ['#00F5FF', '#8B5CF6', '#00FF88', '#FF6B9D'];

  useEffect(() => {
    if (dataset.length > 0) {
      analyzeDataset();
    } else {
      generateDefaultRecommendations();
    }
  }, [dataset]);

  const analyzeDataset = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      generateDefaultRecommendations();
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateDefaultRecommendations = () => {
    const charts: ChartRecommendation[] = [
      {
        id: 'education-employment',
        type: 'bar',
        title: 'Education vs Employment',
        description: 'Shows employment rates across different education levels with clear categorical comparison.',
        score: 95,
        variables: ['education_level', 'employment_status'],
        icon: <BarChart3 className="w-4 h-4" />,
        data: mockEmploymentData,
        preview: (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={mockEmploymentData}>
              <Bar dataKey="employed" fill="#00F5FF" />
              <XAxis dataKey="education" hide />
              <YAxis hide />
            </BarChart>
          </ResponsiveContainer>
        )
      },
      {
        id: 'regional-income',
        type: 'line',
        title: 'Regional Income Trends',
        description: 'Displays income distribution across geographic regions with trend analysis.',
        score: 88,
        variables: ['region', 'income'],
        icon: <TrendingUp className="w-4 h-4" />,
        data: mockRegionData,
        preview: (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={mockRegionData}>
              <Line type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              <XAxis dataKey="region" hide />
              <YAxis hide />
            </LineChart>
          </ResponsiveContainer>
        )
      },
      {
        id: 'education-distribution',
        type: 'pie',
        title: 'Education Distribution',
        description: 'Pie chart showing the proportional breakdown of education levels in the dataset.',
        score: 82,
        variables: ['education_level'],
        icon: <PieChart className="w-4 h-4" />,
        data: mockEmploymentData,
        preview: (
          <ResponsiveContainer width="100%" height={120}>
            <RechartsPie data={mockEmploymentData}>
              <RechartsPie dataKey="total" cx="50%" cy="50%" outerRadius={40}>
                {mockEmploymentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsPie>
            </RechartsPie>
          </ResponsiveContainer>
        )
      },
      {
        id: 'age-income-correlation',
        type: 'scatter',
        title: 'Age vs Income Correlation',
        description: 'Scatter plot revealing the relationship between age, income, and education level.',
        score: 91,
        variables: ['age', 'income', 'education_level'],
        icon: <Scatter3D className="w-4 h-4" />,
        data: mockAgeIncomeData,
        preview: (
          <ResponsiveContainer width="100%" height={120}>
            <ScatterChart data={mockAgeIncomeData}>
              <Scatter dataKey="income" fill="#00FF88" />
              <XAxis dataKey="age" hide />
              <YAxis hide />
            </ScatterChart>
          </ResponsiveContainer>
        )
      }
    ];

    // Sort by score
    charts.sort((a, b) => b.score - a.score);
    setRecommendations(charts);
  };

  const handleChartSelect = (chart: ChartRecommendation) => {
    setSelectedChart(chart.id);
    onChartSelect?.(chart);
  };

  return (
    <Card className={`glass p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Smart Chart Engine</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated visualization recommendations
            </p>
          </div>
          
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span>Analyzing dataset...</span>
            </motion.div>
          )}
        </div>

        {/* Chart Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {recommendations.map((chart, index) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group cursor-pointer ${
                  selectedChart === chart.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleChartSelect(chart)}
              >
                <Card className="glass p-4 quantum-glow-hover border border-border/30 transition-all duration-300">
                  {/* Chart Preview */}
                  <div className="mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-background/50 to-transparent">
                    {chart.preview}
                  </div>

                  {/* Chart Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded bg-primary/20 text-primary">
                          {chart.icon}
                        </div>
                        <h4 className="font-semibold text-sm">{chart.title}</h4>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {chart.score}% match
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {chart.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {chart.variables.slice(0, 2).map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                        {chart.variables.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{chart.variables.length - 2}
                          </Badge>
                        )}
                      </div>

                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedChart === chart.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <BarChart3 className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chart Actions */}
        {selectedChart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
          >
            <Button size="sm" variant="outline">
              View in 3D
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-quantum-purple">
              Generate Chart
            </Button>
            <Button size="sm" variant="outline">
              Add to Story
            </Button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{recommendations.length}</div>
            <div className="text-xs text-muted-foreground">Recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-quantum-purple">
              {recommendations.length > 0 ? Math.round(recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Avg. Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-quantum-green">
              {new Set(recommendations.flatMap(r => r.variables)).size}
            </div>
            <div className="text-xs text-muted-foreground">Variables Used</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
