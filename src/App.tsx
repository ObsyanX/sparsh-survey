
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { useState, useEffect, useMemo } from "react";
import AccessibilityFeatures from "@/components/AccessibilityFeatures";
import SettingsPanel from "@/components/SettingsPanel";
import AnimatedCursor from "@/components/ui/AnimatedCursor";
import NavigationCore from "@/components/navigation/NavigationCore";
import CommandPalette from "@/components/navigation/CommandPalette";
import BreadcrumbTrail from "@/components/navigation/BreadcrumbTrail";
import PageTransition from "@/components/layout/PageTransition";
import SimpleBackground from "@/components/backgrounds/SimpleBackground";
import { usePerformance } from "@/hooks/usePerformance";
import Index from "./pages/Index";
import DataUpload from "./pages/DataUpload";
import NotFound from "./pages/NotFound";
import LoadingScreenDemo from "./components/LoadingScreenDemo";

const queryClient = new QueryClient();

const App = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const { isLowPerformance, shouldReduceAnimations } = usePerformance();
  
  // Memoize cursor visibility logic to prevent unnecessary re-renders
  const cursorVisibilityClass = useMemo(() => 
    shouldReduceAnimations ? 'reduce-motion' : '', 
    [shouldReduceAnimations]
  );
  
  useEffect(() => {
    const ensureCursorVisibility = () => {
      // Force hide default cursor everywhere
      document.body.style.cursor = 'none';
      
      // Ensure custom cursor is visible
      const cursorElement = document.querySelector('.animated-cursor') as HTMLElement;
      if (cursorElement) {
        cursorElement.style.opacity = '1';
        cursorElement.style.visibility = 'visible';
        cursorElement.style.zIndex = '9999';
      }
    };

    // Run immediately and after delays
    ensureCursorVisibility();
    const timer1 = setTimeout(ensureCursorVisibility, 100);
    const timer2 = setTimeout(ensureCursorVisibility, 1000);

    // Run on various events
    window.addEventListener('scroll', ensureCursorVisibility, { passive: true });
    window.addEventListener('resize', ensureCursorVisibility, { passive: true });
    window.addEventListener('mousemove', ensureCursorVisibility, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('scroll', ensureCursorVisibility);
      window.removeEventListener('resize', ensureCursorVisibility);
      window.removeEventListener('mousemove', ensureCursorVisibility);
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          <TooltipProvider>
            <AccessibilityFeatures>
              <BrowserRouter>
              <div className={cursorVisibilityClass} style={{ contain: 'layout style' }}>
                {/* Global UI Elements */}
                {!shouldReduceAnimations && <AnimatedCursor />}
                <SimpleBackground />
                <Toaster />
                <Sonner />
                
                {/* Navigation System */}
                {/* <NavigationCore 
                  isCommandPaletteOpen={isCommandPaletteOpen}
                  onCommandPaletteToggle={() => setIsCommandPaletteOpen(!isCommandPaletteOpen)}
                  isVisible={isNavigationVisible}
                  onToggleVisibility={() => setIsNavigationVisible(!isNavigationVisible)}
                /> */}
                <CommandPalette 
                  isOpen={isCommandPaletteOpen}
                  onClose={() => setIsCommandPaletteOpen(false)}
                />
                <BreadcrumbTrail />

                {/* Page Routes with Transitions */}
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/upload" element={<DataUpload />} />
                    <Route path="/loading-demo" element={<LoadingScreenDemo />} />
                    <Route path="/cleaning" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl gradient-text">Data Cleaning Chamber</h1></div>} />
                    <Route path="/visualize" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl gradient-text">Insight Gallery</h1></div>} />
                    <Route path="/explorer" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl gradient-text">3D Data Explorer</h1></div>} />
                    <Route path="/chat" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl gradient-text">AI Chat Interface</h1></div>} />
                    <Route path="/reports" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl gradient-text">Report Generation Dome</h1></div>} />
                    <Route path="/models" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl gradient-text">Model Studio Laboratory</h1></div>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>

                <SettingsPanel />
              </div>
            </BrowserRouter>
          </AccessibilityFeatures>
        </TooltipProvider>
      </LoadingProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
