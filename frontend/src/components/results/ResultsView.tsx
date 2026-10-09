import { useState, type FC } from 'react';
import type { ResumeAnalysisResult, TargetRoleId } from '../../types/resume';
import { TARGET_ROLES } from '../../data/roles';
import { BENCHMARK_RESULTS } from '../../data/benchmarkResults';
import { DisclaimerBanner } from './DisclaimerBanner';
import { ScoreCard } from './ScoreCard';
import { StrengthsCard } from './StrengthsCard';
import { KeywordAnalysisCard } from './KeywordAnalysisCard';
import { SectionBreakdownCard } from './SectionBreakdownCard';
import { BulletTransformCard } from './BulletTransformCard';
import { Badge } from '../ui/Badge';
import { Printer, RotateCcw, Sparkles, Filter, CheckCircle2, Compass, ArrowRight, Brain } from 'lucide-react';

export interface ResultsViewProps {
  initialResult?: ResumeAnalysisResult;
  onUploadNew: () => void;
  onGenerateRoadmap: (result: ResumeAnalysisResult) => void;
  onStartInterview?: (result: ResumeAnalysisResult) => void;
}

export const ResultsView: FC<ResultsViewProps> = ({
  initialResult,
  onUploadNew,
  onGenerateRoadmap,
  onStartInterview
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<TargetRoleId>(
    initialResult?.roleId || 'full-stack-developer'
  );

  const activeResult: ResumeAnalysisResult =
    initialResult && initialResult.roleId === selectedRoleId
      ? initialResult
      : BENCHMARK_RESULTS[selectedRoleId] || BENCHMARK_RESULTS['full-stack-developer'];

  const isLive = !activeResult.isDemoSample;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Results Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1.5rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {isLive ? (
                <>
                  <Badge variant="success" icon={<CheckCircle2 size={12} />}>
                    Live AI ATS Diagnostic
                  </Badge>
                  <Badge variant="orange" icon={<Sparkles size={12} />}>
                    AI resume scoring
                  </Badge>
                  <Badge variant="neutral">
                    {activeResult.fileName}
                  </Badge>
                </>
              ) : (
                <>
                  <Badge variant="orange" icon={<Sparkles size={12} />}>
                    Reference Benchmark Example
                  </Badge>
                  <Badge variant="neutral">
                    Pre-Calibrated Benchmark Dataset
                  </Badge>
                </>
              )}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                marginBottom: '0.35rem'
              }}
            >
              {isLive ? `Your resume for ${activeResult.roleTitle}` : 'Resume score example'}
            </h1>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Target Role Track: <strong style={{ color: 'var(--text-primary)' }}>{activeResult.roleTitle}</strong> • {isLive ? 'Uploaded Document: ' : 'Sample Benchmark File: '}<span className="text-mono">{activeResult.fileName}</span>{isLive ? ` • Analyzed: ${new Date(activeResult.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ' (Reference Profile)'}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onGenerateRoadmap(activeResult)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              title="Generate personalized AI learning roadmap based on diagnosed gaps"
            >
              <Compass size={15} />
              <span>Generate Roadmap</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
              title="Print or export PDF summary"
            >
              <Printer size={15} />
              <span>Export / Print</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onUploadNew}
            >
              <RotateCcw size={15} />
              <span>Upload New</span>
            </button>
          </div>
        </div>

        {/* Role Calibration Selector Bar */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {isLive ? 'Discipline View (Switch to Benchmark Rubrics):' : 'Switch Benchmark Discipline:'}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {TARGET_ROLES.map((r) => {
              const isSelected = r.id === selectedRoleId;
              const hasLiveResult = initialResult && initialResult.roleId === r.id && !initialResult.isDemoSample;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 600 : 500,
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {hasLiveResult && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#ffffff' : 'var(--color-success)'
                      }}
                      title="Live analysis active for this role"
                    />
                  )}
                  <span>{r.title}</span>
                  {hasLiveResult && <span style={{ opacity: 0.85, fontSize: '0.7rem' }}>(Live)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Banner */}
        {isLive ? (
          <div
            role="status"
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)'
            }}
          >
            <strong style={{ color: 'var(--color-success)' }}>Personalized Live Analysis: </strong>
            This scorecard was generated by Prep Pilot&apos;s Spring Boot backend using Apache PDFBox/POI text extraction and Gemini AI evaluation for <strong style={{ color: 'var(--text-primary)' }}>{activeResult.fileName}</strong> against the <strong style={{ color: 'var(--text-primary)' }}>{activeResult.roleTitle}</strong> rubric.
          </div>
        ) : (
          <div
            role="status"
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)'
            }}
          >
            <strong style={{ color: 'var(--color-info)' }}>Reference Benchmark Example: </strong>
            This scorecard demonstrates the target schema, scoring dimensions, and recommendation layout using curated industry benchmark data for <strong>{activeResult.roleTitle}</strong>. It is <strong>not</strong> an analysis of an uploaded resume.
          </div>
        )}

        {/* Next-step callout */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            backgroundColor: 'rgba(232, 90, 11, 0.04)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Badge variant="orange" icon={<Compass size={12} />}>
                Personalized learning
              </Badge>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '0.35rem' }}>
              Bridge Your Diagnosed Gaps with a Personalized Learning Roadmap
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Convert identified missing keywords into a milestone-by-milestone curriculum attached exclusively with verified, 100% free tutorials and documentation from FreeCodeCamp, MDN, and official docs.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => onGenerateRoadmap(activeResult)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Compass size={16} />
            <span>Generate Learning Roadmap</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <section aria-labelledby="friendly-results-title" style={{ margin: '2rem 0' }}>
          <h2 id="friendly-results-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Here&apos;s how your resume looks for this role.</h2>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div aria-label={`Resume match score ${activeResult.score.overall} out of 100`} role="img" style={{ width: 86, height: 86, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `conic-gradient(var(--accent-primary) ${Math.max(0, Math.min(100, activeResult.score.overall))}%, var(--border-subtle) 0)` }}>
              <span style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--bg-card)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{activeResult.score.overall}<small style={{ fontSize: '.65rem' }}>/100</small></span>
            </div>
            <div><strong>{activeResult.score.verdict === 'Ready for Application' ? 'Strong match' : activeResult.score.verdict === 'Strong Contender' ? 'Good start, with a few improvements' : 'Needs some important updates'}</strong><p style={{ color: 'var(--text-secondary)', margin: '.3rem 0 0' }}>This score compares the resume with the selected role&apos;s criteria. It does not predict hiring outcomes or guarantee that a screening system will accept it.</p></div>
          </div>
          {activeResult.isDemoSample && <p role="status" className="card" style={{ padding: '1rem', marginTop: '1rem' }}>This is a reference example, not an analysis of your resume.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}><h3>What you already do well</h3><ul>{activeResult.strengths.slice(0, 3).map((item) => <li key={item.id}><strong>{item.title}:</strong> {item.description}</li>)}</ul></div>
            <div className="card" style={{ padding: '1.25rem' }}><h3>Three improvements to consider</h3><ol>{activeResult.sectionIssues.filter((issue) => issue.severity !== 'positive').slice(0, 3).map((issue) => <li key={issue.id}><strong>{issue.title}:</strong> {issue.recommendation} <span style={{ color: 'var(--text-muted)' }}>This may help recruiters and screening software find relevant details more easily.</span></li>)}{activeResult.sectionIssues.filter((issue) => issue.severity !== 'positive').length === 0 && activeResult.keywords.missingKeywords.slice(0, 3).map((item) => <li key={item.keyword}><strong>{item.keyword}:</strong> {item.rationale} {item.suggestedContext}</li>)}</ol></div>
          </div>
          {activeResult.bulletImprovements[0] && <div className="card" style={{ padding: '1.25rem', marginTop: '1rem' }}><h3>Example wording improvement</h3><p><strong>Before:</strong> {activeResult.bulletImprovements[0].original}</p><p><strong>Suggested structure:</strong> {activeResult.bulletImprovements[0].improved}</p><p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>Use only details and results that are true for your experience; verify every number before adding it.</p></div>}
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1rem' }}><button type="button" className="btn btn-outline" onClick={() => { const details = document.getElementById('technical-findings') as HTMLDetailsElement | null; if (details) { details.open = true; details.scrollIntoView({ behavior: 'smooth' }); } }}>See What I Can Improve</button><button type="button" className="btn btn-primary" onClick={() => onGenerateRoadmap(activeResult)}>Build My Learning Plan</button></div>
        </section>
        <details id="technical-findings" style={{ marginTop: '2rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>Detailed findings (including ATS terms)</summary>
          <div style={{ paddingTop: '1rem' }}>
        {/* 1. Mandatory Disclaimer Banner */}
        <DisclaimerBanner />

        {/* 2. ATS Score Card with Breakdown Gauges */}
        <ScoreCard
          score={activeResult.score}
          fileName={activeResult.fileName}
          roleTitle={activeResult.roleTitle}
        />

        {/* 3. Strengths Card */}
        <StrengthsCard strengths={activeResult.strengths} />

        {/* 4. Missing Keywords & Gap Analysis Card */}
        <KeywordAnalysisCard keywords={activeResult.keywords} />

        {/* 5. Section-by-Section ATS Diagnostic */}
        <SectionBreakdownCard issues={activeResult.sectionIssues} />

        {/* 6. Google XYZ Bullet Point Transformations */}
        <BulletTransformCard improvements={activeResult.bulletImprovements} />
          </div>
        </details>

        {/* Bottom Navigation CTA */}
        <div
          style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            marginTop: '3rem'
          }}
        >
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            Ready to bridge your skill gaps or audit another resume?
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Generate a personalized learning roadmap with 100% free vetted resources, or analyze a different resume.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onGenerateRoadmap(activeResult)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Compass size={18} />
              <span>Generate Roadmap for {activeResult.roleTitle}</span>
            </button>
            {onStartInterview && (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => onStartInterview(activeResult)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                <Brain size={18} color="var(--accent-primary)" />
                <span>Practice in Mock Interview</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onUploadNew}
            >
              <span>Upload Another Resume</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
