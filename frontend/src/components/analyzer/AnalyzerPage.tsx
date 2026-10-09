import { useState, useRef, type FC } from 'react';
import type { TargetRole, UploadedResumeFile, ResumeAnalysisResult } from '../../types/resume';
import { DEFAULT_ROLE } from '../../data/roles';
import { RoleSelector } from './RoleSelector';
import { Dropzone } from './Dropzone';
import { FilePreviewCard } from './FilePreviewCard';
import { PrivacyNotice } from './PrivacyNotice';
import { ProcessingState } from './ProcessingState';
import { Badge } from '../ui/Badge';
import { Sparkles, AlertCircle, ArrowRight, X } from 'lucide-react';
import { analyzeResumeApi } from '../../services/resumeService';

export interface AnalyzerPageProps {
  onViewBenchmarkReport: (role: TargetRole) => void;
  onAnalysisSuccess: (result: ResumeAnalysisResult) => void;
  isAuthenticated: boolean;
  authReady: boolean;
  onRequireAuth: () => void;
}

export const AnalyzerPage: FC<AnalyzerPageProps> = ({
  onViewBenchmarkReport,
  onAnalysisSuccess,
  isAuthenticated,
  authReady,
  onRequireAuth
}) => {
  const [selectedRole, setSelectedRole] = useState<TargetRole>(DEFAULT_ROLE);
  const [uploadedFile, setUploadedFile] = useState<UploadedResumeFile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileAccepted = (fileData: UploadedResumeFile) => {
    setUploadedFile(fileData);
    setErrorMessage(null);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleRemoveFile = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUploadedFile(null);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  const handleStartAnalysis = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await analyzeResumeApi(uploadedFile.file, selectedRole.id, controller.signal);
      setIsProcessing(false);
      onAnalysisSuccess(result);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setIsProcessing(false);
        return;
      }
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during resume analysis.';
      setIsProcessing(false);
      setErrorMessage(message);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
  };

  return (
    <section style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Badge variant="orange" icon={<Sparkles size={13} />}>
              AI Resume Analyzer — Spring Boot + Gemini AI
            </Badge>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              marginBottom: '0.75rem'
            }}
          >
            Know how ready your resume is.
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            See what is working, what could improve, and what to learn next for your target role.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '.75rem', marginBottom: '1.5rem' }} aria-label="How resume analysis works">
          {[['1', 'Upload your resume'], ['2', 'Understand strengths and gaps'], ['3', 'Get a personalized learning plan']].map(([step, label]) => <div key={step} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '.7rem' }}><span aria-hidden="true" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{step}</span><span style={{ fontSize: '.88rem' }}>{label}</span></div>)}
        </div>
        {!isAuthenticated ? <div className="card" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (authReady) onRequireAuth(); }} style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{authReady ? 'PDF or DOCX · up to 5 MB. Sign in before choosing a file. Your resume will only be uploaded after you start analysis.' : 'Checking your sign-in…'}</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={onRequireAuth} disabled={!authReady}><Sparkles size={18} /><span>Analyze My Resume</span><ArrowRight size={18} /></button>
          {authReady && <><p style={{ margin: '.85rem 0 0', color: 'var(--text-muted)', fontSize: '.82rem' }}>New to Prep Pilot? Choose “Create account” in the navigation.</p>
          <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => onViewBenchmarkReport(selectedRole)}>See a reference example</button></>}
        </div> : <>
        {/* If in processing view */}
        {isProcessing && uploadedFile ? (
          <ProcessingState
            fileData={uploadedFile}
            targetRole={selectedRole}
            onCancel={handleCancelAnalysis}
          />
        ) : (
          <div className="card" style={{ padding: '2rem' }}>
            {/* 1. Target Role Selector */}
            <RoleSelector
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />

            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '2rem 0' }} />

            {/* Error Message Toast / Alert */}
            {errorMessage && (
              <div
                role="alert"
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-error)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.88rem',
                  lineHeight: 1.5
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Analysis Failed: </strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    flexShrink: 0
                  }}
                  aria-label="Dismiss error notification"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* 2. Drag & Drop Upload Zone (Empty state vs Uploaded state) */}
            {!uploadedFile ? (
              <Dropzone
                onFileAccepted={handleFileAccepted}
                onError={handleError}
              />
            ) : (
              <FilePreviewCard
                fileData={uploadedFile}
                onRemove={handleRemoveFile}
              />
            )}

            {/* 3. Action Section */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onViewBenchmarkReport(selectedRole)}
                title="Inspect reference benchmark example for this role"
              >
                <Sparkles size={15} />
                <span>View Reference Benchmark Example for {selectedRole.title}</span>
              </button>

              {/* Analyze Button strictly disabled until a valid file is selected */}
              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={!uploadedFile || isProcessing}
                onClick={handleStartAnalysis}
                aria-disabled={!uploadedFile || isProcessing}
                title={!uploadedFile ? 'Please select a valid PDF or DOCX file to enable analysis' : `Analyze ${uploadedFile.name} for ${selectedRole.title} using Gemini AI`}
              >
                <Sparkles size={18} />
                <span>Analyze My Resume</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Helper status when button is disabled */}
            {!uploadedFile && (
              <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textAlign: 'right', marginTop: '0.45rem' }}>
                * Analyze button activates once a valid PDF or DOCX under 5 MB is selected.
              </p>
            )}

            {/* 4. Mandatory Privacy Notice */}
            <PrivacyNotice />
          </div>
        )}
        </>}
      </div>
    </section>
  );
};
