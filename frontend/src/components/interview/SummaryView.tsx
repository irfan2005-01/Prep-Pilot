import React, { useState } from 'react';
import type { InterviewSummary } from '../../types/interview';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  MapPin,
  FileText,
  Info,
  Sparkles
} from 'lucide-react';

interface SummaryViewProps {
  summary: InterviewSummary;
  onRestart: () => void;
  onNavigateToRoadmap?: () => void;
  onNavigateToAnalyzer?: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  onRestart,
  onNavigateToRoadmap,
  onNavigateToAnalyzer,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  };

  const getScoreRating = (score: number) => {
    if (score >= 85) return 'Interview Ready (Strong Performer)';
    if (score >= 70) return 'Competitive Foundation (Minor Gaps)';
    if (score >= 55) return 'Developing (Targeted Practice Needed)';
    return 'Early Preparation Phase';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Overall Score Hero */}
      <div className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#32343a]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Practice Scorecard • {summary.roleTitle}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-zinc-100 font-bold">
              Interview Simulation Report
            </h1>
            <p className="text-xs md:text-sm text-zinc-400">
              Completed {summary.answeredQuestions} of {summary.totalQuestions} questions • Caliber: {summary.difficulty} • Type: {summary.interviewType}
            </p>
          </div>

          <div className={`px-6 py-4 rounded-2xl border text-center ${getScoreColor(summary.overallPracticeScore)}`}>
            <div className="text-4xl font-extrabold font-mono tracking-tight leading-none">
              {summary.overallPracticeScore}
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider opacity-80 mt-1">
              OVERALL PRACTICE SCORE
            </div>
            <div className="text-xs font-semibold mt-2 text-zinc-200">
              {getScoreRating(summary.overallPracticeScore)}
            </div>
          </div>
        </div>

        {/* Scoring Explanation & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e1f23] border border-[#32343a] rounded-xl p-4 flex items-start gap-3">
            <Award className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-200 font-mono uppercase">Scoring Methodology</div>
              <p className="text-xs text-zinc-400 leading-relaxed">{summary.scoringExplanation}</p>
            </div>
          </div>

          <div className="bg-[#1e1f23] border border-[#32343a] rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-200 font-mono uppercase">Practice Notice</div>
              <p className="text-xs text-zinc-400 leading-relaxed">{summary.practiceDisclaimer}</p>
            </div>
          </div>
        </div>

        {/* Next Session Recommendation Callout */}
        {summary.nextSessionRecommendation && (
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-200">Next-Session Guidance</div>
              <p className="text-xs text-zinc-300 leading-relaxed">{summary.nextSessionRecommendation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Strengths & Critical Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demonstrated Strengths */}
        <div className="bg-[#25262a] border border-emerald-500/20 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2.5">
            {summary.topStrengths.map((str, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed bg-[#1e1f23] p-3 rounded-lg border border-[#32343a]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Improvement Areas */}
        <div className="bg-[#25262a] border border-amber-500/20 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Critical Areas for Growth
          </h3>
          <ul className="space-y-2.5">
            {summary.criticalImprovementAreas.map((area, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed bg-[#1e1f23] p-3 rounded-lg border border-[#32343a]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Practice Activities */}
      <div className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-400" />
          Recommended Deliberate Practice Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {summary.recommendedPracticeActivities.map((act, idx) => (
            <div key={idx} className="bg-[#1e1f23] border border-[#32343a] p-3.5 rounded-xl text-xs text-zinc-300 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Free Learning Resources for Identified Gaps */}
      {summary.recommendedResources && summary.recommendedResources.length > 0 && (
        <div className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-orange-400" />
              Verified Free Resources to Address Gaps
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              100% Free • Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.recommendedResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1e1f23] hover:bg-[#2a2c31] border border-[#383a40] hover:border-orange-500/40 p-4 rounded-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                    <span>{res.provider}</span>
                    <span className="text-emerald-400 font-bold">{res.freeStatus}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors mt-2 leading-snug">
                    {res.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#32343a] text-[11px] text-zinc-400">
                  <span>Skill: {res.skillCovered}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Per-Question Results Breakdown */}
      <div className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono">
          Detailed Question Breakdown ({summary.questionResults.length})
        </h3>

        <div className="space-y-3">
          {summary.questionResults.map((result, idx) => {
            const isExpanded = expandedQuestionId === result.question.id;
            return (
              <div
                key={result.question.id || idx}
                className="bg-[#1e1f23] border border-[#32343a] rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(result.question.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[#25272c] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#25262a] border border-[#383a40] text-zinc-400 font-mono text-xs flex items-center justify-center font-bold">
                      Q{result.question.questionNumber}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200 line-clamp-1">
                        {result.question.questionText}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
                        {result.question.category} • {result.question.competency}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {result.answered && result.feedback ? (
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getScoreColor(result.feedback.score)}`}>
                        {result.feedback.score} pts
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-500 bg-zinc-800">
                        Unanswered
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-[#32343a] space-y-4 bg-[#1b1c1e]">
                    {result.answerText && (
                      <div className="space-y-1.5 pt-3">
                        <div className="text-[11px] font-mono uppercase text-zinc-500">Your Answer</div>
                        <p className="text-xs text-zinc-300 italic bg-[#202123] p-3 rounded-lg border border-[#32343a] leading-relaxed">
                          &ldquo;{result.answerText}&rdquo;
                        </p>
                      </div>
                    )}

                    {result.feedback && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg space-y-1.5">
                          <div className="font-semibold font-mono uppercase text-[10px]">What Went Well</div>
                          <ul className="space-y-1 text-zinc-300 text-xs">
                            {result.feedback.strengths.map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg space-y-1.5">
                          <div className="font-semibold font-mono uppercase text-[10px]">Room for Growth</div>
                          <ul className="space-y-1 text-zinc-300 text-xs">
                            {result.feedback.improvementAreas.map((a, i) => (
                              <li key={i}>• {a}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {result.feedback?.suggestedAnswer && (
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-mono uppercase text-orange-400">Suggested Model Structure</span>
                        <p className="text-zinc-300 text-xs bg-[#25262a] p-3 rounded-lg border border-[#32343a] leading-relaxed">
                          {result.feedback.suggestedAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#32343a]">
        <button
          type="button"
          onClick={onRestart}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Launch New Interview</span>
        </button>

        <div className="flex items-center gap-3">
          {onNavigateToRoadmap && (
            <button
              type="button"
              onClick={onNavigateToRoadmap}
              className="px-4 py-2 bg-[#25262a] hover:bg-[#2e3035] border border-[#3e4148] text-zinc-300 hover:text-zinc-100 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Review Learning Roadmap</span>
            </button>
          )}

          {onNavigateToAnalyzer && (
            <button
              type="button"
              onClick={onNavigateToAnalyzer}
              className="px-4 py-2 bg-[#25262a] hover:bg-[#2e3035] border border-[#3e4148] text-zinc-300 hover:text-zinc-100 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Analyze Another Resume</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

