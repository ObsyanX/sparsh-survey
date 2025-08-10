
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCheck, Zap, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import { createSchemaMap, cleanDataset, analyzeDataset } from '@/lib/api';
import { useLoading } from '@/contexts/LoadingContext';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/ui/Footer';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  message?: string;
}

export default function DataUpload() {
  const [dataset, setDataset] = useState<{ id: string; filename: string; preview: any[] } | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { showLoading, hideLoading, updateProgress, updateMessage, startProgressLoading } = useLoading();

  // Get the base URL for constructing report URLs
  const getBaseUrl = () => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';
    return apiBase.replace('/api', '');
  };

  const initializeProcessingSteps = () => {
    return [
      { id: 'mapping', name: 'Saving Schema Mapping', status: 'pending' as const },
      { id: 'cleaning', name: 'Cleaning Dataset', status: 'pending' as const },
      { id: 'analysis', name: 'Analyzing & Generating Report', status: 'pending' as const }
    ];
  };

  const updateStepStatus = (stepId: string, status: ProcessingStep['status'], message?: string) => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message }
        : step
    ));
  };

  const handleUploaded = async (res: { dataset_id: string; filename: string; preview: any[] }) => {
    setDataset({ id: res.dataset_id, filename: res.filename, preview: res.preview });
    setErrorMessage(null);
    setLastResult(null);
    setCurrentStep(0);
    
    // Initialize processing steps
    const steps = initializeProcessingSteps();
    setProcessingSteps(steps);
    
    // Auto-run: mapping -> cleaning -> analysis
    try {
      console.log('Starting auto-processing for dataset:', res.dataset_id);
      startProgressLoading('Initializing data processing...');
      
      // Step 1: Schema mapping
      setCurrentStep(0);
      updateMessage('Saving schema mapping...');
      updateProgress(10);
      updateStepStatus('mapping', 'processing', 'Creating 1:1 column mapping...');
      
      const rawCols = Object.keys(res.preview[0] || {});
      const mapping = rawCols.reduce((acc: any, c: string) => { acc[c] = c; return acc; }, {});
      console.log('Mapping:', mapping);
      
      const schemaResult = await createSchemaMap(res.dataset_id, mapping);
      console.log('Schema mapping result:', schemaResult);
      updateStepStatus('mapping', 'completed', 'Schema mapping saved successfully');

      // Step 2: Data cleaning
      setCurrentStep(1);
      updateMessage('Cleaning dataset...');
      updateProgress(40);
      updateStepStatus('cleaning', 'processing', 'Removing outliers, filling missing values...');
      
      const cleanResult = await cleanDataset(res.dataset_id, { 
        fill_missing: 'median', 
        outlier_method: 'remove', 
        drop_duplicates: true 
      });
      console.log('Cleaning result:', cleanResult);
      updateStepStatus('cleaning', 'completed', `Cleaned ${cleanResult.report?.rows_after || 0} rows`);

      // Step 3: Analysis
      setCurrentStep(2);
      updateMessage('Analyzing and generating report...');
      updateProgress(70);
      updateStepStatus('analysis', 'processing', 'Computing statistics and generating charts...');
      
      const analysis = await analyzeDataset(res.dataset_id);
      console.log('Analysis result:', analysis);
      updateStepStatus('analysis', 'completed', 'Analysis completed successfully');
      
      updateProgress(100);
      updateMessage('Processing completed successfully!');
      setLastResult(analysis);
      console.log('Auto-processing completed successfully');
      
      setTimeout(() => hideLoading(), 1000);
      
    } catch (e: any) {
      console.error('Error during auto-processing:', e);
      const errorMsg = e?.message || e?.toString() || 'Unknown error occurred';
      setErrorMessage(errorMsg);
      
      // Mark current step as error
      if (currentStep < processingSteps.length) {
        const currentStepId = processingSteps[currentStep]?.id;
        if (currentStepId) {
          updateStepStatus(currentStepId, 'error', errorMsg);
        }
      }
      
      setLastResult({ error: errorMsg });
      hideLoading();
    }
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStepStatusColor = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-500';
      case 'processing':
        return 'text-primary';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Theme Toggle */}
      <ThemeToggle />
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

          {/* Error Display */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
            >
              <p className="text-destructive font-medium">Error during processing:</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </motion.div>
          )}

          {/* Upload Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FileUpload onUploaded={handleUploaded} />
          </motion.div>

          {/* Processing Steps */}
          {processingSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-center">Processing Steps</h3>
              <Card className="glass p-6">
                <div className="space-y-4">
                  {processingSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${
                        step.status === 'processing' ? 'border-primary/20 bg-primary/5' :
                        step.status === 'completed' ? 'border-green-200 bg-green-50' :
                        step.status === 'error' ? 'border-red-200 bg-red-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${getStepStatusColor(step)}`}>
                          {step.name}
                        </h4>
                        {step.message && (
                          <p className="text-sm text-muted-foreground">
                            {step.message}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Results Display */}
          {lastResult && !lastResult.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-center">Analysis Results</h3>
              <Card className="glass p-6">
                <div className="space-y-4">
                  {/* Report Download Section */}
                  {lastResult.report_url && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-muted/20 rounded-lg">
                      <Download className="w-5 h-5 text-primary" />
                      <div className="text-center space-y-2">
                        <a 
                          href={`${getBaseUrl()}${lastResult.report_url}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:text-primary/80 underline font-medium"
                        >
                          {lastResult.report_type === 'pdf' ? 'Download PDF Report' : 
                           lastResult.report_type === 'html' ? 'View HTML Report' : 
                           'Download Report'}
                        </a>
                        {lastResult.report_type === 'html' && (
                          <div className="flex flex-col items-center space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Opens in new tab - right-click to save
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = `${getBaseUrl()}${lastResult.report_url}`;
                                link.download = `report_${dataset?.id || 'dataset'}.html`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              Download HTML Report
                            </Button>
                          </div>
                        )}
                        
                        {/* PDF Download Button */}
                        {lastResult.pdf_url && (
                          <div className="flex flex-col items-center space-y-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-muted-foreground">
                              Download PDF version
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = `${getBaseUrl()}/api/analyze/${dataset?.id}/download-pdf`;
                                link.download = `report_${dataset?.id || 'dataset'}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                              Download PDF Report
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Report Error Message */}
                  {lastResult.report_error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 font-medium">Report Generation</p>
                      <p className="text-yellow-700 text-sm">
                        Report generation failed: {lastResult.report_error}
                      </p>
                      <p className="text-yellow-700 text-sm mt-2">
                        Analysis completed successfully. View results below.
                      </p>
                    </div>
                  )}

                  {/* Debug Information */}
                  {lastResult.report_url && (
                    <div className="text-xs text-muted-foreground p-2 bg-gray-50 rounded">
                      <p><strong>Debug Info:</strong></p>
                      <p>Report Type: {lastResult.report_type}</p>
                      <p>Report URL: {lastResult.report_url}</p>
                      <p>PDF URL: {lastResult.pdf_url || 'Not available'}</p>
                      <p>Full URL: {getBaseUrl()}{lastResult.report_url}</p>
                      <p>Report Path: {lastResult.report_path}</p>
                    </div>
                  )}

                  {/* Statistics Summary */}
                  {lastResult.stats && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Statistics Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lastResult.stats.slice(0, 6).map((stat: any, index: number) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium">{stat.variable}</p>
                            <p className="text-xs text-muted-foreground">
                              Mean: {stat.mean?.toFixed(2) || 'N/A'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Charts Summary */}
                  {lastResult.charts_count && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Visualizations Generated</h4>
                      <p className="text-sm text-muted-foreground">
                        {lastResult.charts_count} charts and visualizations were created for the analysis.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Dataset Info */}
          {dataset && (
            <div className="mt-8 space-y-4">
              <Card className="glass p-6">
                <div className="space-y-2 text-sm">
                  <div>Dataset ID: <code>{dataset.id}</code></div>
                  <div>Filename: {dataset.filename}</div>
                  <div>Preview rows: {dataset.preview.length}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        showLoading('Saving schema mapping...');
                        const rawCols = Object.keys(dataset.preview[0] || {});
                        const mapping = rawCols.reduce((acc: any, c: string) => { acc[c] = c; return acc; }, {});
                        const res = await createSchemaMap(dataset.id, mapping);
                        setLastResult(res);
                        hideLoading();
                      } catch (e: any) {
                        setLastResult({ error: String(e?.message || e) });
                        hideLoading();
                      }
                    }}
                  >
                    Save Default Mapping
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        showLoading('Cleaning dataset...');
                        const res = await cleanDataset(dataset.id, { 
                          fill_missing: 'median', 
                          outlier_method: 'remove', 
                          drop_duplicates: true 
                        });
                        setLastResult(res);
                        hideLoading();
                      } catch (e: any) {
                        setLastResult({ error: String(e?.message || e) });
                        hideLoading();
                      }
                    }}
                  >
                    Clean Dataset
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        showLoading('Analyzing and generating report...');
                        const res = await analyzeDataset(dataset.id);
                        setLastResult(res);
                        hideLoading();
                      } catch (e: any) {
                        setLastResult({ error: String(e?.message || e) });
                        hideLoading();
                      }
                    }}
                  >
                    Analyze + Generate Report
                  </Button>
                </div>
              </Card>
            </div>
          )}

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
      <Footer />
    </div>
  );
}
