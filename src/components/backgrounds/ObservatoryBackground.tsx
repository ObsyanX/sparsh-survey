
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

function AnimatedStars(props: any) {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useMemo(() => {
    const sphere = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      sphere[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = radius * Math.cos(phi);
    }
    return [sphere];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={new THREE.Color("#00F5FF")}
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function FloatingDataNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const nodePositions = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      speed: Math.random() * 0.5 + 0.2
    }));
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodePositions.map((pos, index) => (
        <Float key={index} speed={pos.speed} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere position={[pos.x, pos.y, pos.z]} args={[0.3, 16, 16]}>
            <meshPhongMaterial
              color={new THREE.Color("#8B5CF6")}
              transparent
              opacity={0.3}
              emissive={new THREE.Color("#8B5CF6")}
              emissiveIntensity={0.1}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

function PlanetaryRings() {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={ringRef}>
      {[1, 2, 3].map((ring, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
          <torusGeometry args={[8 + index * 3, 0.1, 16, 100]} />
          <meshPhongMaterial
            color={new THREE.Color(index === 0 ? "#00F5FF" : index === 1 ? "#8B5CF6" : "#00FF88")}
            transparent
            opacity={0.2}
            emissive={new THREE.Color(index === 0 ? "#00F5FF" : index === 1 ? "#8B5CF6" : "#00FF88")}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ObservatoryBackground() {
  const { settings } = useTheme();
  
  if (settings.backgroundTexture !== 'starfield') {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          color={new THREE.Color("#ffffff")}
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.3}
          color={new THREE.Color("#00F5FF")}
        />

        {/* Animated elements */}
        <AnimatedStars />
        <FloatingDataNodes />
        <PlanetaryRings />

        {/* Background nebula effect */}
        <Sphere args={[100, 32, 32]}>
          <meshBasicMaterial
            color={new THREE.Color("#0a0e27")}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </Canvas>
    </div>
  );
}
