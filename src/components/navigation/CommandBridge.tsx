
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BarChart3, FileText, MessageCircle, Settings, Zap, Globe, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ModuleRoom {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  glowColor: string;
}

interface CommandBridgeProps {
  activeModule: string;
  onModuleSelect: (moduleId: string) => void;
  availableModules?: string[];
}

const moduleRooms: ModuleRoom[] = [
  {
    id: 'upload',
    name: 'Data Hub',
    icon: <Database className="w-6 h-6" />,
    description: 'Upload and validate datasets',
    color: 'from-primary/20 to-primary/5',
    glowColor: 'shadow-primary/20'
  },
  {
    id: 'timeline',
    name: 'Processing Core',
    icon: <Zap className="w-6 h-6" />,
    description: 'Clean and transform data',
    color: 'from-quantum-purple/20 to-quantum-purple/5',
    glowColor: 'shadow-quantum-purple/20'
  },
  {
    id: 'insights',
    name: 'Visualization Chamber',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Generate interactive charts',
    color: 'from-quantum-green/20 to-quantum-green/5',
    glowColor: 'shadow-quantum-green/20'
  },
  {
    id: 'intelligence',
    name: 'AI Observatory',
    icon: <Brain className="w-6 h-6" />,
    description: 'Intelligence and analysis engine',
    color: 'from-destructive/20 to-destructive/5',
    glowColor: 'shadow-destructive/20'
  },
  {
    id: 'story',
    name: 'Narrative Studio',
    icon: <FileText className="w-6 h-6" />,
    description: 'Build data stories',
    color: 'from-yellow-500/20 to-yellow-500/5',
    glowColor: 'shadow-yellow-500/20'
  },
  {
    id: 'simulator',
    name: 'Command Simulator',
    icon: <Settings className="w-6 h-6" />,
    description: 'Run scenario analysis',
    color: 'from-orange-500/20 to-orange-500/5',
    glowColor: 'shadow-orange-500/20'
  },
  {
    id: '3d',
    name: 'Holographic Globe',
    icon: <Globe className="w-6 h-6" />,
    description: 'Explore 3D visualizations',
    color: 'from-cyan-500/20 to-cyan-500/5',
    glowColor: 'shadow-cyan-500/20'
  },
  {
    id: 'chat',
    name: 'Communication Bay',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'AI assistant interface',
    color: 'from-pink-500/20 to-pink-500/5',
    glowColor: 'shadow-pink-500/20'
  }
];

export default function CommandBridge({ activeModule, onModuleSelect, availableModules }: CommandBridgeProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const filteredModules = moduleRooms.filter(module => 
    !availableModules || availableModules.includes(module.id)
  );

  return (
    <div className="relative">
      {/* Command Bridge Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold gradient-text mb-2"
        >
          DATA OBSERVATORY COMMAND BRIDGE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm"
        >
          Navigate between holographic workspaces
        </motion.p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {filteredModules.map((module, index) => {
          const isActive = activeModule === module.id;
          const isHovered = hoveredModule === module.id;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateY: 0,
                rotateX: isHovered ? -5 : 0
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                rotateX: -5,
                z: 50
              }}
              className="relative perspective-1000"
            >
              <Card
                className={`
                  glass p-6 cursor-pointer transition-all duration-500 relative overflow-hidden group
                  ${isActive 
                    ? `bg-gradient-to-br ${module.color} border-2 border-current quantum-glow ${module.glowColor}` 
                    : 'hover:border-border/50'
                  }
                  ${isHovered ? 'shadow-2xl' : ''}
                `}
                onClick={() => onModuleSelect(module.id)}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Holographic scan lines effect */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  bg-gradient-to-b from-transparent via-current/5 to-transparent
                  animate-pulse
                `} />

                {/* Content */}
                <div className="relative z-10 text-center space-y-3">
                  <motion.div
                    animate={{ 
                      rotateY: isActive ? 360 : 0,
                      scale: isHovered ? 1.2 : 1
                    }}
                    transition={{ duration: 0.6 }}
                    className={`
                      p-3 rounded-lg mx-auto w-fit
                      bg-gradient-to-br ${module.color}
                      ${isActive ? 'quantum-glow' : ''}
                    `}
                  >
                    {module.icon}
                  </motion.div>

                  <div>
                    <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'gradient-text' : ''}`}>
                      {module.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full quantum-glow"
                    />
                  )}
                </AnimatePresence>

                {/* Hover particles */}
                <AnimatePresence>
                  {isHovered && (
                    <>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ 
                            opacity: 0, 
                            scale: 0,
                            x: '50%',
                            y: '50%'
                          }}
                          animate={{ 
                            opacity: [0, 1, 0], 
                            scale: [0, 1, 0],
                            x: `${50 + (Math.random() - 0.5) * 200}%`,
                            y: `${50 + (Math.random() - 0.5) * 200}%`
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="absolute w-1 h-1 bg-primary rounded-full pointer-events-none"
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Status Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <Card className="glass inline-block px-6 py-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-quantum-green rounded-full animate-pulse" />
            <span className="text-muted-foreground">
              Observatory Status: <span className="text-quantum-green font-semibold">OPERATIONAL</span>
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
