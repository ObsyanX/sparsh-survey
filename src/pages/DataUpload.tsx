
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCheck, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';

export default function DataUpload() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-full glass"
            >
              <Upload className="w-5 h-5 text-quantum-green" />
              <span className="text-sm font-medium">Data Intake Chamber • Status: Ready</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold gradient-text">
              Data Intake Portal
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your datasets to begin the analysis journey. Our quantum processors 
              will validate and prepare your data for exploration.
            </p>
          </div>

          {/* Upload Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FileUpload onFileUpload={(file) => console.log('File uploaded:', file)} />
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-quantum-green/20 to-quantum-green/5 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-quantum-green" />
                </div>
                <h3 className="font-semibold">Smart Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic data quality checks and format validation
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Instant Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast data ingestion and preprocessing
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-quantum-purple/20 to-quantum-purple/5 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-quantum-purple" />
                </div>
                <h3 className="font-semibold">Secure Transfer</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade encryption and data protection
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
