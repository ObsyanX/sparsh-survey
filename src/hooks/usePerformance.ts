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
  const updateCount = useRef(0);

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = window.performance.now();
      
      // Update less frequently for better performance
      if (currentTime - lastTime.current >= 2000) { // Check every 2 seconds instead of 1
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        const isLowPerformance = fps < 45; // More conservative threshold
        const shouldReduceAnimations = fps < 35; // More conservative threshold
        
        // Only update state if values actually changed
        updateCount.current++;
        if (updateCount.current % 3 === 0) { // Update state less frequently
          setPerformanceState(prev => {
            if (prev.fps !== fps || prev.isLowPerformance !== isLowPerformance || prev.shouldReduceAnimations !== shouldReduceAnimations) {
              return { fps, isLowPerformance, shouldReduceAnimations };
            }
            return prev;
          });
        }
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      // Throttle RAF calls for better performance
      if (frameCount.current % 3 === 0) { // Only measure every 3rd frame
        rafId.current = requestAnimationFrame(measureFPS);
      } else {
        rafId.current = requestAnimationFrame(measureFPS);
      }
    };

    // Delay initial measurement
    const initialTimer = setTimeout(() => {
      rafId.current = requestAnimationFrame(measureFPS);
    }, 1000);

    return () => {
      clearTimeout(initialTimer);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return performanceState;
};
