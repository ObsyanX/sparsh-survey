
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface DataPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  color: string;
}

interface Globe3DProps {
  data?: DataPoint[];
  title?: string;
}

function Globe({ data = [] }: { data: DataPoint[] }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Group>(null);

  const globeColors = useMemo(() => ({
    emissive: new THREE.Color("#001122"),
    atmosphere: new THREE.Color("#00F5FF")
  }), []);
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
    }
  });

  // Convert lat/lng to 3D coordinates
  const convertToVector3 = (lat: number, lng: number, radius: number = 2.1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Create globe texture
  const globeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a dark space-like surface
      const gradient = ctx.createLinearGradient(0, 0, 512, 256);
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(0.5, '#1a1b3d');
      gradient.addColorStop(1, '#0a0e27');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);
      
      // Add some constellation-like dots
      ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      {/* Globe */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          map={globeTexture}
          transparent={true}
          opacity={0.8}
          emissive={globeColors.emissive}
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere args={[2.05, 64, 64]}>
        <meshPhongMaterial
          color={globeColors.atmosphere}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Data Points */}
      <group ref={pointsRef}>
        {data && data.length > 0 && data.map((point) => {
          if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
            return null;
          }
          
          const position = convertToVector3(point.lat, point.lng);
          const pointColor = useMemo(() => new THREE.Color(point.color || '#00F5FF'), [point.color]);
          const whiteColor = useMemo(() => new THREE.Color("#ffffff"), []);
          
          return (
            <Float key={point.id} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
              <group position={[position.x, position.y, position.z]}>
                {/* Data point marker */}
                <Sphere args={[0.05, 16, 16]}>
                  <meshPhongMaterial
                    color={pointColor}
                    emissive={pointColor}
                    emissiveIntensity={0.5}
                  />
                </Sphere>
                
                {/* Value indicator */}
                <Sphere args={[0.02 + (point.value || 0) * 0.001, 16, 16]} position={[0, 0.1, 0]}>
                  <meshPhongMaterial
                    color={whiteColor}
                    transparent={true}
                    opacity={0.7}
                  />
                </Sphere>

                {/* Connection line to surface */}
                <mesh>
                  <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
                  <meshPhongMaterial
                    color={pointColor}
                    emissive={pointColor}
                    emissiveIntensity={0.3}
                    transparent={true}
                    opacity={0.6}
                  />
                </mesh>
              </group>
            </Float>
          );
        })}
      </group>
    </group>
  );
}

export default function Globe3D({ data = [], title = "Global Data Visualization" }: Globe3DProps) {
  // Mock data if none provided
  const defaultData: DataPoint[] = [
    { id: '1', name: 'New York', lat: 40.7128, lng: -74.0060, value: 850, color: '#00F5FF' },
    { id: '2', name: 'London', lat: 51.5074, lng: -0.1278, value: 720, color: '#8B5CF6' },
    { id: '3', name: 'Tokyo', lat: 35.6762, lng: 139.6503, value: 920, color: '#00FF88' },
    { id: '4', name: 'Sydney', lat: -33.8688, lng: 151.2093, value: 650, color: '#FF6B9D' },
    { id: '5', name: 'São Paulo', lat: -23.5505, lng: -46.6333, value: 780, color: '#FFD700' },
    { id: '6', name: 'Mumbai', lat: 19.0760, lng: 72.8777, value: 680, color: '#FF4500' },
    { id: '7', name: 'Cairo', lat: 30.0444, lng: 31.2357, value: 540, color: '#9370DB' },
    { id: '8', name: 'Moscow', lat: 55.7558, lng: 37.6176, value: 620, color: '#00CED1' }
  ];

  const displayData = data && data.length > 0 ? data : defaultData;

  const lightColors = useMemo(() => ({
    directional: new THREE.Color("#ffffff"),
    point: new THREE.Color("#00F5FF"),
    starWhite: new THREE.Color("#ffffff")
  }), []);
  return (
    <Card className="glass p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold gradient-text">{title}</h3>
        <p className="text-muted-foreground text-sm">
          Interactive 3D visualization of geospatial data
        </p>
      </div>

      <div className="relative h-96 w-full rounded-lg overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            color={lightColors.directional}
          />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.5}
            color={lightColors.point}
          />

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
            minDistance={3}
            maxDistance={10}
          />

          {/* Globe */}
          <Globe data={displayData} />

          {/* Background stars */}
          {Array.from({ length: 200 }).map((_, i) => (
            <Sphere
              key={i}
              args={[0.01, 8, 8]}
              position={[
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
              ]}
            >
              <meshBasicMaterial color={lightColors.starWhite} />
            </Sphere>
          ))}
        </Canvas>

        {/* Floating controls overlay */}
        <div className="absolute top-4 left-4 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass px-3 py-2 text-xs"
          >
            <div className="font-semibold mb-1">Controls</div>
            <div className="space-y-1 text-muted-foreground">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>⌨️ Shift+drag to pan</div>
            </div>
          </motion.div>
        </div>

        {/* Data legend */}
        <div className="absolute bottom-4 right-4 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass px-3 py-2 text-xs max-w-48"
          >
            <div className="font-semibold mb-2">Data Points</div>
            <div className="space-y-1">
              {displayData && displayData.slice(0, 4).map((point) => (
                <div key={point.id} className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: point.color }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {point.name}: {point.value}
                  </span>
                </div>
              ))}
              {displayData && displayData.length > 4 && (
                <div className="text-muted-foreground">
                  +{displayData.length - 4} more locations
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{displayData?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Locations</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-quantum-purple">
            {displayData && displayData.length > 0 
              ? Math.round(displayData.reduce((sum, d) => sum + (d.value || 0), 0) / displayData.length)
              : 0
            }
          </div>
          <div className="text-xs text-muted-foreground">Avg Value</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-quantum-green">
            {displayData && displayData.length > 0 
              ? Math.max(...displayData.map(d => d.value || 0))
              : 0
            }
          </div>
          <div className="text-xs text-muted-foreground">Max Value</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-destructive">
            {displayData && displayData.length > 0 
              ? Math.min(...displayData.map(d => d.value || 0))
              : 0
            }
          </div>
          <div className="text-xs text-muted-foreground">Min Value</div>
        </div>
      </div>
    </Card>
  );
}
