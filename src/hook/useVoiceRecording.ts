"use client";
import { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/services/voiceService';

interface UseVoiceRecordingOptions {
  onTranscription: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceRecording = ({ onTranscription, onError }: UseVoiceRecordingOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      console.log("[VOICE] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          console.log("[VOICE] Recording stopped, processing audio...");
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
          
          console.log("[VOICE] Sending audio for transcription...");
          const result = await transcribeAudio(audioFile);
          
          console.log("[VOICE] Transcription result:", result);
          onTranscription(result.text);
          
        } catch (error) {
          console.error("[VOICE] Transcription error:", error);
          onError?.(error instanceof Error ? error.message : 'Transcription failed');
        } finally {
          setIsProcessing(false);
          // Stop all tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("[VOICE] Recording started");
      
    } catch (error) {
      console.error("[VOICE] Failed to start recording:", error);
      onError?.(error instanceof Error ? error.message : 'Failed to access microphone');
    }
  }, [onTranscription, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("[VOICE] Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("[VOICE] Canceling recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [isRecording]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording
  };
}; 