import { useState, useEffect, useRef } from 'react';

interface PerformanceState {
  fps: number;
  isLowPerformance: boolean;
  shouldReduceAnimations: boolean;
}

export const usePerformance = () => {
  const [performanceState, setPerformanceState] = useState<PerformanceState>({
    fps: 60,
    isLowPerformance: false,
    shouldReduceAnimations: false
  });

  const frameCount = useRef(0);
  const lastTime = useRef(window.performance.now());
  const rafId = useRef<number>();

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = window.performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        const isLowPerformance = fps < 50;
        const shouldReduceAnimations = fps < 30;
        
        setPerformanceState({ fps, isLowPerformance, shouldReduceAnimations });
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      rafId.current = requestAnimationFrame(measureFPS);
    };

    rafId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return performanceState;
};
