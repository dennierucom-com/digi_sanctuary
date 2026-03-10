import { useState, useEffect, useRef } from 'react';

const SOUND_SOURCES: Record<string, string> = {
  rain: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3', // Placeholder rain sound
  forest: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3', // Placeholder forest
  white: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', // Placeholder white noise
};

interface UseAudioPlayerProps {
  activeSound: string;
  volume: number;
  isPlaying: boolean;
}

export const useAudioPlayer = ({ activeSound, volume, isPlaying }: UseAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.addEventListener('canplaythrough', () => setIsLoaded(true));
      audioRef.current.addEventListener('error', () => setError(true));
    }

    const unmounted = false;
    audioRef.current.src = SOUND_SOURCES[activeSound] || SOUND_SOURCES.rain;
    audioRef.current.load();
    setIsLoaded(false);
    setError(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isLoaded) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setError(true));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isLoaded]);

  return { isLoaded, error };
};
