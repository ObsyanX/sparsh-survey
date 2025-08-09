
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
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

const queryClient = new QueryClient();

const App = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const { isLowPerformance, shouldReduceAnimations } = usePerformance();
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
    setTimeout(ensureCursorVisibility, 100);
    setTimeout(ensureCursorVisibility, 1000);

    // Run on various events
    window.addEventListener('scroll', ensureCursorVisibility);
    window.addEventListener('resize', ensureCursorVisibility);
    window.addEventListener('mousemove', ensureCursorVisibility);

    return () => {
      window.removeEventListener('scroll', ensureCursorVisibility);
      window.removeEventListener('resize', ensureCursorVisibility);
      window.removeEventListener('mousemove', ensureCursorVisibility);
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AccessibilityFeatures>
            <BrowserRouter>
              <div className={shouldReduceAnimations ? 'reduce-motion' : ''}>
                {/* Global UI Elements */}
                <AnimatedCursor />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
