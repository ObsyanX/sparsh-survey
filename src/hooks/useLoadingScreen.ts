import { useState, useCallback } from 'react';

interface LoadingState {
  isVisible: boolean;
  message: string;
  progress?: number;
}

export const useLoadingScreen = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isVisible: false,
    message: 'Loading...'
  });

  const showLoading = useCallback((message: string = 'Loading...') => {
    setLoadingState({
      isVisible: true,
      message
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }));
  }, []);

  const startProgressLoading = useCallback((message: string = 'Loading...') => {
    setLoadingState({
      isVisible: true,
      message,
      progress: 0
    });
  }, []);

  return {
    loadingState,
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage,
    startProgressLoading
  };
};
