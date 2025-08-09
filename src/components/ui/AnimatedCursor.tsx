import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, MotionValue } from 'framer-motion';

const AnimatedCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isOverSpline, setIsOverSpline] = useState<boolean>(false);
  const [splineBounds, setSplineBounds] = useState<DOMRect | null>(null);
  
  // Use motion values for better performance
  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);
  
  // Create smooth spring animations
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28 });
  
  // Trailing cursor with different spring config
  const trailX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const trailY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const rafRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const splineRef = useRef<HTMLDivElement | null>(null);
  
  // Track document dimensions
  const [documentHeight, setDocumentHeight] = useState<number>(0);
  const [documentWidth, setDocumentWidth] = useState<number>(0);
  
  useEffect(() => {
    // Check for touch devices and reduced motion preference
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    // Only render cursor on non-touch devices and when motion is not reduced
    if (!isCoarse && !prefersReduced) {
      setShouldRender(true);
    }
    
    // Get full document dimensions
    const updateDocumentDimensions = () => {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const docWidth = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
      );
      
      setDocumentHeight(docHeight);
      setDocumentWidth(docWidth);
      
      console.log('Document dimensions:', docWidth, 'x', docHeight);
      console.log('Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);
    };
    
    updateDocumentDimensions();
    
    // Update dimensions on window resize or content changes
    const resizeObserver = new ResizeObserver(updateDocumentDimensions);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);
    
    return () => {
      resizeObserver.disconnect();
    };
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
      setSplineBounds(bounds);
      console.log('Spline canvas detected:', bounds);
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

  // FIXED: Mouse position calculation including scroll offset
  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      // Get mouse position relative to the entire document, not just viewport
      const x = e.clientX;
      const y = e.clientY + window.scrollY; // Add scroll offset for full document tracking
      
      // DEBUG: Log positions and scroll
      console.log(`Mouse - ClientX: ${e.clientX}, ClientY: ${e.clientY}`);
      console.log(`Scroll - X: ${window.scrollX}, Y: ${window.scrollY}`);
      console.log(`Final position - X: ${x}, Y: ${y}`);
      console.log(`Document bounds - Width: ${documentWidth}, Height: ${documentHeight}`);
      
      // Clamp to document boundaries
      const clampedX = Math.max(0, Math.min(x, documentWidth));
      const clampedY = Math.max(0, Math.min(y, documentHeight));
      
      // Update cursor position
      mouseX.set(clampedX);
      mouseY.set(clampedY);
      setIsVisible(true);
      
      // Check if mouse is in Spline area (use clientX/Y for viewport-relative checks)
      const inSplineArea = isMouseInSplineBounds(e.clientX, e.clientY);
      setIsOverSpline(inSplineArea);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Only hide cursor after inactivity if not hovering over interactive elements
      timeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setIsVisible(false);
        }
      }, 5000);
    });
  }, [mouseX, mouseY, isMouseInSplineBounds, isHovering, documentWidth, documentHeight]);

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

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Don't hide cursor on mouse leave, let the timeout handle it
  }, []);

  // Enhanced resize handler
  const handleResize = useCallback(() => {
    // Update document dimensions
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const docWidth = Math.max(
      document.body.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.clientWidth,
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth
    );
    
    setDocumentHeight(docHeight);
    setDocumentWidth(docWidth);
    
    console.log('Resize - New document dimensions:', docWidth, 'x', docHeight);
    
    if (splineRef.current) {
      const bounds = splineRef.current.getBoundingClientRect();
      setSplineBounds(bounds);
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Handle scroll events to update cursor position
  const handleScroll = useCallback(() => {
    // Force cursor position update on scroll
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    
    // Initial Spline detection
    detectSplineCanvas();
    
    // Retry detection after delays
    const retryTimer = setTimeout(detectSplineCanvas, 1000);
    const retryTimer2 = setTimeout(detectSplineCanvas, 2000);
    const retryTimer3 = setTimeout(detectSplineCanvas, 3000);

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle window focus/blur for cursor visibility
    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    setIsVisible(true);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      clearTimeout(retryTimer);
      clearTimeout(retryTimer2);
      clearTimeout(retryTimer3);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldRender, updateMousePosition, handleMouseOver, handleMouseEnter, handleMouseLeave, handleResize, detectSplineCanvas, handleMouseMove, handleScroll]);

  if (!shouldRender) return null;

  return (
    <>
      {/* FIXED: Container sized to full document, not just viewport */}
      <div 
        className={`absolute top-0 left-0 pointer-events-none z-[9999] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          width: `${documentWidth}px`,
          height: `${documentHeight}px`,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {/* Main cursor */}
        <motion.div
          className="absolute w-4 h-4 bg-blue-500 rounded-full mix-blend-difference"
          style={{
            x: springX,
            y: springY,
            translateX: -8,
            translateY: -8,
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
        />
        
        {/* Trailing cursor */}
        <motion.div
          className="absolute w-8 h-8 border-2 border-blue-500/50 rounded-full"
          style={{
            x: trailX,
            y: trailY,
            translateX: -16,
            translateY: -16,
          }}
          animate={{
            scale: isHovering ? 1.2 : 1,
            opacity: isHovering ? 0.8 : 0.5,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.8,
          }}
        />
        
        {/* Optimized quantum particles */}
        <motion.div
          className="absolute"
          style={{
            x: springX,
            y: springY,
            translateX: -2,
            translateY: -2,
          }}
        >
          {isHovering && Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                x: [0, (Math.random() - 0.5) * 40],
                y: [0, (Math.random() - 0.5) * 40],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
                repeatDelay: 0.5,
              }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default AnimatedCursor;