
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import KPICard from '@/components/KPICard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PresentationSlide {
  id: string;
  type: 'kpi' | 'chart' | 'text' | 'insight';
  title: string;
  content: React.ReactNode;
  narration?: string;
  duration: number;
}

interface PresentationModeProps {
  slides?: PresentationSlide[];
  onClose?: () => void;
}

export default function PresentationMode({ slides = [], onClose }: PresentationModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  // Default presentation slides
  const defaultSlides: PresentationSlide[] = [
    {
      id: '1',
      type: 'text',
      title: 'Survey Data Analysis Overview',
      content: (
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold gradient-text">Data Insights</h1>
          <p className="text-2xl text-muted-foreground">Comprehensive Analysis Results</p>
        </div>
      ),
      narration: 'Welcome to your data analysis presentation. We will explore key insights from your survey dataset.',
      duration: 5000
    },
    {
      id: '2',
      type: 'kpi',
      title: 'Key Performance Indicators',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <KPICard
            title="Total Responses"
            value={15847}
            icon={<div className="w-6 h-6 bg-primary rounded" />}
            color="cyan"
          />
          <KPICard
            title="Data Quality Score"
            value={94}
            suffix="%"
            icon={<div className="w-6 h-6 bg-quantum-green rounded" />}
            color="green"
          />
          <KPICard
            title="Key Insights Found"
            value={23}
            icon={<div className="w-6 h-6 bg-quantum-purple rounded" />}
            color="purple"
          />
        </div>
      ),
      narration: 'Your dataset contains over 15,000 responses with excellent data quality at 94 percent. We identified 23 key insights.',
      duration: 8000
    },
    {
      id: '3',
      type: 'chart',
      title: 'Employment by Education Level',
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">Employment Rates by Education</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              { education: 'Primary', rate: 45 },
              { education: 'Secondary', rate: 62 },
              { education: 'Tertiary', rate: 78 },
              { education: 'Graduate', rate: 85 }
            ]}>
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
              <Bar dataKey="rate" fill="#00F5FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
      narration: 'Higher education strongly correlates with employment rates, increasing from 45% for primary education to 85% for graduate level.',
      duration: 10000
    }
  ];

  const presentationSlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (isPlaying && currentSlide < presentationSlides.length) {
      const slide = presentationSlides[currentSlide];
      
      // Start progress animation
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (slide.duration / 100);
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            // Auto-advance to next slide
            if (currentSlide < presentationSlides.length - 1) {
              setCurrentSlide(prev => prev + 1);
              setProgress(0);
            } else {
              // Presentation finished
              setIsPlaying(false);
              setProgress(100);
            }
            return 100;
          }
          
          return newProgress;
        });
      }, 100);

      // Speak narration if available and not muted
      if (slide.narration && !isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(slide.narration);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentSlide, isMuted, presentationSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      window.speechSynthesis.cancel();
    }
  };

  const nextSlide = () => {
    if (currentSlide < presentationSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
      window.speechSynthesis.cancel();
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
      window.speechSynthesis.cancel();
    }
  };

  const currentSlideData = presentationSlides[currentSlide];

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-background overflow-hidden`}
    >
      {/* Main Presentation Area */}
      <div className="relative h-screen flex flex-col">
        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full max-w-6xl"
            >
              <Card className="glass p-12 quantum-glow-hover">
                {currentSlideData?.content}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-quantum-purple"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Card className="glass p-4 flex items-center space-x-4">
            <Button
              onClick={previousSlide}
              disabled={currentSlide === 0}
              variant="ghost"
              size="sm"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button onClick={togglePlay} size="sm" className="bg-gradient-to-r from-primary to-quantum-purple">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={nextSlide}
              disabled={currentSlide === presentationSlides.length - 1}
              variant="ghost"
              size="sm"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border" />
            
            <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="sm">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button onClick={toggleFullscreen} variant="ghost" size="sm">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            
            <div className="w-px h-6 bg-border" />
            
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            
            {onClose && (
              <Button onClick={onClose} variant="ghost" size="sm">
                Exit
              </Button>
            )}
          </Card>
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8">
          <Card className="glass px-3 py-1">
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} / {presentationSlides.length}
            </span>
          </Card>
        </div>

        {/* Slide Title */}
        <div className="absolute top-8 left-8">
          <Card className="glass px-4 py-2">
            <h2 className="text-lg font-semibold">{currentSlideData?.title}</h2>
          </Card>
        </div>
      </div>
    </div>
  );
}
