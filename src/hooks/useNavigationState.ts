
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationState {
  previousRoute: string | null;
  scrollPosition: { [path: string]: number };
  pageState: { [path: string]: any };
  transitionDirection: 'forward' | 'backward' | null;
}

export function useNavigationState() {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    previousRoute: null,
    scrollPosition: {},
    pageState: {},
    transitionDirection: null
  });

  // Save scroll position when leaving a page
  useEffect(() => {
    const saveScrollPosition = () => {
      setNavigationState(prev => ({
        ...prev,
        scrollPosition: {
          ...prev.scrollPosition,
          [location.pathname]: window.scrollY
        }
      }));
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    
    return () => {
      saveScrollPosition();
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location.pathname]);

  // Restore scroll position when entering a page
  useEffect(() => {
    const savedPosition = navigationState.scrollPosition[location.pathname];
    if (savedPosition !== undefined) {
      // Smooth scroll to saved position
      window.scrollTo({
        top: savedPosition,
        behavior: 'smooth'
      });
    }
  }, [location.pathname, navigationState.scrollPosition]);

  // Track navigation direction
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      previousRoute: prev.previousRoute || location.pathname,
      transitionDirection: determineDirection(prev.previousRoute, location.pathname)
    }));
  }, [location.pathname]);

  const determineDirection = (from: string | null, to: string): 'forward' | 'backward' | null => {
    if (!from) return null;
    
    const routes = ['/', '/upload', '/cleaning', '/visualize', '/explorer', '/chat', '/reports', '/models'];
    const fromIndex = routes.indexOf(from);
    const toIndex = routes.indexOf(to);
    
    if (fromIndex === -1 || toIndex === -1) return null;
    
    return toIndex > fromIndex ? 'forward' : 'backward';
  };

  const savePageState = (state: any) => {
    setNavigationState(prev => ({
      ...prev,
      pageState: {
        ...prev.pageState,
        [location.pathname]: state
      }
    }));
  };

  const getPageState = (path?: string) => {
    const targetPath = path || location.pathname;
    return navigationState.pageState[targetPath];
  };

  const navigateWithState = (path: string, state?: any) => {
    if (state) {
      setNavigationState(prev => ({
        ...prev,
        pageState: {
          ...prev.pageState,
          [path]: state
        }
      }));
    }
    navigate(path);
  };

  return {
    ...navigationState,
    savePageState,
    getPageState,
    navigateWithState
  };
}
