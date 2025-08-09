import { useEffect, useRef } from 'react';

interface SmoothScrollOptions {
  duration?: number;
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
  offset?: number;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const { duration = 800, easing = 'easeInOut', offset = 0 } = options;
  const isScrolling = useRef(false);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const easeInCubic = (t: number): number => t * t * t;
  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

  const getEasingFunction = (type: string) => {
    switch (type) {
      case 'easeIn':
        return easeInCubic;
      case 'easeOut':
        return easeOutCubic;
      case 'linear':
        return (t: number) => t;
      default:
        return easeInOutCubic;
    }
  };

  const scrollTo = (target: number | string | Element) => {
    if (isScrolling.current) return;

    let targetPosition: number;
    
    if (typeof target === 'number') {
      targetPosition = target;
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) return;
      targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    } else {
      targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    }

    targetPosition += offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const easingFunction = getEasingFunction(easing);
    
    if (distance === 0) return;

    isScrolling.current = true;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunction(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isScrolling.current = false;
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollToTop = () => scrollTo(0);
  const scrollToBottom = () => scrollTo(document.documentElement.scrollHeight);

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
    isScrolling: isScrolling.current
  };
};
