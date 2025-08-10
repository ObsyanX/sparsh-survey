import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { uploadDataset } from '@/lib/api';

interface FileUploadProps {
  onUploaded?: (result: { dataset_id: string; filename: string; preview: any[] }) => void;
}

export default function FileUpload({ onUploaded }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploadStatus('uploading');
    setUploadedFile(file);
    try {
      const result = await uploadDataset(file);
      setUploadStatus('success');
      onUploaded?.(result);
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadedFile(null);
      }, 1500);
    } catch (e) {
      setUploadStatus('error');
    }
  }, [onUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card
        {...getRootProps()}
        className={`
          glass relative p-8 cursor-pointer transition-all duration-300 border-2 border-dashed
          ${isDragActive 
            ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 quantum-glow' 
            : 'border-border/50 hover:border-primary/50 quantum-glow-hover'
          }
          ${uploadStatus === 'success' ? 'border-quantum-green bg-gradient-to-br from-quantum-green/20 to-quantum-green/5' : ''}
          ${uploadStatus === 'error' ? 'border-destructive bg-gradient-to-br from-destructive/20 to-destructive/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Particle effect container */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <AnimatePresence>
            {isDragActive && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 4 + 2}px`,
                      height: `${Math.random() * 4 + 2}px`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-center space-y-4">
          <AnimatePresence mode="wait">
            {uploadStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                <motion.div
                  animate={{ 
                    y: isDragActive ? -10 : 0,
                    scale: isDragActive ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.2 }}
                  className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ${isDragActive ? 'quantum-glow' : ''}`}
                >
                  <Upload className="w-8 h-8 text-primary" />
                </motion.div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isDragActive ? 'Drop your dataset here' : 'Upload Survey Dataset'}
                  </h3>
                  <p className="text-muted-foreground">
                    Drag & drop your CSV or Excel file, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports .csv, .xlsx, .xls files
                  </p>
                </div>
              </motion.div>
            )}

            {uploadStatus === 'uploading' && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center quantum-glow"
                >
                  <FileSpreadsheet className="w-8 h-8 text-primary" />
                </motion.div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processing Dataset</h3>
                  <p className="text-muted-foreground">
                    Analyzing {uploadedFile?.name}...
                  </p>
                  <div className="mt-4 w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-quantum-purple h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {uploadStatus === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-quantum-green/20 to-quantum-green/5 flex items-center justify-center"
                  style={{ boxShadow: '0 0 30px hsl(var(--quantum-green) / 0.3)' }}
                >
                  <CheckCircle className="w-8 h-8 text-quantum-green" />
                </motion.div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-quantum-green">Upload Successful!</h3>
                  <p className="text-muted-foreground">
                    {uploadedFile?.name} has been processed successfully
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}