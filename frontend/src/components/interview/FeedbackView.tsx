import React from 'react';
import type { AnswerEvaluation, InterviewQuestion } from '../../types/interview';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

interface FeedbackViewProps {
  feedback: AnswerEvaluation;
  question: InterviewQuestion;
  hasNextQuestion: boolean;
  nextQuestionNumber: number;
  onAdvance: () => void;
  isLoadingNext: boolean;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedback,
  question,
  hasNextQuestion,
  nextQuestionNumber,
  onAdvance,
  isLoadingNext,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Score */}
      <div className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#32343a]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="uppercase tracking-wider">Evaluation</span>
              <span>•</span>
              <span className="text-orange-400">{question.competency}</span>
            </div>
            <h2 className="text-lg font-serif text-zinc-100 font-semibold mt-1">
              Diagnostic Feedback for Question {question.questionNumber}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getScoreColor(feedback.score)}`}>
              <Award className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-xl font-bold font-mono leading-none">{feedback.score}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-80 mt-0.5">/ 100 PTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Disclaimer Note */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-[#1e1f23] px-3.5 py-2 rounded-lg border border-[#32343a]">
          <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>{feedback.practiceDisclaimer || 'Practice feedback only — not predictive of employment outcomes.'}</span>
        </div>

        {/* Strengths & Improvement Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-[#1e1f23] border border-emerald-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase font-mono">
              <CheckCircle2 className="w-4 h-4" />
              Demonstrated Strengths
            </div>
            <ul className="space-y-2">
              {feedback.strengths.map((s, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvement Areas */}
          <div className="bg-[#1e1f23] border border-amber-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase font-mono">
              <AlertCircle className="w-4 h-4" />
              Areas to Strengthen
            </div>
            <ul className="space-y-2">
              {feedback.improvementAreas.map((item, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Concepts / Evidence */}
        {feedback.missingConcepts && feedback.missingConcepts.length > 0 && (
          <div className="bg-[#1e1f23] border border-[#383a40] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-400 font-semibold text-xs tracking-wider uppercase font-mono">
              <HelpCircle className="w-4 h-4 text-orange-400" />
              Key Concepts to Incorporate
            </div>
            <div className="flex flex-wrap gap-2">
              {feedback.missingConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs bg-[#25262a] border border-[#3e4148] text-zinc-300"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Answer Model */}
        {feedback.suggestedAnswer && (
          <div className="bg-[#1b1c1e] border border-[#383a40] rounded-xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono text-orange-400">
              <Sparkles className="w-3.5 h-3.5" />
              Suggested Model Structure
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans italic">
              &ldquo;{feedback.suggestedAnswer}&rdquo;
            </p>
          </div>
        )}

        {/* Actionable Next Step */}
        {feedback.nextStep && (
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-200">Recommended Action Step</div>
              <p className="text-xs text-zinc-400 leading-relaxed">{feedback.nextStep}</p>
            </div>
          </div>
        )}

        {/* Advance Control */}
        <div className="pt-4 border-t border-[#32343a] flex justify-end">
          <button
            type="button"
            onClick={onAdvance}
            disabled={isLoadingNext}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isLoadingNext ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading Next Question...</span>
              </>
            ) : (
              <>
                <span>
                  {hasNextQuestion
                    ? `Proceed to Question ${nextQuestionNumber}`
                    : 'Complete & View Scorecard'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

