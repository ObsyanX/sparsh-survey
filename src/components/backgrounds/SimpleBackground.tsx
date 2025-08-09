import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Spline from '@splinetool/react-spline';
import { usePerformance } from '@/hooks/usePerformance';

export default function SimpleBackground() {
  const { settings } = useTheme();
  const { isLowPerformance, shouldReduceAnimations } = usePerformance();
  const splineRef = useRef<HTMLDivElement>(null);

  if (settings.backgroundTexture !== 'starfield') return null;

  return (
    <div
      ref={splineRef}
      className="will-change-transform gpu-accelerated"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        willChange: "transform",
        transform: "translateZ(0)"
      }}
    >
      <Spline 
        scene="https://prod.spline.design/Lws6iY4vBNT0NXoF/scene.splinecode"
        style={{ 
          width: '100%', 
          height: '100%',
          willChange: "transform",
          transform: "translateZ(0)"
        }}
      />
    </div>
  );
  //   <div className="fixed inset-0 -z-10">
  //     {/* CSS-only starfield effect */}
  //     <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900">
  //       {/* Animated stars using CSS */}
  //       <div className="stars absolute inset-0">
  //         {Array.from({ length: 100 }).map((_, i) => (
  //           <div
  //             key={i}
  //             className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
  //             style={{
  //               left: `${Math.random() * 100}%`,
  //               top: `${Math.random() * 100}%`,
  //               animationDelay: `${Math.random() * 3}s`,
  //               animationDuration: `${2 + Math.random() * 2}s`,
  //             }}
  //           />
  //         ))}
  //       </div>
        
  //       {/* Floating particles */}
  //       <div className="particles absolute inset-0">
  //         {Array.from({ length: 20 }).map((_, i) => (
  //           <div
  //             key={i}
  //             className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float"
  //             style={{
  //               left: `${Math.random() * 100}%`,
  //               top: `${Math.random() * 100}%`,
  //               animationDelay: `${Math.random() * 5}s`,
  //               animationDuration: `${4 + Math.random() * 3}s`,
  //             }}
  //           />
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}