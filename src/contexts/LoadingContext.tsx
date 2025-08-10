import React, { createContext, useContext, ReactNode,useEffect } from 'react';
import { useLoadingScreen } from '@/hooks/useLoadingScreen';
import LoadingScreen from '@/components/LoadingScreen';
const preventScroll = (lock: boolean) => {
  const body = document.body;
  if (lock) {
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
  } else {
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
  }
};
interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
  startProgressLoading: (message?: string) => void;
  loadingState: {
    isVisible: boolean;
    message: string;
    progress?: number;
  };
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
const loadingHook = useLoadingScreen();
useEffect(() => {
  preventScroll(loadingHook.loadingState.isVisible);
}, [loadingHook.loadingState.isVisible]);
  return (
    <LoadingContext.Provider value={loadingHook}>
      {children}
      <LoadingScreen
        isVisible={loadingHook.loadingState.isVisible}
        message={loadingHook.loadingState.message}
        progress={loadingHook.loadingState.progress}
      />
    </LoadingContext.Provider>
  );
};
