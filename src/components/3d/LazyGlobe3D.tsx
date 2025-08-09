
import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the heavy 3D component
const Globe3D = lazy(() => import('@/components/Globe3D'));

interface LazyGlobe3DProps {
  data?: any[];
  className?: string;
}

export default function LazyGlobe3D({ data, className }: LazyGlobe3DProps) {
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Delay loading slightly for smoother experience
          setTimeout(() => setShouldLoad(true), 100);
        } else {
          setIsInView(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <Suspense fallback={<Globe3DSkeleton />}>
          <Globe3D data={data} className={className} />
        </Suspense>
      ) : (
        <Globe3DSkeleton />
      )}
    </div>
  );
}

function Globe3DSkeleton() {
  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="h-96 relative bg-gradient-to-br from-background/50 to-transparent">
        <div className="absolute inset-4">
          <Skeleton className="w-full h-8 mb-4" />
          <div className="flex justify-center items-center h-full">
            <div className="w-48 h-48 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
