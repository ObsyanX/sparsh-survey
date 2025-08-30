import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars(props: any) {
  const ref = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  
  const [sphere] = useMemo(() => {
    const sphere = new Float32Array(1500); // Reduced point count for better performance
    for (let i = 0; i < 1500; i += 3) {
      const radius = Math.random() * 25 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      sphere[i] = radius * Math.sin(phi) * Math.cos(theta);
      sphere[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      sphere[i + 2] = radius * Math.cos(phi);
    }
    return [sphere];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Throttle frame updates for better performance
      frameCount.current++;
      if (frameCount.current % 2 === 0) { // Update every other frame
        ref.current.rotation.x -= delta / 15; // Slower rotation
        ref.current.rotation.y -= delta / 20; // Slower rotation
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00F5FF"
          size={0.03} // Smaller points for better performance
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function StarField() {
  return (
    <div className="fixed inset-0 -z-10" style={{ contain: 'layout style paint' }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ 
          alpha: true, 
          antialias: false, // Disable for better performance
          powerPreference: 'high-performance',
          stencil: false,
          depth: false
        }}
        dpr={Math.min(window.devicePixelRatio || 1, 1.5)} // Cap DPR for performance
        frameloop="demand" // Use demand frameloop for better performance
        style={{ background: 'transparent' }}
      >
        <Stars />
      </Canvas>
    </div>
  );
}