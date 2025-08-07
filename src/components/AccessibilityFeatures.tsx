
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AccessibilityFeaturesProps {
  children: React.ReactNode;
}

export default function AccessibilityFeatures({ children }: AccessibilityFeaturesProps) {
  const { settings } = useTheme();
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Screen reader announcements
  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 5000);
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip navigation (Alt + S)
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const skipLink = document.getElementById('skip-to-main');
        if (skipLink) {
          skipLink.focus();
        }
      }

      // Focus management for modals and dialogs
      if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
      }

      // Tab navigation enhancement
      if (event.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply motion preferences
    if (settings.motionIntensity === 'none') {
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
    } else if (settings.motionIntensity === 'reduced') {
      root.style.setProperty('--animation-duration', '150ms');
      root.style.setProperty('--transition-duration', '150ms');
    } else {
      root.style.setProperty('--animation-duration', '300ms');
      root.style.setProperty('--transition-duration', '300ms');
    }

    // Apply font preferences
    if (settings.fontFamily === 'dyslexia-friendly') {
      root.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
    } else if (settings.fontFamily === 'monospace') {
      root.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", monospace';
    } else {
      root.style.fontFamily = 'Inter, system-ui, sans-serif';
    }
  }, [settings]);

  return (
    <>
      {/* Skip Link */}
      <a
        id="skip-to-main"
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Live Region for Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      {/* Focus Indicator Enhancement */}
      <style jsx global>{`
        :focus-visible {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        .high-contrast {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --primary: 60 100% 50%;
          --border: 0 0% 50%;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
