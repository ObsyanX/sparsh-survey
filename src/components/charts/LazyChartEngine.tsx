
import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChartEngine = lazy(() => import('@/components/charts/ChartEngine'));

interface LazyChartEngineProps {
  dataset?: any[];
  onChartSelect?: (chart: any) => void;
  className?: string;
}

export default function LazyChartEngine(props: LazyChartEngineProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={props.className}>
      {shouldLoad ? (
        <Suspense fallback={<ChartEngineSkeleton />}>
          <ChartEngine {...props} />
        </Suspense>
      ) : (
        <ChartEngineSkeleton />
      )}
    </div>
  );
}

function ChartEngineSkeleton() {
  return (
    <div className="glass p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="w-48 h-6 mb-2" />
          <Skeleton className="w-64 h-4" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-4 border border-border/30 rounded-lg">
            <Skeleton className="w-full h-32 mb-3 rounded" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-full h-3" />
              <div className="flex gap-1">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="w-8 h-6 mx-auto mb-1" />
            <Skeleton className="w-16 h-3 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
