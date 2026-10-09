import React, { useState, useEffect, useRef } from 'react';
import type { InterviewQuestion } from '../../types/interview';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  LogOut,
  Edit3,
  Check,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Type,
  Loader2,
  Settings
} from 'lucide-react';
import { CinematicParticleWave, type AssistantVisualState } from '../assistant/CinematicParticleWave';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface VoiceQuestionViewProps {
  question: InterviewQuestion;
  totalQuestions: number;
  currentNumber: number;
  roleTitle: string;
  isSubmitting: boolean;
  onSubmitAnswer: (answerText: string) => void;
  onRequestExit: () => void;
  onSwitchToTextMode: () => void;
}

export const VoiceQuestionView: React.FC<VoiceQuestionViewProps> = ({
  question,
  totalQuestions,
  currentNumber,
  roleTitle,
  isSubmitting,
  onSubmitAnswer,
  onRequestExit,
  onSwitchToTextMode,
}) => {
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const hasSpokenQuestionRef = useRef<string | null>(null);
  const pendingQuestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isSupported: isRecSupported,
    isListening,
    transcript,
    interimTranscript,
    error: recError,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeechRecognition();

  const {
    isSupported: isSynthSupported,
    isSpeaking,
    error: synthError,
    voices,
    selectedVoice,
    speak,
    cancel: stopSpeaking,
    selectVoice,
  } = useSpeechSynthesis();

  const progressPct = Math.round(((currentNumber - 1) / totalQuestions) * 100);
  const isBehavioral = question.category === 'behavioral' || question.category === 'situational';

  // Compute active transcript (either edited or recognized)
  const currentTranscript = isEditingTranscript ? editedText : transcript;

  // Derive visualizer state
  const visualizerState: AssistantVisualState = clientError || recError || synthError
    ? 'error'
    : isSubmitting
      ? 'thinking'
      : isSpeaking
        ? 'speaking'
        : isListening
          ? 'listening'
          : 'idle';

  // Speak question aloud upon entering question
  useEffect(() => {
    const questionText = question.questionText?.trim();
    if (questionText && question.id && hasSpokenQuestionRef.current !== question.id && isSynthSupported) {
      resetTranscript();
      setEditedText('');
      setIsEditingTranscript(false);
      setClientError(null);

      let introText = '';
      if (question.isFollowUp) {
        introText = `Here is a follow-up question based on your response: ${questionText}`;
      } else if (currentNumber === 1) {
        introText = `Welcome to your mock interview session. I'm Alex. Let's begin with question one: ${questionText}`;
      } else {
        introText = `Question ${currentNumber}: ${questionText}`;
      }

      // Mark only when playback is actually dispatched. Strict Mode may run and
      // clean up an effect before its delayed callback has fired.
      pendingQuestionTimerRef.current = setTimeout(() => {
        hasSpokenQuestionRef.current = question.id;
        pendingQuestionTimerRef.current = null;
        speak(introText, () => {
          // Playback completion is reflected by the synthesis hook.
        });
      }, 350);

      return () => {
        if (pendingQuestionTimerRef.current !== null) {
          clearTimeout(pendingQuestionTimerRef.current);
          pendingQuestionTimerRef.current = null;
        }
      };
    }
  }, [question.id, question.isFollowUp, question.questionText, currentNumber, isSynthSupported, speak, resetTranscript]);

  const handleToggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      stopListening();
    } else {
      if (isEditingTranscript) {
        setTranscript(editedText);
        setIsEditingTranscript(false);
      }
      startListening();
    }
  };

  const handleReplayQuestion = () => {
    if (isListening) {
      stopListening();
    }
    const replayText = question.isFollowUp
      ? `Follow-up question: ${question.questionText}`
      : `Question ${currentNumber}: ${question.questionText}`;
    speak(replayText);
  };

  const handleStartEditing = () => {
    if (isListening) {
      stopListening();
    }
    setEditedText(transcript);
    setIsEditingTranscript(true);
  };

  const handleSaveEditing = () => {
    setTranscript(editedText.trim());
    setIsEditingTranscript(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    if (isSpeaking) {
      stopSpeaking();
    }

    const submissionText = isEditingTranscript ? editedText.trim() : transcript.trim();

    if (submissionText.length < 15) {
      setClientError('Please speak or type a complete answer (at least 15 characters) before submitting for evaluation.');
      return;
    }

    setClientError(null);
    onSubmitAnswer(submissionText);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span
            className="badge badge-orange"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.72rem' }}
          >
            {roleTitle}
          </span>

          {question.isFollowUp ? (
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(232, 90, 11, 0.12)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-border)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Contextual Follow-Up
            </span>
          ) : (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Question {currentNumber} of {totalQuestions}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Voice Settings Button */}
          {voices.length > 0 && (
            <button
              type="button"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
              title="Voice Settings"
            >
              <Settings size={14} />
              <span>Voice</span>
            </button>
          )}

          {/* Switch to Text Mode */}
          <button
            type="button"
            onClick={onSwitchToTextMode}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            <Type size={14} />
            <span>Switch to Text Mode</span>
          </button>

          {/* Exit Interview */}
          <button
            type="button"
            onClick={onRequestExit}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Voice Settings Selector Drawer (if open) */}
      {showVoiceSettings && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Interviewer Voice:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 260px' }}>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => selectVoice(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.65rem',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => speak('Hello! This is how I will sound during your interview.')}
              className="btn btn-outline btn-sm"
              style={{ flexShrink: 0 }}
            >
              Test
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          <span>INTERVIEW PROGRESS</span>
          <span>{progressPct}% COMPLETED</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '7px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, var(--accent-primary) 0%, #ff883d 100%)',
              transition: 'width 0.4s ease-in-out',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>

      {/* Voice Visualizer Avatar */}
      <section className="voice-cinematic-stage" aria-label="Alex voice activity">
        <CinematicParticleWave state={visualizerState} />
        <div className="voice-cinematic-copy" aria-live="polite">
          <span>PREP PILOT · AI INTERVIEWER</span>
          <h2>{isSubmitting ? 'Thinking through your answer' : isSpeaking ? 'Alex is speaking' : isListening ? 'I’m listening' : 'Ready when you are'}</h2>
          <p>{roleTitle}</p>
        </div>
      </section>

      {/* Main Question Card */}
      <div className="card card-elevated" style={{ padding: '2rem 2.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Meta badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {question.category}
          </span>
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {question.competency}
          </span>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Caliber: <strong style={{ color: 'var(--text-secondary)' }}>{question.difficulty}</strong>
          </span>
        </div>

        {/* Follow-Up Notice Banner (if applicable) */}
        {question.isFollowUp && (
          <div
            style={{
              backgroundColor: 'rgba(232, 90, 11, 0.05)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
            }}
          >
            <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--accent-primary)' }}>Follow-up Prompt:</strong> Alex is examining a specific
              trade-off or area from your previous answer. Answer naturally to elaborate or clarify.
            </p>
          </div>
        )}

        {/* Question Text */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          &ldquo;{question.questionText}&rdquo;
        </h2>

        {/* Spoken Audio Controls for Question */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleReplayQuestion}
            disabled={isSpeaking || isSubmitting}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Volume2 size={14} color="var(--accent-primary)" />
            <span>Replay Question Aloud</span>
          </button>

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#f87171' }}
            >
              <VolumeX size={14} />
              <span>Stop AI Speaking</span>
            </button>
          )}
        </div>

        {/* Guidance Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}
        >
          <HelpCircle size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            {isBehavioral ? (
              <>
                <strong style={{ color: 'var(--text-secondary)' }}>Tip:</strong> Speak your answer following the STAR method
                (Situation, Task, Action, Result). Highlight your personal contributions.
              </>
            ) : (
              <>
                <strong style={{ color: 'var(--text-secondary)' }}>Tip:</strong> Explain architectural principles, core
                trade-offs, and practical edge cases out loud as you would in an interview.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Voice Recognition & Spoken Answer Section */}
      <div
        className="card card-elevated"
        style={{
          padding: '2.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
          textAlign: 'center',
        }}
      >
        {/* Browser Speech Recognition Compatibility Warning */}
        {!isRecSupported && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fca5a5', marginBottom: '0.2rem' }}>
                Web Speech Recognition Unavailable
              </div>
              <p style={{ fontSize: '0.8rem', color: '#fca5a5', opacity: 0.9, lineHeight: 1.5, margin: 0 }}>
                Your current browser does not expose the Speech Recognition API. Chrome, Edge, and Safari are fully
                supported. You can switch to Text Mode to type your answers directly.
              </p>
              <button
                type="button"
                onClick={onSwitchToTextMode}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.65rem' }}
              >
                Switch to Text Mode Now
              </button>
            </div>
          </div>
        )}

        {/* Microphone Error Notice (if any) */}
        {recError && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>{recError}</span>
          </div>
        )}

        {/* Big Central Microphone Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={handleToggleListening}
            disabled={!isRecSupported || isSubmitting || isSpeaking}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#dc2626' : 'var(--accent-primary)',
              border: isListening ? '4px solid rgba(239, 68, 68, 0.4)' : '4px solid rgba(232, 90, 11, 0.4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isSpeaking || isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: isListening
                ? '0 0 30px rgba(239, 68, 68, 0.5)'
                : '0 4px 20px rgba(232, 90, 11, 0.45)',
              transition: 'all var(--transition-fast)',
              opacity: isSpeaking || isSubmitting ? 0.6 : 1,
            }}
            aria-label={isListening ? 'Stop recording answer' : 'Start recording answer'}
          >
            {isListening ? (
              <MicOff size={32} />
            ) : (
              <Mic size={32} />
            )}
          </button>
        </div>

        <div>
          <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {isSpeaking
              ? 'AI is speaking question...'
              : isListening
              ? 'Listening to your response... Click to finish speaking'
              : currentTranscript.trim().length > 0
              ? 'Recording paused. Review your transcript below.'
              : 'Click microphone to speak your response'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {isSpeaking
              ? 'Microphone will be ready as soon as Alex finishes speaking'
              : 'Speak clearly into your microphone. You can edit any technical terms before submitting.'}
          </p>
        </div>

        {/* Live Transcript Display Box */}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recognized Spoken Transcript:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {currentTranscript.length} chars (min 15)
              </span>
              {currentTranscript.trim().length > 0 && !isEditingTranscript && (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.2rem 0.4rem',
                  }}
                >
                  <Edit3 size={12} />
                  <span>Edit Transcript</span>
                </button>
              )}
            </div>
          </div>

          {isEditingTranscript ? (
            /* Editable Transcript Textarea */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <textarea
                rows={5}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Edit or correct your recognized response..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditingTranscript(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditing}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Check size={14} />
                  <span>Done Editing</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Transcript Display Box */
            <div
              style={{
                width: '100%',
                minHeight: '110px',
                maxHeight: '220px',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            >
              {transcript.trim().length > 0 ? (
                <span style={{ color: 'var(--text-primary)' }}>{transcript}</span>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {isListening
                    ? 'Listening... Speak now and your words will appear here in real-time.'
                    : 'Your spoken transcript will appear here. Tap the microphone above to begin.'}
                </span>
              )}
              {interimTranscript && (
                <span style={{ color: 'var(--accent-primary)', opacity: 0.85, fontStyle: 'italic' }}>
                  {' '}
                  {interimTranscript}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Client Error Notice */}
        {(clientError || synthError) && (
          <div
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
            <span>{clientError || synthError}</span>
          </div>
        )}

        {/* Action Controls Footer */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {currentTranscript.trim().length > 0 && (
              <button
                type="button"
                onClick={resetTranscript}
                disabled={isSubmitting}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={14} />
                <span>Clear & Retake</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || currentTranscript.trim().length === 0}
            className="btn btn-primary btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              minWidth: '240px',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                <span>AI Evaluating Spoken Answer...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Submit Spoken Answer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

