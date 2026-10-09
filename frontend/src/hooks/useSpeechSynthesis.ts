import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  error: string | null;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  selectVoice: (voiceName: string) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' && ('speechSynthesis' in window);
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices when available
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        // Filter preferred English voices
        const englishVoices = available.filter((v) => v.lang.startsWith('en'));
        const voicePool = englishVoices.length > 0 ? englishVoices : available;
        setVoices(voicePool);

        // Pick preferred default: Google US English, Microsoft Natural, or first English
        const preferred =
          voicePool.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) ||
          voicePool.find((v) => v.default) ||
          voicePool[0];

        setSelectedVoice((prev) => prev || preferred || null);
      }
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    setError(null);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
        if (onEnd) onEnd();
        return;
      }

      setError(null);

      // Stop any prior speech to prevent collision
      window.speechSynthesis.cancel();

      // Clean text of markdown formatting for natural speech
      const spokenText = text
        .replace(/[*_#`[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(spokenText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = selectedVoice?.lang || 'en-US';

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        activeUtteranceRef.current = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setIsPaused(false);
        activeUtteranceRef.current = null;
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setError('Alex could not play audio. Check your browser audio settings or use text mode.');
        }
        if (onEnd) onEnd();
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice]
  );

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const selectVoice = useCallback(
    (voiceName: string) => {
      const match = voices.find((v) => v.name === voiceName);
      if (match) {
        setSelectedVoice(match);
      }
    },
    [voices]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    error,
    voices,
    selectedVoice,
    speak,
    cancel,
    pause,
    resume,
    selectVoice,
  };
}
