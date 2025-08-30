
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import OptimizedCanvas from '@/components/3d/OptimizedCanvas';

function Globe({ data }: { data: any[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const [isActive, setIsActive] = useState(true);
  const frameCount = useRef(0);

  // Pause animation when not in view
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Generate data points on sphere surface
  const dataPoints = useMemo(() => {
    const points = new Float32Array(Math.min(data.length, 50) * 3); // Further reduced for performance
    const colors = new Float32Array(Math.min(data.length, 50) * 3);
    
    const pointCount = Math.min(data.length, 50);
    
    for (let i = 0; i < pointCount; i++) {
      const item = data[i] || {};
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      
      points[i * 3] = Math.cos(theta) * Math.sin(phi) * 2;
      points[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 2;
      points[i * 3 + 2] = Math.cos(phi) * 2;
      
      // Color based on data value (assuming numeric data)
      const value = typeof item === 'object' ? Object.values(item)[0] : item;
      const normalizedValue = typeof value === 'number' ? Math.min(value / 100, 1) : 0.5;
      
      colors[i * 3] = normalizedValue; // Red
      colors[i * 3 + 1] = 0.3; // Green
      colors[i * 3 + 2] = 1 - normalizedValue; // Blue
    }
    
    return { points, colors };
  }, [data]);

  useFrame((state, delta) => {
    if (!isActive) return;
    
    // Throttle frame updates for better performance
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return; // Skip every other frame
    
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slower rotation
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2; // Slower rotation
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 12, 12]}> {/* Reduced geometry complexity */}
        <meshPhongMaterial
          color="#001122"
          transparent
          opacity={0.1}
          wireframe={true}
        />
      </Sphere>

      {/* Data points */}
      {dataPoints.points.length > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={dataPoints.points.length / 3}
              array={dataPoints.points}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={dataPoints.colors.length / 3}
              array={dataPoints.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}

      {/* Reduced floating indicators for performance */}
      {data.slice(0, 2).map((_, index) => ( // Further reduced
        <Float
          key={index}
          speed={0.5 + index * 0.1} // Slower animation
          rotationIntensity={0.2} // Reduced intensity
          floatIntensity={0.2} // Reduced intensity
        >
          <Sphere
            args={[0.05, 4, 4]} // Reduced geometry complexity
            position={[
              Math.sin(index * 1.2) * 3,
              Math.cos(index * 1.5) * 3,
              Math.sin(index * 0.8) * 3
            ]}
          >
            <meshStandardMaterial
              color="#00F5FF"
              emissive="#00F5FF"
              emissiveIntensity={0.2}
              transparent
              opacity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

interface Globe3DProps {
  data?: any[];
  className?: string;
}

export default function Globe3D({ data = [], className = '' }: Globe3DProps) {
  // Default sample data if none provided
  const sampleData = useMemo(() => {
    if (data.length > 0) return data;
    return Array.from({ length: 20 }, (_, i) => ({ // Further reduced for performance
      id: i,
      value: Math.random() * 100,
      category: `Item ${i}`
    }));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
    >
      <Card className="glass p-0 overflow-hidden">
        <div className="relative h-96">
          <OptimizedCanvas camera={{ position: [5, 2, 5], fov: 60 }} style={{ contain: 'layout style paint' }}>
            <ambientLight intensity={0.3} /> {/* Reduced intensity */}
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.6} // Reduced intensity
              castShadow={false} // Disable shadows for performance
            />
            <pointLight
              position={[-10, -10, -5]}
              intensity={0.2} // Reduced intensity
              color="#00F5FF"
            />

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              zoomSpeed={0.4} // Slower for smoother performance
              rotateSpeed={0.3} // Slower for smoother performance
              minDistance={3}
              maxDistance={15}
              enableDamping={true}
              dampingFactor={0.08} // Increased damping for smoother motion
            />

            <Globe data={sampleData} />
          </OptimizedCanvas>

          {/* Overlay info */}
          <div className="absolute top-4 left-4">
            <Card className="glass p-3">
              <div className="text-xs font-semibold mb-1">3D Data Globe</div>
              <div className="text-xs text-muted-foreground">
                {sampleData.length} data points
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
