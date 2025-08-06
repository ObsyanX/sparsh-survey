import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ScenarioParameter {
  id: string;
  label: string;
  type: 'slider' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  value: number | boolean;
  unit?: string;
  description: string;
}

interface ScenarioResult {
  metric: string;
  baseline: number;
  simulated: number;
  change: number;
  changePercent: number;
  unit: string;
}

export default function ScenarioSimulator() {
  const [parameters, setParameters] = useState<ScenarioParameter[]>([
    {
      id: 'female_employment',
      label: 'Female Employment Rate',
      type: 'slider',
      min: 0,
      max: 100,
      step: 1,
      value: 65,
      unit: '%',
      description: 'Adjust the percentage of employed females in rural regions'
    },
    {
      id: 'education_access',
      label: 'Education Access',
      type: 'slider',
      min: 0,
      max: 100,
      step: 5,
      value: 75,
      unit: '%',
      description: 'Modify access to tertiary education in underserved areas'
    },
    {
      id: 'minimum_wage',
      label: 'Minimum Wage Increase',
      type: 'slider',
      min: 0,
      max: 50,
      step: 1,
      value: 15,
      unit: '%',
      description: 'Simulate the impact of minimum wage adjustments'
    },
    {
      id: 'remote_work',
      label: 'Remote Work Enabled',
      type: 'toggle',
      value: false,
      description: 'Enable widespread remote work opportunities'
    }
  ]);

  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Mock baseline data
  const baselineData = [
    { category: 'Rural Female Employment', value: 45 },
    { category: 'Average Income', value: 52000 },
    { category: 'Education Completion', value: 68 },
    { category: 'Urban-Rural Income Gap', value: 35 }
  ];

  const updateParameter = (id: string, value: number | boolean) => {
    setParameters(prev => prev.map(param => 
      param.id === id ? { ...param, value } : param
    ));
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate mock results based on parameters
    const femaleEmployment = parameters.find(p => p.id === 'female_employment')?.value as number;
    const educationAccess = parameters.find(p => p.id === 'education_access')?.value as number;
    const minWageIncrease = parameters.find(p => p.id === 'minimum_wage')?.value as number;
    const remoteWork = parameters.find(p => p.id === 'remote_work')?.value as boolean;

    const simulatedResults: ScenarioResult[] = [
      {
        metric: 'Rural Female Employment',
        baseline: 45,
        simulated: Math.min(95, 45 + (femaleEmployment - 65) * 0.8),
        change: 0,
        changePercent: 0,
        unit: '%'
      },
      {
        metric: 'Average Income',
        baseline: 52000,
        simulated: 52000 * (1 + minWageIncrease/100 * 0.3) * (remoteWork ? 1.12 : 1),
        change: 0,
        changePercent: 0,
        unit: '$'
      },
      {
        metric: 'Education Completion',
        baseline: 68,
        simulated: Math.min(95, 68 + (educationAccess - 75) * 0.4),
        change: 0,
        changePercent: 0,
        unit: '%'
      },
      {
        metric: 'Urban-Rural Income Gap',
        baseline: 35,
        simulated: Math.max(10, 35 - minWageIncrease * 0.8 - (remoteWork ? 8 : 0)),
        change: 0,
        changePercent: 0,
        unit: '%'
      }
    ];

    // Calculate changes
    simulatedResults.forEach(result => {
      result.change = result.simulated - result.baseline;
      result.changePercent = (result.change / result.baseline) * 100;
    });

    setResults(simulatedResults);
    setShowComparison(true);
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setParameters(prev => prev.map(param => ({
      ...param,
      value: param.type === 'toggle' ? false : param.id === 'female_employment' ? 65 : param.id === 'education_access' ? 75 : 15
    })));
    setResults([]);
    setShowComparison(false);
  };

  // Generate comparison chart data
  const comparisonData = results.map(result => ({
    metric: result.metric,
    baseline: result.baseline,
    simulated: result.simulated
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold gradient-text">Scenario Simulator</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore "what if" scenarios by adjusting key parameters and see real-time impact on your data outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameter Controls */}
        <Card className="glass p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Scenario Parameters</h3>
            <Button
              onClick={resetSimulation}
              variant="outline"
              size="sm"
              className="quantum-glow-hover"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            {parameters.map((param) => (
              <motion.div
                key={param.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label className="font-medium">{param.label}</Label>
                  {param.type === 'slider' && (
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {param.value}{param.unit}
                    </span>
                  )}
                </div>

                {param.type === 'slider' ? (
                  <div className="space-y-2">
                    <Slider
                      value={[param.value as number]}
                      onValueChange={([value]) => updateParameter(param.id, value)}
                      max={param.max}
                      min={param.min}
                      step={param.step}
                      className="quantum-slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{param.min}{param.unit}</span>
                      <span>{param.max}{param.unit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={param.value as boolean}
                      onCheckedChange={(checked) => updateParameter(param.id, checked)}
                    />
                    <span className="text-sm">{param.value ? 'Enabled' : 'Disabled'}</span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">{param.description}</p>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full bg-gradient-to-r from-primary to-quantum-purple quantum-glow-hover"
            size="lg"
          >
            {isSimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </Card>

        {/* Results Display */}
        <Card className="glass p-6 space-y-6">
          <h3 className="text-xl font-semibold">Simulation Results</h3>

          <AnimatePresence mode="wait">
            {!showComparison ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center space-y-4"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-quantum-purple/20">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ready to Simulate</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust parameters and run simulation to see projected outcomes
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.metric}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        result.change > 0 
                          ? 'bg-gradient-to-br from-quantum-green/20 to-quantum-green/5 border-quantum-green/30'
                          : result.change < 0
                            ? 'bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/30'
                            : 'bg-gradient-to-br from-muted/20 to-muted/5 border-border/30'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground mb-1">{result.metric}</div>
                      <div className="text-lg font-bold">
                        {result.simulated.toLocaleString()}{result.unit}
                      </div>
                      <div className={`text-xs flex items-center ${
                        result.change > 0 ? 'text-quantum-green' : result.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {result.change > 0 ? '+' : ''}{result.change.toFixed(1)}{result.unit}
                        ({result.changePercent > 0 ? '+' : ''}{result.changePercent.toFixed(1)}%)
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Chart */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Before vs After Comparison</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="metric" 
                        stroke="hsl(var(--foreground))"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="baseline" fill="#8B5CF6" name="Baseline" />
                      <Bar dataKey="simulated" fill="#00F5FF" name="Simulated" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Insights Panel */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-quantum-green" />
              Scenario Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Key Findings:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {results.map((result, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-2"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        result.change > 0 ? 'bg-quantum-green' : result.change < 0 ? 'bg-destructive' : 'bg-muted-foreground'
                      }`} />
                      <span>
                        {result.metric} would {result.change > 0 ? 'increase' : result.change < 0 ? 'decrease' : 'remain unchanged'} by {Math.abs(result.changePercent).toFixed(1)}%
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Recommendations:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <span>Focus on education access to maximize employment outcomes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <span>Remote work policies show significant impact on income gaps</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <span>Targeted interventions in rural areas yield highest returns</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}