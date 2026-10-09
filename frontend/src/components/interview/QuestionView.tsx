import React, { useState } from 'react';
import type { InterviewQuestion } from '../../types/interview';
import { Send, LogOut, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';

interface QuestionViewProps {
  question: InterviewQuestion;
  totalQuestions: number;
  currentNumber: number;
  roleTitle: string;
  isSubmitting: boolean;
  onSubmitAnswer: (answerText: string) => void;
  onRequestExit: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  totalQuestions,
  currentNumber,
  roleTitle,
  isSubmitting,
  onSubmitAnswer,
  onRequestExit,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const isBehavioral =
    question.category === 'behavioral' || question.category === 'situational';

  const progressPct = Math.round(((currentNumber - 1) / totalQuestions) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerText.trim().length < 15) {
      setClientError('Please provide a complete answer (at least 15 characters) before submitting for evaluation.');
      return;
    }
    setClientError(null);
    onSubmitAnswer(answerText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#32343a]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
            {roleTitle}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            Question {currentNumber} of {totalQuestions}
          </span>
        </div>

        <button
          type="button"
          onClick={onRequestExit}
          className="text-xs font-medium text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Interview</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-zinc-500">
          <span>PROGRESS</span>
          <span>{progressPct}% COMPLETED</span>
        </div>
        <div className="w-full h-1.5 bg-[#2d2f34] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 space-y-5 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#1e1f23] text-zinc-300 border border-[#3e4148]">
            {question.category}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-400">
            {question.competency}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-500">
            Caliber: {question.difficulty}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-serif text-zinc-100 font-semibold leading-relaxed tracking-tight">
          &ldquo;{question.questionText}&rdquo;
        </h2>

        {/* Guidance Prompt */}
        <div className="bg-[#1e1f23] border border-[#32343a] rounded-xl p-3.5 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isBehavioral ? (
              <>
                <strong className="text-zinc-200">STAR Guideline:</strong> Structure your response around{' '}
                <span className="text-orange-400">S</span>ituation, <span className="text-orange-400">T</span>ask,{' '}
                <span className="text-orange-400">A</span>ction, and <span className="text-orange-400">R</span>esult. Focus on your direct contributions.
              </>
            ) : (
              <>
                <strong className="text-zinc-200">Technical Guideline:</strong> Detail the underlying mechanisms, trade-offs, and practical design decisions that justify your approach.
              </>
            )}
          </p>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <label htmlFor="answer-input" className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                Your Practice Response
              </label>
              <span className="font-mono text-[11px] text-zinc-500">
                {answerText.length} characters (min 15)
              </span>
            </div>

            <textarea
              id="answer-input"
              rows={8}
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                if (clientError) setClientError(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              placeholder={
                isBehavioral
                  ? "Describe the context, your specific responsibility, the concrete action you took, and what resulted from your effort..."
                  : "Explain the architecture, underlying principles, edge cases, and technical trade-offs..."
              }
              className="w-full bg-[#1b1c1e] border border-[#383a40] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all resize-y leading-relaxed"
            />
          </div>

          {clientError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{clientError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">Ctrl+Enter</kbd> to submit
            </span>

            <button
              type="submit"
              disabled={isSubmitting || answerText.trim().length === 0}
              className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit for AI Evaluation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

