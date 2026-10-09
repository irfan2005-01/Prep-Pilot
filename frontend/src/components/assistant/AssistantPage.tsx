import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Mic, MicOff, Send, Square, RotateCcw } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { sendAssistantMessage, type AssistantTurn } from '../../services/assistantService';
import { CinematicParticleWave, type AssistantVisualState } from './CinematicParticleWave';
import './assistant.css';

interface Message { role: 'user' | 'assistant'; text: string }

interface AssistantPageProps { onExit: () => void }

export function AssistantPage({ onExit }: AssistantPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voiceSession, setVoiceSession] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const retryRef = useRef<{ message: string; history: AssistantTurn[] } | null>(null);

  const {
    isSupported: isMicSupported,
    isListening,
    transcript,
    interimTranscript,
    error: micError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();
  const {
    isSupported: isTtsSupported,
    isSpeaking: synthesisSpeaking,
    error: ttsError,
    speak,
    cancel: cancelSpeech,
  } = useSpeechSynthesis();

  const isSpeaking = synthesisSpeaking;
  const draftText = isListening ? [transcript, interimTranscript].filter(Boolean).join(' ') : draft;

  useEffect(() => () => {
    abortRef.current?.abort();
    stopListening();
    cancelSpeech();
  }, [cancelSpeech, stopListening]);

  const visualState: AssistantVisualState = errorMessage || micError || ttsError
    ? 'error'
    : isListening
      ? 'listening'
      : isThinking
        ? 'thinking'
        : isSpeaking
          ? 'speaking'
          : 'idle';

  const ask = async (message: string, history: AssistantTurn[], isRetry = false) => {
    const controller = new AbortController();
    abortRef.current = controller;
    setIsThinking(true);
    setCanRetry(false);
    setErrorMessage(null);
    if (!isRetry) setMessages((previous) => [...previous, { role: 'user', text: message }]);
    retryRef.current = { message, history };

    try {
      const reply = await sendAssistantMessage(message, history, controller.signal);
      setMessages((previous) => [...previous, { role: 'assistant', text: reply }]);
      retryRef.current = null;
      if (voiceSession && isTtsSupported) {
        speak(reply, () => {
          if (voiceSession) startListening();
        });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorMessage(error instanceof Error ? error.message : 'The assistant could not respond. Please try again.');
        setCanRetry(true);
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsThinking(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = draftText.trim();
    if (!message || isThinking) return;
    if (isListening) stopListening();
    const history: AssistantTurn[] = messages.map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', text: item.text }));
    setDraft('');
    resetTranscript();
    void ask(message, history);
  };

  const handleMic = () => {
    if (isSpeaking || synthesisSpeaking) {
      setErrorMessage('Stop Alex’s speech before starting the microphone.');
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    if (!isMicSupported) {
      setErrorMessage('Live microphone input is not available in this browser. You can still type a message.');
      return;
    }
    setErrorMessage(null);
    setVoiceSession(true);
    startListening();
  };

  const stopConversation = () => {
    setVoiceSession(false);
    stopListening();
    cancelSpeech();
  };

  const handleRetry = () => {
    const retry = retryRef.current;
    if (retry && !isThinking) void ask(retry.message, retry.history, true);
  };

  const latestMessage = messages[messages.length - 1];

  return (
    <section className="assistant-screen" aria-label="Prep Pilot AI assistant">
      <CinematicParticleWave state={visualState} />
      <header className="assistant-topbar">
        <button type="button" className="assistant-back" onClick={onExit} aria-label="Back to Prep Pilot">
          <ArrowLeft size={16} /> <span>Prep Pilot</span>
        </button>
        <span className="assistant-brand">NEXORA <i /> AI</span>
      </header>

      <main className="assistant-content">
        <div className="assistant-kicker">YOUR CAREER CO-PILOT</div>
        <div className="assistant-conversation" aria-live="polite" aria-atomic="false">
          {messages.length === 0 ? (
            <h1 className="assistant-greeting">How can I help you today?</h1>
          ) : (
            <>
              {latestMessage?.role === 'user' && <p className="assistant-user-message">{latestMessage.text}</p>}
              {latestMessage?.role === 'assistant' && <p className="assistant-reply">{latestMessage.text}</p>}
              {isThinking && <p className="assistant-status">Thinking through it<span className="assistant-ellipsis">…</span></p>}
            </>
          )}
        </div>
        {(errorMessage || micError || ttsError) && (
          <div className="assistant-error" role="alert">
            <span>{errorMessage || micError || ttsError}</span>
            {canRetry && <button type="button" onClick={handleRetry}><RotateCcw size={14} /> Retry</button>}
          </div>
        )}
        {isListening && <div className="assistant-live-transcript">Listening{interimTranscript ? ` · ${interimTranscript}` : ' · speak naturally'}</div>}
      </main>

      <form className="assistant-composer" onSubmit={handleSubmit}>
        <label className="assistant-input-label" htmlFor="assistant-message">Message Alex</label>
        <textarea
          id="assistant-message"
          value={draftText}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about your resume, interview prep, or next step…"
          rows={2}
          disabled={isThinking}
        />
        <div className="assistant-controls">
          <div className="assistant-control-group">
            <button type="button" className={`assistant-icon-button ${isListening ? 'is-active' : ''}`} onClick={handleMic} disabled={isThinking || isSpeaking} aria-label={isListening ? 'Stop microphone' : 'Start microphone'} title={isMicSupported ? 'Speak a message' : 'Microphone unavailable'}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            {(voiceSession || isSpeaking) && <button type="button" className="assistant-icon-button" onClick={stopConversation} aria-label="End voice conversation" title="End conversation"><Square size={15} /></button>}
            <span className="assistant-hint">{isListening ? 'Microphone on' : isSpeaking ? 'Alex is speaking' : isThinking ? 'Preparing a response' : 'Private by default · no transcripts are saved'}</span>
          </div>
          <button type="submit" className="assistant-send" disabled={!draftText.trim() || isThinking || isSpeaking} aria-label="Send message"><Send size={16} /><span>Send</span></button>
        </div>
      </form>
    </section>
  );
}
