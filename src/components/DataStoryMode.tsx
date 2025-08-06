import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, BarChart3, TrendingUp, Users, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DataStory {
  id: string;
  title: string;
  narrative: string;
  insights: string[];
  visualizations: React.ReactNode[];
  tags: string[];
  readTime: number;
}

interface DataStoryModeProps {
  dataset?: any;
  onGenerateStory?: () => void;
}

export default function DataStoryMode({ dataset, onGenerateStory }: DataStoryModeProps) {
  const [currentStory, setCurrentStory] = useState<DataStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for visualization
  const educationEmploymentData = [
    { education: 'Primary', employed: 45, unemployed: 55 },
    { education: 'Secondary', employed: 62, unemployed: 38 },
    { education: 'Tertiary', employed: 78, unemployed: 22 },
    { education: 'Graduate', employed: 85, unemployed: 15 }
  ];

  const regionIncomeData = [
    { region: 'Urban Central', income: 75000, population: 2500000 },
    { region: 'Urban Suburban', income: 68000, population: 1800000 },
    { region: 'Rural Metro', income: 52000, population: 950000 },
    { region: 'Rural Remote', income: 41000, population: 650000 }
  ];

  const COLORS = ['#00F5FF', '#8B5CF6', '#00FF88', '#FF6B9D'];

  const generateStory = async () => {
    setIsGenerating(true);
    
    // Simulate AI story generation
    setTimeout(() => {
      const story: DataStory = {
        id: 'education-employment-analysis',
        title: 'The Education-Employment Nexus: A Tale of Opportunity',
        narrative: `In the sprawling landscape of our survey data, a compelling narrative emerges about the transformative power of education. Like tributaries flowing into a mighty river, each level of educational attainment creates distinct pathways to employment opportunities.

**Chapter 1: The Foundation Years**
Our analysis reveals that individuals with primary education face significant challenges in the job market, with only 45% achieving employment. These foundational years, while crucial, represent the starting point of a journey rather than its destination.

**Chapter 2: The Secondary Surge**
A dramatic shift occurs at the secondary education level. Here, we witness a 17-percentage-point leap in employment rates to 62%. This transition marks the first major inflection point in our data story, where basic skills begin to translate into tangible opportunities.

**Chapter 3: The Tertiary Transformation**
The tertiary education threshold represents a quantum leap in employment prospects. At 78% employment rate, we see how higher education acts as a powerful catalyst, opening doors that remain closed to those with less formal training. The data whispers tales of specialization, critical thinking, and adaptability.

**Chapter 4: The Graduate Gateway**
At the pinnacle of our educational journey, graduate-level education delivers an impressive 85% employment rate. This represents not just a statistic, but a testament to the compounding returns of educational investment.

**The Geographic Dimension**
When we layer geography onto our educational narrative, fascinating patterns emerge. Urban centers command premium incomes—$75,000 in central urban areas compared to $41,000 in rural remote regions. This 83% income differential tells a story of concentration, infrastructure, and opportunity clustering.

**The Intersection of Learning and Location**
Perhaps most intriguingly, our data reveals that educational premiums are amplified in urban settings. A graduate in an urban center doesn't just earn more—they enter an ecosystem where their skills are more highly valued, creating a virtuous cycle of growth and opportunity.

This story, woven from the threads of our survey data, illustrates not just correlations but the lived experiences of thousands of individuals navigating the intersection of education, geography, and economic opportunity.`,
        insights: [
          'Educational attainment shows a strong positive correlation (r=0.84) with employment rates',
          'Geographic location creates an 83% income differential between urban and rural areas',
          'The combination of tertiary education and urban residence yields the highest economic returns',
          'Rural areas show consistent educational gaps across all income brackets',
          'Each educational level represents an average 15-17% improvement in employment prospects'
        ],
        visualizations: [
          <div key="education-chart" className="space-y-4">
            <h4 className="font-semibold text-center">Education Level vs Employment Rate</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={educationEmploymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="education" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="employed" fill="#00F5FF" name="Employed %" />
                <Bar dataKey="unemployed" fill="#8B5CF6" name="Unemployed %" />
              </BarChart>
            </ResponsiveContainer>
          </div>,
          <div key="income-chart" className="space-y-4">
            <h4 className="font-semibold text-center">Regional Income Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={regionIncomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="region" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#00FF88" 
                  strokeWidth={3}
                  dot={{ fill: '#00FF88', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ],
        tags: ['Education', 'Employment', 'Geography', 'Income', 'Correlation'],
        readTime: 8
      };

      setCurrentStory(story);
      setIsGenerating(false);
      onGenerateStory?.();
    }, 3000);
  };

  if (!currentStory) {
    return (
      <Card className="glass p-8 text-center max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-quantum-purple/20">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-2">Data Storytelling Mode</h3>
            <p className="text-muted-foreground">
              Transform your dataset into compelling narratives with embedded visualizations and AI-driven insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-quantum-purple" />
              <span>AI Narratives</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>Visual Stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-quantum-green" />
              <span>Trend Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-quantum-purple" />
              <span>Insights</span>
            </div>
          </div>

          <Button
            onClick={generateStory}
            disabled={isGenerating}
            className="bg-gradient-to-r from-primary to-quantum-purple quantum-glow-hover px-8 py-3"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
                Generating Story...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Data Story
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Story Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold gradient-text">{currentStory.title}</h1>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <span>{currentStory.readTime} min read</span>
          <span>•</span>
          <span>{currentStory.insights.length} key insights</span>
          <span>•</span>
          <span>{currentStory.visualizations.length} visualizations</span>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {currentStory.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </motion.div>

      {/* Story Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {/* Narrative */}
        <Card className="glass p-8">
          <div className="prose prose-invert max-w-none">
            {currentStory.narrative.split('\n\n').map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="mb-6 last:mb-0"
              >
                {paragraph.startsWith('**') ? (
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                ) : (
                  <p className="text-foreground leading-relaxed">{paragraph}</p>
                )}
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentStory.visualizations.map((viz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (index * 0.2) }}
            >
              <Card className="glass p-6 quantum-glow-hover">
                {viz}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Key Insights */}
        <Card className="glass p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-quantum-green" />
            Key Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStory.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-foreground">{insight}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={() => setCurrentStory(null)}
            variant="outline"
            className="quantum-glow-hover"
          >
            Generate New Story
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-quantum-purple"
            onClick={() => console.log('Export story')}
          >
            Export Story
          </Button>
        </div>
      </motion.div>
    </div>
  );
}