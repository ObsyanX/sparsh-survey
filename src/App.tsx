
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AccessibilityFeatures from "@/components/AccessibilityFeatures";
import SettingsPanel from "@/components/SettingsPanel";
import AnimatedCursor from "@/components/ui/AnimatedCursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AccessibilityFeatures>
          <AnimatedCursor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <SettingsPanel />
        </AccessibilityFeatures>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
