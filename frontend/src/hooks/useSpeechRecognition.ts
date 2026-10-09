import { useState, useEffect, useRef, useCallback } from 'react';

// Browser Web Speech API type declarations
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setTranscript: (text: string) => void;
}

export function useSpeechRecognition(initialText = ''): UseSpeechRecognitionReturn {
  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldListenRef = useRef(false);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    setInterimTranscript('');

    const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionClass) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or switch to Text Mode.');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Safe ignore
      }
    }

    try {
      const recognition = new RecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        shouldListenRef.current = true;
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentInterim = '';
        let finalized = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalized += res[0].transcript + ' ';
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (finalized.trim()) {
          setTranscript((prev) => {
            const separator = prev.trim() && !prev.endsWith(' ') ? ' ' : '';
            return (prev + separator + finalized.trim()).trim();
          });
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        let msg: string | null = null;
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            msg = 'Microphone permission was denied. Please allow microphone access in your browser address bar.';
            shouldListenRef.current = false;
            break;
          case 'no-speech':
            // Frequent in quiet pauses, keep alive if user intended to speak
            msg = null;
            break;
          case 'audio-capture':
            msg = 'No working microphone detected. Please check your audio input device.';
            shouldListenRef.current = false;
            break;
          case 'network':
            msg = 'Speech recognition network error. Please verify your internet connection.';
            break;
          default:
            msg = `Speech recognition warning: ${event.error}`;
        }

        if (msg) {
          setError(msg);
        }
      };

      recognition.onend = () => {
        // Auto-restart if user still intended to listen and wasn't explicitly stopped
        if (shouldListenRef.current) {
          try {
            recognition.start();
            return;
          } catch {
            // Restart failed
          }
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError(`Failed to initialize microphone: ${err instanceof Error ? err.message : String(err)}`);
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Safe ignore
        }
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
