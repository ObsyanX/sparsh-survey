import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import { usePerformance } from '@/hooks/usePerformance';

const AnimatedCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isOverSpline, setIsOverSpline] = useState<boolean>(false);
  const [splineBounds, setSplineBounds] = useState<DOMRect | null>(null);
  
  // Direct motion values for immediate precision
  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);
  
  // Optimized spring configs for better responsiveness
  const springConfig = { stiffness: 800, damping: 35, mass: 0.1 };
  const trailConfig = { stiffness: 600, damping: 30, mass: 0.15 }; // Optimized for smoother performance
  
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Faster trailing cursor
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const splineRef = useRef<HTMLDivElement | null>(null);
  
  // Performance monitoring
  const { isLowPerformance, shouldReduceAnimations } = usePerformance();
  
  // Throttle mouse updates for better performance
  const throttledUpdateRef = useRef<number>();
  
  useEffect(() => {
    // Check for touch devices and reduced motion preference
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    // Only render cursor on non-touch devices and when motion is not reduced
    if (!isCoarse && !prefersReduced) {
      setShouldRender(true);
    }
  }, []);

  // Detect Spline canvas and its bounds
  const detectSplineCanvas = useCallback(() => {
    const splineContainer = document.querySelector('[class*="spline"]') || 
                           document.querySelector('[data-spline]') ||
                           document.querySelector('canvas[class*="spline"]') ||
                           document.querySelector('div[class*="spline"]');
    
    if (splineContainer) {
      splineRef.current = splineContainer as HTMLDivElement;
      const bounds = splineContainer.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      const documentBounds = new DOMRect(
        bounds.left + scrollX,
        bounds.top + scrollY,
        bounds.width,
        bounds.height
      );
      setSplineBounds(documentBounds);
    }
  }, []);

  // Check if mouse is within Spline bounds
  const isMouseInSplineBounds = useCallback((x: number, y: number) => {
    if (!splineBounds) return false;
    
    return x >= splineBounds.left && 
           x <= splineBounds.right && 
           y >= splineBounds.top && 
           y <= splineBounds.bottom;
  }, [splineBounds]);

  // Direct mouse position update - NO LERP for precision
  const updateMousePosition = useCallback((e: MouseEvent) => {
    // Throttle updates for better performance
    if (throttledUpdateRef.current) {
      cancelAnimationFrame(throttledUpdateRef.current);
    }
    
    throttledUpdateRef.current = requestAnimationFrame(() => {
      // Immediately update motion values for precise tracking
      mouseX.set(e.pageX);
      mouseY.set(e.pageY);
      
      setIsVisible(true);
      
      // Check if mouse is in Spline area
      const inSplineArea = isMouseInSplineBounds(e.pageX, e.pageY);
      setIsOverSpline(inSplineArea);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Hide cursor after inactivity
      timeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setIsVisible(false);
        }
      }, 3000);
    });
  }, [mouseX, mouseY, isMouseInSplineBounds, isHovering]);

  // Optimized hover detection with debouncing
  const handleMouseOver = useCallback((e: MouseEvent) => {
    // Debounce hover detection
    if (throttledUpdateRef.current) {
      cancelAnimationFrame(throttledUpdateRef.current);
    }
    
    throttledUpdateRef.current = requestAnimationFrame(() => {
      const target = e.target as HTMLElement;
      
      // Check if we're over a Spline element
      const isSplineElement = target.closest('[class*="spline"]') || 
                             target.closest('canvas') ||
                             target.closest('[data-spline]');
      
      if (isSplineElement) {
        setIsOverSpline(true);
        setIsHovering(false);
        setIsVisible(true);
        return;
      }
      
      // Regular interactive element detection
      const isInteractive = target.tagName === 'BUTTON' || 
                           target.tagName === 'A' || 
                           target.tagName === 'INPUT' ||
                           target.tagName === 'TEXTAREA' ||
                           target.getAttribute('role') === 'button' ||
                           !!target.closest('button') || 
                           !!target.closest('a') ||
                           !!target.closest('[role="button"]') ||
                           target.classList.contains('cursor-pointer') ||
                           getComputedStyle(target).cursor === 'pointer' ||
                           target.classList.contains('hover:scale-105') ||
                           target.classList.contains('quantum-glow-hover') ||
                           target.classList.contains('glass') ||
                           target.classList.contains('card');
      
      setIsHovering(isInteractive);
      setIsOverSpline(false);
      setIsVisible(true);
    });
  }, []);

  // Remove the old updateMousePosition and handleMouseOver functions since we've replaced them above

  useEffect(() => {
    if (!shouldRender) return;

    // Initial Spline detection
    detectSplineCanvas();
    
    // Retry detection after delays
    const retryTimer = setTimeout(detectSplineCanvas, 1000);
    const retryTimer2 = setTimeout(detectSplineCanvas, 2000);
    
    // Add event listeners with passive option for better performance
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleResize, { passive: true });
    
    // Handle window focus/blur for cursor visibility
    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    // Force cursor to be visible initially
    setIsVisible(true);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      clearTimeout(retryTimer);
      clearTimeout(retryTimer2);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (throttledUpdateRef.current) {
        cancelAnimationFrame(throttledUpdateRef.current);
      }
    };
  }, [shouldRender, updateMousePosition, handleMouseOver, handleMouseEnter, handleResize, detectSplineCanvas]);

  // Don't render on touch devices or when reduced motion is preferred
  if (!shouldRender || shouldReduceAnimations) return null;

  // Reduce particle count for low performance devices
  const particleCount = isLowPerformance ? 1 : 2; // Further reduced

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Main cursor - Precise tracking */}
      <motion.div
        className="absolute w-4 h-4 bg-blue-500 rounded-full mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          left: -8,
          top: -8,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          contain: 'layout style paint'
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 25,
          mass: 0.1,
        }}
      />
      
      {/* Trailing cursor - Smooth follow */}
      <motion.div
        className="absolute w-8 h-8 border-2 border-blue-500/50 rounded-full"
        style={{
          x: trailX,
          y: trailY,
          left: -16,
          top: -16,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          contain: 'layout style paint'
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
          opacity: isHovering ? 0.8 : 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.2,
        }}
      />
      
      {/* Optimized quantum particles */}
      {isHovering && !shouldReduceAnimations && !isLowPerformance && (
        <motion.div
          className="absolute"
          style={{
            x: springX,
            y: springY,
            left: -2,
            top: -2,
            willChange: 'transform',
            contain: 'layout style paint'
          }}
        >
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-primary to-quantum-purple rounded-full"
              custom={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                x: [0, (Math.random() - 0.5) * 20], // Reduced range
                y: [0, (Math.random() - 0.5) * 20], // Reduced range
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1, // Reduced duration
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
                repeatDelay: 0.5, // Reduced repeat delay
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedCursor;
    // Immediately update motion values for precise tracking
    mouseX.set(e.pageX);
    mouseY.set(e.pageY);
    
    setIsVisible(true);
    
    // Check if mouse is in Spline area
    const inSplineArea = isMouseInSplineBounds(e.pageX, e.pageY);
    setIsOverSpline(inSplineArea);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Hide cursor after inactivity
    timeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        setIsVisible(false);
      }
    }, 3000);
  }, [mouseX, mouseY, isMouseInSplineBounds, isHovering]);

  // Enhanced hover detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if we're over a Spline element
    const isSplineElement = target.closest('[class*="spline"]') || 
                           target.closest('canvas') ||
                           target.closest('[data-spline]');
    
    if (isSplineElement) {
      setIsOverSpline(true);
      setIsHovering(false);
      setIsVisible(true);
      return;
    }
    
    // Regular interactive element detection
    const isInteractive = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.tagName === 'INPUT' ||
                         target.tagName === 'TEXTAREA' ||
                         target.getAttribute('role') === 'button' ||
                         !!target.closest('button') || 
                         !!target.closest('a') ||
                         !!target.closest('[role="button"]') ||
                         target.classList.contains('cursor-pointer') ||
                         getComputedStyle(target).cursor === 'pointer' ||
                         target.classList.contains('hover:scale-105') ||
                         target.classList.contains('quantum-glow-hover') ||
                         target.classList.contains('glass') ||
                         target.classList.contains('card');
    
    setIsHovering(isInteractive);
    setIsOverSpline(false);
    setIsVisible(true);
  }, []);

  // Handle cursor visibility
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Update Spline bounds on resize and scroll
  const handleResize = useCallback(() => {
    if (splineRef.current) {
      const bounds = splineRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      const documentBounds = new DOMRect(
        bounds.left + scrollX,
        bounds.top + scrollY,
        bounds.width,
        bounds.height
      );
      setSplineBounds(documentBounds);
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    // Initial Spline detection
    detectSplineCanvas();
    
    // Retry detection after delays
    const retryTimer = setTimeout(detectSplineCanvas, 1000);
    const retryTimer2 = setTimeout(detectSplineCanvas, 2000);
    
    // Add event listeners with passive option for better performance
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleResize, { passive: true });
    
    // Handle window focus/blur for cursor visibility
    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    // Force cursor to be visible initially
    setIsVisible(true);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      clearTimeout(retryTimer);
      clearTimeout(retryTimer2);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldRender, updateMousePosition, handleMouseOver, handleMouseEnter, handleResize, detectSplineCanvas]);

  // Don't render on touch devices or when reduced motion is preferred
  if (!shouldRender) return null;

  // Reduce particle count for low performance devices
  const particleCount = shouldReduceAnimations ? 1 : 3;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Main cursor - Precise tracking */}
      <motion.div
        className="absolute w-4 h-4 bg-blue-500 rounded-full mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          left: -8,
          top: -8,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 25,
          mass: 0.1,
        }}
      />
      
      {/* Trailing cursor - Smooth follow */}
      <motion.div
        className="absolute w-8 h-8 border-2 border-blue-500/50 rounded-full"
        style={{
          x: trailX,
          y: trailY,
          left: -16,
          top: -16,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
          opacity: isHovering ? 0.8 : 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.2,
        }}
      />
      
      {/* Optimized quantum particles */}
      {isHovering && !shouldReduceAnimations && (
        <motion.div
          className="absolute"
          style={{
            x: springX,
            y: springY,
            left: -2,
            top: -2,
            willChange: 'transform'
          }}
        >
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                x: [0, (Math.random() - 0.5) * 30],
                y: [0, (Math.random() - 0.5) * 30],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut",
                repeatDelay: 0.3,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedCursor;