"use client";
import { useState, useCallback } from 'react';

interface UseSpeechOptions {
  text: string;
  messageId: string;
}

export const useSpeech = ({ text, messageId }: UseSpeechOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOtherPlaying, setIsOtherPlaying] = useState(false);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // Simulate speech loading
      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);
        // Simulate speech ending
        setTimeout(() => {
          setIsPlaying(false);
        }, 3000);
      }, 1000);
    }
  }, [isPlaying]);

  return {
    isLoading,
    isPlaying,
    isOtherPlaying,
    handlePlayPause,
  };
};