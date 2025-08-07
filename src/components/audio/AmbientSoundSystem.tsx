
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AmbientSoundSystemProps {
  activeModule?: string;
  isActive?: boolean;
}

export default function AmbientSoundSystem({ activeModule, isActive = true }: AmbientSoundSystemProps) {
  const { settings } = useTheme();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Web Audio API
  useEffect(() => {
    if (!settings.soundEnabled || !isActive) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.1; // Low volume for ambient sounds
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }

    return () => {
      stopAmbientSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [settings.soundEnabled, isActive]);

  const createAmbientTone = (frequency: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    
    oscillator.connect(gain);
    gain.connect(gainNodeRef.current);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;
    gain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioContextRef.current.currentTime + 2);
    
    oscillator.start();
    oscillatorsRef.current.push(oscillator);
    
    return oscillator;
  };

  const playAmbientSounds = () => {
    if (!settings.soundEnabled || isPlaying) return;

    // Deep space ambient tones
    createAmbientTone(55, 'sine');     // Low bass hum
    createAmbientTone(110, 'sine');    // Sub-harmonic
    createAmbientTone(220, 'triangle'); // Mid-range atmosphere
    
    // Add subtle data pulse sounds based on active module
    if (activeModule) {
      const moduleFrequencies: Record<string, number> = {
        upload: 330,
        timeline: 440,
        insights: 550,
        intelligence: 660,
        story: 770,
        simulator: 880,
        '3d': 990,
        chat: 1100
      };
      
      const freq = moduleFrequencies[activeModule];
      if (freq) {
        setTimeout(() => createAmbientTone(freq, 'triangle'), 1000);
      }
    }

    setIsPlaying(true);
  };

  const stopAmbientSounds = () => {
    oscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  const playInteractionSound = (type: 'click' | 'hover' | 'success' | 'error') => {
    if (!settings.soundEnabled || !audioContextRef.current) return;

    const frequencies: Record<string, number[]> = {
      click: [800, 1000],
      hover: [600, 800],
      success: [523, 659, 784], // C-E-G chord
      error: [400, 300] // Descending tone
    };

    const freqs = frequencies[type];
    freqs.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gain = audioContextRef.current!.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContextRef.current!.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0.1, audioContextRef.current!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current!.currentTime + 0.2);
      }, index * 50);
    });
  };

  // Start ambient sounds when component mounts and sound is enabled
  useEffect(() => {
    if (settings.soundEnabled && isActive) {
      // Small delay to avoid jarring startup
      setTimeout(playAmbientSounds, 1000);
    } else {
      stopAmbientSounds();
    }
  }, [settings.soundEnabled, isActive, activeModule]);

  // Expose sound functions globally for other components to use
  useEffect(() => {
    (window as any).playInteractionSound = playInteractionSound;
    return () => {
      delete (window as any).playInteractionSound;
    };
  }, [settings.soundEnabled]);

  return null; // This component only manages audio, no visual rendering
}
