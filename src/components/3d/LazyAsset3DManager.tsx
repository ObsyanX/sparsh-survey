
import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Asset3DManager = lazy(() => import('@/components/3d/Asset3DManager'));

interface LazyAsset3DManagerProps {
  assets?: any[];
  onAssetUpdate?: (asset: any) => void;
  className?: string;
}

export default function LazyAsset3DManager({ assets = [], ...props }: LazyAsset3DManagerProps) {
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
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={props.className}>
      {shouldLoad ? (
        <Suspense fallback={<Asset3DManagerSkeleton />}>
          <Asset3DManager assets={assets} {...props} />
        </Suspense>
      ) : (
        <Asset3DManagerSkeleton />
      )}
    </div>
  );
}

function Asset3DManagerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-lg overflow-hidden">
        <div className="h-96 relative bg-gradient-to-br from-background/50 to-transparent">
          <Skeleton className="absolute top-4 left-4 w-32 h-20" />
          <div className="flex justify-center items-center h-full">
            <Skeleton className="w-24 h-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="glass p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="w-32 h-6 mb-2" />
            <Skeleton className="w-48 h-4" />
          </div>
          <Skeleton className="w-24 h-8" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <div>
                  <Skeleton className="w-32 h-4 mb-1" />
                  <Skeleton className="w-48 h-3" />
                </div>
              </div>
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
