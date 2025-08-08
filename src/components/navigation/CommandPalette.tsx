
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Command as CommandIcon, ArrowRight, Clock } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Card } from '@/components/ui/card';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  action: () => void;
  icon?: React.ReactNode;
  keywords: string[];
  category: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'nav-home',
      title: 'Observatory Hub',
      description: 'Return to mission control',
      action: () => navigate('/'),
      keywords: ['home', 'dashboard', 'main', 'hub'],
      category: 'Navigation',
      shortcut: 'Alt+H'
    },
    {
      id: 'nav-upload',
      title: 'Data Intake Chamber',
      description: 'Upload and import datasets',
      action: () => navigate('/upload'),
      keywords: ['upload', 'import', 'data', 'file'],
      category: 'Navigation',
      shortcut: 'Alt+U'
    },
    {
      id: 'nav-cleaning',
      title: 'Data Cleaning Chamber',
      description: 'Process and clean your data',
      action: () => navigate('/cleaning'),
      keywords: ['clean', 'process', 'transform'],
      category: 'Navigation',
      shortcut: 'Alt+C'
    },
    {
      id: 'nav-visualize',
      title: 'Insight Gallery',
      description: 'Create visualizations and charts',
      action: () => navigate('/visualize'),
      keywords: ['chart', 'graph', 'visual', 'plot'],
      category: 'Navigation',
      shortcut: 'Alt+V'
    },
    {
      id: 'nav-explorer',
      title: '3D Data Explorer',
      description: 'Immersive 3D data exploration',
      action: () => navigate('/explorer'),
      keywords: ['3d', 'explore', 'immersive', 'holographic'],
      category: 'Navigation',
      shortcut: 'Alt+E'
    },
    {
      id: 'nav-chat',
      title: 'AI Chat Interface',
      description: 'Interact with AI assistant',
      action: () => navigate('/chat'),
      keywords: ['chat', 'ai', 'assistant', 'help'],
      category: 'Navigation',
      shortcut: 'Alt+I'
    },
    {
      id: 'nav-reports',
      title: 'Report Generation Dome',
      description: 'Generate comprehensive reports',
      action: () => navigate('/reports'),
      keywords: ['report', 'generate', 'export', 'summary'],
      category: 'Navigation',
      shortcut: 'Alt+R'
    },
    {
      id: 'nav-models',
      title: 'Model Studio Laboratory',
      description: 'Build and train AI models',
      action: () => navigate('/models'),
      keywords: ['model', 'ai', 'machine learning', 'train'],
      category: 'Navigation',
      shortcut: 'Alt+M'
    },
    {
      id: 'action-theme',
      title: 'Toggle Theme',
      description: 'Switch between light and dark themes',
      action: () => console.log('Toggle theme'),
      keywords: ['theme', 'dark', 'light', 'appearance'],
      category: 'Actions',
      shortcut: 'Ctrl+T'
    },
    {
      id: 'action-settings',
      title: 'Open Settings',
      description: 'Configure application preferences',
      action: () => console.log('Open settings'),
      keywords: ['settings', 'preferences', 'config'],
      category: 'Actions',
      shortcut: 'Ctrl+,'
    }
  ];

  const filteredCommands = commands.filter(command => {
    const searchTerm = query.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.keywords.some(keyword => keyword.includes(searchTerm))
    );
  });

  const executeCommand = (command: CommandItem) => {
    command.action();
    
    // Add to recent commands
    setRecentCommands(prev => {
      const updated = [command.id, ...prev.filter(id => id !== command.id)];
      return updated.slice(0, 5);
    });
    
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl mx-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-title"
            aria-describedby="command-palette-description"
          >
            <Card className="glass border border-primary/20 quantum-glow overflow-hidden">
              <Command className="bg-transparent">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                  <CommandIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium gradient-text" id="command-palette-title">
                    Observatory Command Center
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <kbd className="px-2 py-1 bg-muted/20 rounded text-xs">
                      Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted/20 rounded text-xs">
                      K
                    </kbd>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <CommandInput
                    ref={inputRef}
                    placeholder="Search commands, navigate, or perform actions..."
                    value={query}
                    onValueChange={setQuery}
                    className="pl-10 pr-4 py-4 text-base bg-transparent border-0 focus:ring-0"
                  />
                </div>

                <CommandList className="max-h-80 overflow-y-auto">
                  <CommandEmpty className="py-6 text-center text-muted-foreground" id="command-palette-description">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-50" />
                      <span>No commands found</span>
                      <span className="text-xs">Try "upload", "chart", or "settings"</span>
                    </div>
                  </CommandEmpty>

                  {/* Recent Commands */}
                  {query === '' && recentCommands.length > 0 && (
                    <CommandGroup heading="Recent">
                      {recentCommands.map(commandId => {
                        const command = commands.find(c => c.id === commandId);
                        if (!command) return null;
                        
                        return (
                          <CommandItem
                            key={command.id}
                            value={command.title}
                            onSelect={() => executeCommand(command)}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          >
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="font-medium">{command.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {command.description}
                              </div>
                            </div>
                            {command.shortcut && (
                              <kbd className="px-2 py-1 bg-muted/20 rounded text-xs">
                                {command.shortcut}
                              </kbd>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}

                  {/* Grouped Commands */}
                  {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                    <CommandGroup key={category} heading={category}>
                      {categoryCommands.map(command => (
                        <CommandItem
                          key={command.id}
                          value={command.title}
                          onSelect={() => executeCommand(command)}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer group"
                        >
                          {command.icon || <ArrowRight className="w-4 h-4 text-primary" />}
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {command.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {command.description}
                            </div>
                          </div>
                          {command.shortcut && (
                            <kbd className="px-2 py-1 bg-muted/20 rounded text-xs opacity-60 group-hover:opacity-100">
                              {command.shortcut}
                            </kbd>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>

                {/* Footer */}
                <div className="border-t border-border/20 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-muted/20 rounded">↑↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-muted/20 rounded">⏎</kbd>
                      <span>Execute</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-muted/20 rounded">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </Command>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
