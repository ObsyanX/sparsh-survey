
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Type, Zap, Volume2, Eye, Monitor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings, toggleTheme } = useTheme();

  const settingSections = [
    {
      title: 'Appearance',
      icon: <Palette className="w-4 h-4" />,
      items: [
        {
          label: 'Theme',
          type: 'select',
          value: settings.theme,
          options: [
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
            { value: 'high-contrast', label: 'High Contrast' }
          ],
          onChange: (value: string) => updateSettings({ theme: value as any })
        },
        {
          label: 'Background',
          type: 'select',
          value: settings.backgroundTexture,
          options: [
            { value: 'starfield', label: 'Starfield' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'glass', label: 'Glass' },
            { value: 'matrix', label: 'Matrix' }
          ],
          onChange: (value: string) => updateSettings({ backgroundTexture: value as any })
        }
      ]
    },
    {
      title: 'Accessibility',
      icon: <Eye className="w-4 h-4" />,
      items: [
        {
          label: 'Font Family',
          type: 'select',
          value: settings.fontFamily,
          options: [
            { value: 'inter', label: 'Inter' },
            { value: 'dyslexia-friendly', label: 'Dyslexia Friendly' },
            { value: 'monospace', label: 'Monospace' }
          ],
          onChange: (value: string) => updateSettings({ fontFamily: value as any })
        },
        {
          label: 'Font Size',
          type: 'slider',
          value: settings.fontSize,
          min: 12,
          max: 24,
          onChange: (value: number) => updateSettings({ fontSize: value })
        },
        {
          label: 'High Contrast',
          type: 'switch',
          value: settings.highContrast,
          onChange: (value: boolean) => updateSettings({ highContrast: value })
        }
      ]
    },
    {
      title: 'Motion & Effects',
      icon: <Zap className="w-4 h-4" />,
      items: [
        {
          label: 'Motion Intensity',
          type: 'select',
          value: settings.motionIntensity,
          options: [
            { value: 'none', label: 'None' },
            { value: 'reduced', label: 'Reduced' },
            { value: 'normal', label: 'Normal' },
            { value: 'enhanced', label: 'Enhanced' }
          ],
          onChange: (value: string) => updateSettings({ motionIntensity: value as any })
        },
        {
          label: 'Animations',
          type: 'switch',
          value: settings.animationsEnabled,
          onChange: (value: boolean) => updateSettings({ animationsEnabled: value })
        },
        {
          label: 'Sound Effects',
          type: 'switch',
          value: settings.soundEnabled,
          onChange: (value: boolean) => updateSettings({ soundEnabled: value })
        }
      ]
    }
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-40 glass quantum-glow-hover"
        aria-label="Open settings"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-50"
            >
              <Card className="glass h-full w-full rounded-l-lg rounded-r-none border-r-0 p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Settings</h2>
                      <p className="text-sm text-muted-foreground">Customize your experience</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>

                {/* Quick Theme Toggle */}
                <div className="mb-6">
                  <Button
                    onClick={toggleTheme}
                    className="w-full bg-gradient-to-r from-primary to-quantum-purple quantum-glow-hover"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Switch Theme
                  </Button>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                  {settingSections.map((section) => (
                    <div key={section.title} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {section.icon}
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        {section.items.map((item) => (
                          <div key={item.label} className="space-y-2">
                            <label className="text-sm font-medium">{item.label}</label>
                            
                            {item.type === 'select' && (
                              <Select value={item.value} onValueChange={item.onChange}>
                                <SelectTrigger className="glass">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            
                            {item.type === 'slider' && (
                              <div className="space-y-2">
                                <Slider
                                  value={[item.value]}
                                  onValueChange={([value]) => item.onChange(value)}
                                  min={item.min}
                                  max={item.max}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-xs text-muted-foreground text-right">
                                  {item.value}px
                                </div>
                              </div>
                            )}
                            
                            {item.type === 'switch' && (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={item.value}
                                  onCheckedChange={item.onChange}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {item.value ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reset Button */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <Button
                    onClick={() => updateSettings({
                      theme: 'dark',
                      backgroundTexture: 'starfield',
                      fontFamily: 'inter',
                      motionIntensity: 'normal',
                      animationsEnabled: true,
                      soundEnabled: false,
                      highContrast: false,
                      fontSize: 16
                    })}
                    variant="outline"
                    className="w-full"
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
