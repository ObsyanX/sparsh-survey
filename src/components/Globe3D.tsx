
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

function Globe({ data }: { data: any[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Generate data points on sphere surface
  const dataPoints = useMemo(() => {
    const points = new Float32Array(data.length * 3);
    const colors = new Float32Array(data.length * 3);
    
    data.forEach((item, i) => {
      const phi = Math.acos(-1 + (2 * i) / data.length);
      const theta = Math.sqrt(data.length * Math.PI) * phi;
      
      points[i * 3] = Math.cos(theta) * Math.sin(phi) * 2;
      points[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 2;
      points[i * 3 + 2] = Math.cos(phi) * 2;
      
      // Color based on data value (assuming numeric data)
      const value = typeof item === 'object' ? Object.values(item)[0] : item;
      const normalizedValue = typeof value === 'number' ? Math.min(value / 100, 1) : 0.5;
      
      colors[i * 3] = normalizedValue; // Red
      colors[i * 3 + 1] = 0.3; // Green
      colors[i * 3 + 2] = 1 - normalizedValue; // Blue
    });
    
    return { points, colors };
  }, [data]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 32, 32]}>
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

      {/* Floating data indicators */}
      {data.slice(0, 5).map((_, index) => (
        <Float
          key={index}
          speed={1 + index * 0.2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Sphere
            args={[0.05, 8, 8]}
            position={[
              Math.sin(index * 1.2) * 3,
              Math.cos(index * 1.5) * 3,
              Math.sin(index * 0.8) * 3
            ]}
          >
            <meshStandardMaterial
              color="#00F5FF"
              emissive="#00F5FF"
              emissiveIntensity={0.3}
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
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      value: Math.random() * 100,
      category: `Item ${i}`
    }));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${className}`}
    >
      <Card className="glass p-0 overflow-hidden">
        <div className="relative h-96">
          <Canvas
            camera={{ position: [5, 2, 5], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
            />
            <pointLight
              position={[-10, -10, -5]}
              intensity={0.5}
              color="#00F5FF"
            />

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              zoomSpeed={0.6}
              rotateSpeed={0.4}
              minDistance={3}
              maxDistance={15}
            />

            <Globe data={sampleData} />
          </Canvas>

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
