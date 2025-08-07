
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Upload } from 'lucide-react';

interface Asset3D {
  id: string;
  name: string;
  type: '3d-model' | 'fallback' | 'placeholder';
  url?: string;
  status: 'loading' | 'loaded' | 'error' | 'fallback';
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  metadata?: {
    size?: number;
    lastChecked?: Date;
    renderClass?: string;
    textureAvailable?: boolean;
  };
}

function FallbackModel({ asset }: { asset: Asset3D }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group position={asset.position} scale={asset.scale}>
      {/* Wireframe sphere with particles */}
      <Sphere ref={meshRef} args={[1, 16, 16]}>
        <meshBasicMaterial
          color="#00F5FF"
          wireframe
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      {/* Glowing particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
        >
          <meshBasicMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}

      {/* Loading indicator */}
      <Html center>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass px-3 py-2 text-xs text-center"
        >
          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1" />
          <div>Loading...</div>
          <div className="text-muted-foreground">Intelligent fallback model</div>
        </motion.div>
      </Html>
    </group>
  );
}

function ValidatedModel({ asset }: { asset: Asset3D }) {
  const meshRef = useRef<THREE.Group>(null);

  // Try to load the 3D model
  let model = null;
  try {
    if (asset.url) {
      model = useGLTF(asset.url);
    }
  } catch (error) {
    console.warn(`Failed to load model ${asset.name}:`, error);
  }

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!model || asset.status === 'error') {
    return <FallbackModel asset={asset} />;
  }

  return (
    <group ref={meshRef} position={asset.position} scale={asset.scale} rotation={asset.rotation}>
      <primitive object={model.scene.clone()} />
    </group>
  );
}

interface Asset3DManagerProps {
  assets: Asset3D[];
  onAssetUpdate?: (asset: Asset3D) => void;
  className?: string;
}

export default function Asset3DManager({ assets = [], onAssetUpdate, className = '' }: Asset3DManagerProps) {
  const [assetManifest, setAssetManifest] = useState<Asset3D[]>(assets);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Initialize default assets if none provided
  useEffect(() => {
    if (assets.length === 0) {
      const defaultAssets: Asset3D[] = [
        {
          id: 'kpi-income',
          name: 'Income Indicator',
          type: 'placeholder',
          status: 'loaded',
          position: [-2, 0, 0],
          scale: [0.5, 0.5, 0.5],
          rotation: [0, 0, 0]
        },
        {
          id: 'kpi-employment',
          name: 'Employment Tower',
          type: 'placeholder',
          status: 'loaded',
          position: [0, 0, 0],
          scale: [0.5, 1, 0.5],
          rotation: [0, 0, 0]
        },
        {
          id: 'kpi-education',
          name: 'Education Sphere',
          type: 'placeholder',
          status: 'loaded',
          position: [2, 0, 0],
          scale: [0.7, 0.7, 0.7],
          rotation: [0, 0, 0]
        }
      ];
      setAssetManifest(defaultAssets);
    }
  }, [assets]);

  const validateAsset = async (asset: Asset3D): Promise<Asset3D> => {
    try {
      if (!asset.url) {
        return { ...asset, status: 'fallback' };
      }

      // Simulate asset validation
      const response = await fetch(asset.url, { method: 'HEAD' });
      if (response.ok) {
        return {
          ...asset,
          status: 'loaded',
          metadata: {
            ...asset.metadata,
            size: parseInt(response.headers.get('content-length') || '0'),
            lastChecked: new Date(),
            textureAvailable: true
          }
        };
      } else {
        return { ...asset, status: 'error' };
      }
    } catch (error) {
      return { ...asset, status: 'error' };
    }
  };

  const retryAssetLoad = async (assetId: string) => {
    const asset = assetManifest.find(a => a.id === assetId);
    if (!asset) return;

    setAssetManifest(prev => 
      prev.map(a => a.id === assetId ? { ...a, status: 'loading' } : a)
    );

    const validatedAsset = await validateAsset(asset);
    
    setAssetManifest(prev => 
      prev.map(a => a.id === assetId ? validatedAsset : a)
    );

    onAssetUpdate?.(validatedAsset);
  };

  const getStatusIcon = (status: Asset3D['status']) => {
    switch (status) {
      case 'loaded': return <CheckCircle className="w-4 h-4 text-quantum-green" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'loading': return <RefreshCw className="w-4 h-4 animate-spin text-primary" />;
      case 'fallback': return <AlertTriangle className="w-4 h-4 text-quantum-purple" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 3D Viewport */}
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
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.5}
              rotateSpeed={0.4}
            />

            {/* Render 3D Assets */}
            {assetManifest.map((asset) => (
              <group key={asset.id}>
                {asset.status === 'loaded' || asset.status === 'fallback' ? (
                  <ValidatedModel asset={asset} />
                ) : (
                  <FallbackModel asset={asset} />
                )}
              </group>
            ))}

            {/* Grid floor */}
            <gridHelper args={[10, 10, '#333333', '#333333']} position={[0, -2, 0]} />
          </Canvas>

          {/* Overlay controls */}
          <div className="absolute top-4 left-4">
            <Card className="glass p-3">
              <div className="text-xs font-semibold mb-2">3D Asset Manager</div>
              <div className="space-y-1 text-xs">
                <div>🔄 Drag to rotate</div>
                <div>🔍 Scroll to zoom</div>
                <div>⌨️ Shift+drag to pan</div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Asset Manifest Panel */}
      <Card className="glass p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Asset Manifest</h3>
            <p className="text-sm text-muted-foreground">
              {assetManifest.length} models loaded
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Add Model
          </Button>
        </div>

        <div className="space-y-3">
          {assetManifest.map((asset) => (
            <div
              key={asset.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedAsset === asset.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border/30 hover:border-border/50'
              }`}
              onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(asset.status)}
                  <div>
                    <div className="font-medium text-sm">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {asset.type} • Position: [{asset.position.join(', ')}]
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={asset.status === 'loaded' ? 'default' : 'destructive'}>
                    {asset.status}
                  </Badge>
                  
                  {asset.status === 'error' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        retryAssetLoad(asset.id);
                      }}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {selectedAsset === asset.id && asset.metadata && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-border/30 text-xs space-y-2"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Size:</span> {asset.metadata.size ? `${(asset.metadata.size / 1024).toFixed(1)}KB` : 'Unknown'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Checked:</span> {asset.metadata.lastChecked?.toLocaleTimeString() || 'Never'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Render Class:</span> {asset.metadata.renderClass || 'Default'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Textures:</span> {asset.metadata.textureAvailable ? '✅ Available' : '❌ Missing'}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
