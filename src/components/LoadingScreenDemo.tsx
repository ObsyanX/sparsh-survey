import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

export default function LoadingScreenDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [demoType, setDemoType] = useState<'basic' | 'progress' | 'message'>('basic');

  const startLoading = (type: 'basic' | 'progress' | 'message') => {
    setDemoType(type);
    setIsLoading(true);
    setProgress(0);
    
    if (type === 'progress') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 1000);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 500);
    } else {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Enhanced Loading Screen Demo</h1>
          <p className="text-muted-foreground text-lg">
            Professional, modern, and immersive loading experience with responsive design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold">Basic Loading</h3>
            <p className="text-muted-foreground">
              Simple loading screen with quantum animations
            </p>
            <button
              onClick={() => startLoading('basic')}
              className="w-full quantum-glow-hover px-4 py-2 rounded-lg"
            >
              Start Basic Loading
            </button>
          </div>

          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold">Progress Loading</h3>
            <p className="text-muted-foreground">
              Loading with progress bar and dynamic updates
            </p>
            <button
              onClick={() => startLoading('progress')}
              className="w-full quantum-glow-hover px-4 py-2 rounded-lg"
            >
              Start Progress Loading
            </button>
          </div>

          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold">Custom Message</h3>
            <p className="text-muted-foreground">
              Loading with custom message and enhanced effects
            </p>
            <button
              onClick={() => startLoading('message')}
              className="w-full quantum-glow-hover px-4 py-2 rounded-lg"
            >
              Start Custom Loading
            </button>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Viewport-sized responsive design</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-quantum-purple rounded-full"></div>
                <span>Quantum-inspired animations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-quantum-green rounded-full"></div>
                <span>Holographic scan effects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Energy flow patterns</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-quantum-purple rounded-full"></div>
                <span>Reduced motion support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-quantum-green rounded-full"></div>
                <span>Mobile-optimized performance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>GPU-accelerated animations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-quantum-purple rounded-full"></div>
                <span>Accessibility compliant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Responsive Behavior</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>Desktop (1024px+)</span>
              <span className="text-quantum-green">12 particles, full effects</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tablet (768px - 1023px)</span>
              <span className="text-quantum-purple">8 particles, optimized effects</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mobile (480px - 767px)</span>
              <span className="text-primary">6 particles, simplified effects</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Small Mobile (&lt;480px)</span>
              <span className="text-muted-foreground">4 particles, minimal effects</span>
            </div>
          </div>
        </div>
      </div>

      <LoadingScreen
        isVisible={isLoading}
        message={
          demoType === 'message' 
            ? 'Initializing Quantum Data Observatory...' 
            : 'Loading...'
        }
        progress={demoType === 'progress' ? progress : undefined}
      />
    </div>
  );
}
