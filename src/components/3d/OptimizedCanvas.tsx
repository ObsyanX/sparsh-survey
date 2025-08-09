
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptimizedCanvasProps {
  children: React.ReactNode;
  camera?: any;
  style?: React.CSSProperties;
  className?: string;
}

export default function OptimizedCanvas({ children, camera, style, className }: OptimizedCanvasProps) {
  const isMobile = useIsMobile();

  const canvasConfig = useMemo(() => ({
    // Cap DPR for performance
    dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    // Demand frameloop for better performance
    frameloop: 'demand' as const,
    // Optimized GL settings
    gl: {
      antialias: !isMobile, // Disable antialias on mobile for performance
      powerPreference: 'high-performance' as const,
      alpha: true,
      // Additional mobile optimizations
      ...(isMobile && {
        precision: 'mediump' as const,
        logarithmicDepthBuffer: false,
      })
    },
    camera: camera || { position: [0, 0, 5], fov: 60 },
  }), [isMobile, camera]);

  return (
    <Canvas
      {...canvasConfig}
      style={{ background: 'transparent', ...style }}
      className={className}
    >
      {children}
    </Canvas>
  );
}
