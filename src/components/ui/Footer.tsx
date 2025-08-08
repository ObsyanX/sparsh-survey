
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Brain, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe,
  Mail,
  MessageCircle,
  Github,
  Twitter,
  Linkedin,
  ArrowUp,
  Cpu,
  Activity
} from 'lucide-react';
import { Button } from './button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-border/30">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-quantum-surface/20" />
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Observatory Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-quantum-purple flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Data Observatory</h3>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              Advanced AI-powered survey data analysis platform orbiting in the quantum realm. 
              Transform raw data into actionable insights with cutting-edge technology.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="glass p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-3 h-3 text-quantum-green" />
                  <span className="text-muted-foreground">Status</span>
                </div>
                <div className="text-quantum-green font-mono">Operational</div>
              </div>
              <div className="glass p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Cpu className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">Uptime</span>
                </div>
                <div className="text-primary font-mono">99.9%</div>
              </div>
            </div>
          </motion.div>

          {/* Platform Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="font-semibold text-foreground">Platform Capabilities</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Brain className="w-4 h-4 text-quantum-purple" />
                <span className="text-muted-foreground">Multi-Agent AI Analysis</span>
              </li>
              <li className="flex items-center space-x-3">
                <BarChart3 className="w-4 h-4 text-quantum-green" />
                <span className="text-muted-foreground">3D Data Visualization</span>
              </li>
              <li className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground">Real-time Processing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Quantum Security</span>
              </li>
              <li className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-muted-foreground">Global Data Sources</span>
              </li>
            </ul>
          </motion.div>

          {/* System Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="font-semibold text-foreground">System Metrics</h4>
            <div className="space-y-4">
              <div className="glass p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Datasets Processed</span>
                  <span className="text-sm font-mono text-primary">2.4M+</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-full">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-quantum-purple rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="glass p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">AI Insights Generated</span>
                  <span className="text-sm font-mono text-quantum-green">847K+</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-full">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-quantum-green to-quantum-purple rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 2, delay: 0.7 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-mono text-primary">15ms</div>
                  <div className="text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-quantum-purple">24/7</div>
                  <div className="text-muted-foreground">Monitoring</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact & Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h4 className="font-semibold text-foreground">Mission Control</h4>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start space-x-2 glass"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Observatory</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start space-x-2 glass"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Support Channel</span>
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Connect with the Observatory</p>
              <div className="flex space-x-3">
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 quantum-glow-hover">
                  <Github className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 quantum-glow-hover">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 quantum-glow-hover">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="glass p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Observatory Location</p>
              <p className="text-xs font-mono text-primary">Orbital Sector 7-Alpha</p>
              <p className="text-xs text-muted-foreground">Quantum Data Sphere</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <span>© {currentYear} Data Observatory Platform</span>
            <span>•</span>
            <span>Quantum Computing Division</span>
            <span>•</span>
            <span>Version 3.1.4-Alpha</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">
              Powered by <span className="text-primary">Quantum AI</span>
            </div>
            <Button 
              onClick={scrollToTop}
              size="sm" 
              className="w-8 h-8 p-0 rounded-full quantum-glow-hover"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
