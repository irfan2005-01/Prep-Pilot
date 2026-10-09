import React, { useState } from 'react';
import { TARGET_ROLES } from '../../data/roles';
import type { InterviewDifficulty, InterviewSetupConfig, InterviewType } from '../../types/interview';
import { Sparkles, Brain, Compass, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

interface SetupViewProps {
  initialRoleId?: string;
  contextStrengths?: string[];
  contextSkillGaps?: string[];
  onStart: (config: InterviewSetupConfig) => void;
  onLoadBenchmark: (roleId: string) => void;
  isLoading: boolean;
}

export const SetupView: React.FC<SetupViewProps> = ({
  initialRoleId = 'full-stack-developer',
  contextStrengths = [],
  contextSkillGaps = [],
  onStart,
  onLoadBenchmark,
  isLoading,
}) => {
  const [roleId, setRoleId] = useState<string>(initialRoleId);
  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const selectedRole = TARGET_ROLES.find((r) => r.id === roleId) || TARGET_ROLES[0];
  const hasContext = contextStrengths.length > 0 || contextSkillGaps.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      roleId,
      interviewType,
      difficulty,
      questionCount,
      strengths: contextStrengths.length > 0 ? contextStrengths : undefined,
      skillGaps: contextSkillGaps.length > 0 ? contextSkillGaps : undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wide uppercase">
          <Brain className="w-3.5 h-3.5" />
          Phase 4 • AI Mock Interview Simulator
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-zinc-100 font-bold tracking-tight">
          Calibrate Your Interview Readiness
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Experience role-calibrated technical and behavioral interview simulations powered by Gemini AI. Receive immediate STAR-aware evaluations and actionable rubrics.
        </p>
      </div>

      {/* Personalization Context Banner */}
      {hasContext && (
        <div className="bg-[#25262a] border border-orange-500/30 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Personalized Using Your Resume Diagnostic
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Connected
              </span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Questions will specifically assess your diagnosed skill gaps{' '}
              {contextSkillGaps.length > 0 && (
                <span className="text-orange-400 font-medium">({contextSkillGaps.slice(0, 3).join(', ')})</span>
              )}{' '}
              while validating your verified strengths.
            </p>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-[#25262a] border border-[#32343a] rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">
        {/* Role Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500" />
            Target Career Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TARGET_ROLES.map((role) => {
              const isSelected = role.id === roleId;
              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setRoleId(role.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500 text-zinc-100 shadow-sm'
                      : 'bg-[#1e1f23] border-[#32343a] text-zinc-400 hover:text-zinc-200 hover:border-[#42444d]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono text-zinc-500 uppercase">{role.category}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                  </div>
                  <span className={`text-sm font-semibold mt-2 ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                    {role.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interview Type Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            Interview Category Focus
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'mixed',
                title: 'Mixed (Recommended)',
                description: 'Balanced ~50/50 distribution of technical depth and behavioral scenarios.',
              },
              {
                id: 'technical',
                title: 'Technical Deep Dive',
                description: '100% role-relevant architecture, trade-offs, algorithms, and debugging.',
              },
              {
                id: 'behavioral',
                title: 'HR & Behavioral',
                description: '100% STAR-framework questions on teamwork, conflict, ownership, and communication.',
              },
            ].map((type) => {
              const isSelected = interviewType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setInterviewType(type.id as InterviewType)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500 text-zinc-100'
                      : 'bg-[#1e1f23] border-[#32343a] text-zinc-400 hover:text-zinc-200 hover:border-[#42444d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                      {type.title}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty & Question Count Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-500" />
              Difficulty Caliber
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', label: 'Beginner', desc: 'Core fundamentals' },
                { id: 'intermediate', label: 'Intermediate', desc: 'Real trade-offs' },
                { id: 'advanced', label: 'Advanced', desc: 'High-scale design' },
              ].map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    type="button"
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id as InterviewDifficulty)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500 text-zinc-100 font-semibold'
                        : 'bg-[#1e1f23] border-[#32343a] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{diff.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{diff.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              Question Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 5, time: '~15 min', label: '5 Questions' },
                { count: 8, time: '~25 min', label: '8 Questions' },
                { count: 10, time: '~35 min', label: '10 Questions' },
              ].map((q) => {
                const isSelected = questionCount === q.count;
                return (
                  <button
                    type="button"
                    key={q.count}
                    onClick={() => setQuestionCount(q.count)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500 text-zinc-100 font-semibold'
                        : 'bg-[#1e1f23] border-[#32343a] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{q.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{q.time}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-[#32343a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onLoadBenchmark(roleId)}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 order-2 sm:order-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            Explore Pre-Calibrated Demo Scorecard
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating {selectedRole.title} Questions...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Launch Mock Interview ({questionCount} Questions)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
