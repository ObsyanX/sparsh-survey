
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
    // Further cap DPR for better performance
    dpr: isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.2),
    // Use demand frameloop for better performance
    frameloop: 'demand' as const,
    // Performance mode for mobile
    performance: {
      current: 1,
      min: 0.5,
      max: 1,
      debounce: 200,
    },
    // Optimized GL settings
    gl: {
      antialias: !isMobile, // Disable antialias on mobile for performance
      powerPreference: 'high-performance' as const,
      alpha: true,
      stencil: false, // Disable stencil buffer for performance
      depth: true,
      // Additional mobile optimizations
      ...(isMobile && {
        precision: 'mediump' as const,
        logarithmicDepthBuffer: false,
        preserveDrawingBuffer: false,
      })
    },
    camera: camera || { position: [0, 0, 5], fov: 60 },
  }), [isMobile, camera]);

  return (
    <Canvas
      {...canvasConfig}
      style={{ 
        background: 'transparent', 
        contain: 'layout style paint',
        willChange: 'transform',
        ...style 
      }}
      className={className}
    >
      {children}
    </Canvas>
  );
}
