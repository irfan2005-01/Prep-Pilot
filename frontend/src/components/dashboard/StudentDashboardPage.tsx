import React, { useState, useEffect } from 'react';
import {
  User,
  Compass,
  FileSearch,
  Brain,
  Clock,
  Award,
  ChevronRight,
  RefreshCw,
  Trash2,
  Calendar,
  Layers,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import type {
  DashboardSummary,
  ResumeAnalysisHistoryItem,
  RoadmapHistoryItem,
  InterviewHistoryItem
} from '../../types/dashboard';
import type { ResumeAnalysisResult } from '../../types/resume';
import type { PersonalizedRoadmap } from '../../types/roadmap';
import type { InterviewSummary } from '../../types/interview';
import {
  fetchDashboardSummary,
  fetchAnalysisById,
  fetchRoadmapById,
  updateMilestoneProgress,
  fetchInterviewById,
  deleteAllStudentData
} from '../../services/dashboardService';

export interface StudentDashboardPageProps {
  onViewResumeScorecard: (result: ResumeAnalysisResult) => void;
  onViewRoadmap: (roadmap: PersonalizedRoadmap) => void;
  onViewInterviewScorecard: (summary: InterviewSummary) => void;
  onNavigateToAnalyzer: () => void;
  onNavigateToInterview: () => void;
}

type DashboardTab = 'overview' | 'resumes' | 'roadmaps' | 'interviews';

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onViewResumeScorecard,
  onViewRoadmap,
  onViewInterviewScorecard,
  onNavigateToAnalyzer,
  onNavigateToInterview
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Roadmaps milestone completion local tracking
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string | null>(null);
  const [loadedRoadmapDetails, setLoadedRoadmapDetails] = useState<Record<string, { roadmap: PersonalizedRoadmap; completion: Record<string, boolean> }>>({});

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchDashboardSummary();
      setSummary(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve candidate dashboard records.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const data = await fetchDashboardSummary();
        if (isMounted) setSummary(data);
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to retrieve candidate dashboard records.';
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenResume = async (id: string) => {
    setActionLoading(`resume-${id}`);
    try {
      const result = await fetchAnalysisById(id);
      onViewResumeScorecard(result);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not open historical scorecard.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRoadmapExpand = async (id: string) => {
    if (expandedRoadmapId === id) {
      setExpandedRoadmapId(null);
      return;
    }
    setExpandedRoadmapId(id);
    if (!loadedRoadmapDetails[id]) {
      setActionLoading(`roadmap-${id}`);
      try {
        const details = await fetchRoadmapById(id);
        setLoadedRoadmapDetails((prev) => ({
          ...prev,
          [id]: { roadmap: details.roadmap, completion: details.milestoneCompletion }
        }));
      } catch (err) {
        console.error('Failed to load roadmap details', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleToggleMilestone = async (roadmapId: string, milestoneKey: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistic local update
    setLoadedRoadmapDetails((prev) => {
      const current = prev[roadmapId];
      if (!current) return prev;
      return {
        ...prev,
        [roadmapId]: {
          ...current,
          completion: {
            ...current.completion,
            [milestoneKey]: nextStatus
          }
        }
      };
    });

    try {
      await updateMilestoneProgress(roadmapId, milestoneKey, nextStatus);
      // Refresh summary counts in background
      fetchDashboardSummary().then(setSummary).catch(() => {});
    } catch {
      // Revert optimistic update
      setLoadedRoadmapDetails((prev) => {
        const current = prev[roadmapId];
        if (!current) return prev;
        return {
          ...prev,
          [roadmapId]: {
            ...current,
            completion: {
              ...current.completion,
              [milestoneKey]: currentStatus
            }
          }
        };
      });
      alert('Could not save milestone status. Please check backend connection.');
    }
  };

  const handleOpenRoadmap = async (id: string) => {
    setActionLoading(`open-roadmap-${id}`);
    try {
      const details = await fetchRoadmapById(id);
      onViewRoadmap({ ...details.roadmap, persistenceId: details.roadmapId, milestoneCompletion: details.milestoneCompletion });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not open learning roadmap.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenInterview = async (sessionId: string) => {
    setActionLoading(`interview-${sessionId}`);
    try {
      const interview = await fetchInterviewById(sessionId);
      onViewInterviewScorecard(interview);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not open interview scorecard.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAllHistory = async () => {
    setIsDeleting(true);
    try {
      await deleteAllStudentData();
      setShowDeleteModal(false);
      await loadDashboard();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete history.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--accent-primary)',
              animation: 'spin 1s linear infinite'
            }}
          />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            Preparing your dashboard...
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Loading your progress and saved activity.
          </p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '650px', margin: '0 auto' }}>
        <div className="card card-elevated" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Unable to Connect to Student Persistence Engine
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            {errorMessage}
          </p>
          <button type="button" className="btn btn-primary" onClick={loadDashboard}>
            <RefreshCw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const hasAnyData =
    summary &&
    (summary.totalAnalyses > 0 || summary.totalRoadmaps > 0 || summary.totalInterviews > 0);

  return (
    <div className="container" style={{ paddingBlock: '2.5rem 5rem' }}>
      {/* Candidate Profile Header */}
      <div
        className="card card-elevated"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent-primary) 0%, rgba(232, 90, 11, 0.2) 100%)'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              flexShrink: 0
            }}
          >
            <User size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0
                }}
              >
                Student Dashboard
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '0.25rem' }}>
              Your resume feedback, learning plans, and interview practice in one place.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={loadDashboard}
            title="Refresh database records"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          {hasAnyData && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowDeleteModal(true)}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title="Delete all candidate history from database"
            >
              <Trash2 size={14} />
              Reset History
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Metric 1: Latest ATS Score */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Latest ATS Score
            </span>
            <Award size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {summary?.latestAtsScore !== null && summary?.latestAtsScore !== undefined ? summary.latestAtsScore : '—'}
            </span>
            {summary?.latestAtsScore !== null && summary?.latestAtsScore !== undefined && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
            )}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {summary?.latestRoleTarget ? `Calibrated for ${summary.latestRoleTarget}` : 'No resume analyzed yet'}
          </p>
        </div>

        {/* Metric 2: Total Analyzed Resumes */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Resume Diagnoses
            </span>
            <FileSearch size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {summary?.totalAnalyses || 0}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>evaluations</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {summary?.totalAnalyses ? 'Saved in PostgreSQL database' : 'Ready for upload'}
          </p>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Roadmap Mastery
            </span>
            <Compass size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {summary?.roadmapProgressPercentage || 0}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>completed</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '5px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: '999px',
              marginTop: '0.6rem',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${summary?.roadmapProgressPercentage || 0}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {summary?.completedMilestones || 0} of {summary?.totalMilestones || 0} milestones checked off
          </p>
        </div>

        {/* Metric 4: Interview Simulator */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Mock Interviews
            </span>
            <Brain size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {summary?.averageInterviewScore !== null && summary?.averageInterviewScore !== undefined
                ? summary.averageInterviewScore
                : '—'}
            </span>
            {summary?.averageInterviewScore !== null && summary?.averageInterviewScore !== undefined ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>avg score</span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>0 sessions</span>
            )}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {summary?.totalInterviews || 0} completed practice rounds
          </p>
        </div>
      </div>

      {/* Tabs Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}
      >
        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
        >
          <Layers size={16} />
          Overview & Next Steps
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'resumes' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumes')}
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
        >
          <FileSearch size={16} />
          Resume Analyses ({summary?.totalAnalyses || 0})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'roadmaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmaps')}
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
        >
          <Compass size={16} />
          Learning Roadmaps ({summary?.totalRoadmaps || 0})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'interviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('interviews')}
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}
        >
          <Brain size={16} />
          Interview Scorecards ({summary?.totalInterviews || 0})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Action Quick Launchers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div className="card card-elevated" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(232, 90, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}
                >
                  <FileSearch size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Resume Evaluation</h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Role Calibration</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', flex: 1, marginBottom: '1.25rem' }}>
                Upload your resume for real ATS parsing, keyword gap extraction, and bullet optimization.
              </p>
              <button type="button" className="btn btn-primary btn-sm" onClick={onNavigateToAnalyzer}>
                Analyze Resume
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="card card-elevated" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6'
                  }}
                >
                  <Brain size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Mock Interview Simulator</h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Voice & Text Simulation</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', flex: 1, marginBottom: '1.25rem' }}>
                Practice real technical and behavioral interview questions with voice recognition and instant feedback.
              </p>
              <button type="button" className="btn btn-outline btn-sm" onClick={onNavigateToInterview}>
                Start Mock Interview
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="card" style={{ padding: '1.75rem 2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
              Recent Candidate Activity
            </h3>

            {!hasAnyData ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                  No historical records found for this candidate profile yet.
                </p>
                <button type="button" className="btn btn-primary btn-sm" onClick={onNavigateToAnalyzer}>
                  Analyze Your First Resume
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {summary?.recentAnalyses?.map((a) => (
                  <div
                    key={`act-a-${a.id}`}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <FileSearch size={18} color="var(--accent-primary)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          Resume Analyzed for {a.roleTitle}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.analyzedAt}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(232, 90, 11, 0.12)',
                          color: 'var(--accent-primary)',
                          fontWeight: 600
                        }}
                      >
                        Score: {a.overallScore}/100
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
                        disabled={actionLoading === `resume-${a.id}`}
                        onClick={() => handleOpenResume(a.id)}
                      >
                        {actionLoading === `resume-${a.id}` ? 'Loading...' : 'Open Scorecard'}
                      </button>
                    </div>
                  </div>
                ))}

                {summary?.recentRoadmaps?.map((r) => (
                  <div
                    key={`act-r-${r.id}`}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <Compass size={18} color="#3b82f6" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          Learning Roadmap for {r.roleTitle}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.createdAt}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {r.completedMilestones} / {r.totalMilestones} done ({r.progressPercentage}%)
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
                        disabled={actionLoading === `open-roadmap-${r.id}`}
                        onClick={() => handleOpenRoadmap(r.id)}
                      >
                        {actionLoading === `open-roadmap-${r.id}` ? 'Loading...' : 'Open Roadmap'}
                      </button>
                    </div>
                  </div>
                ))}

                {summary?.recentInterviews?.map((i) => (
                  <div
                    key={`act-i-${i.id}`}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <Brain size={18} color="#10b981" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          Mock Interview ({i.interviewType}) — {i.roleTitle}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{i.createdAt}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {i.overallScore !== null && (
                        <span
                          style={{
                            fontSize: '0.82rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10b981',
                            fontWeight: 600
                          }}
                        >
                          Score: {i.overallScore}/100
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
                        disabled={actionLoading === `interview-${i.sessionId}`}
                        onClick={() => handleOpenInterview(i.sessionId)}
                      >
                        {actionLoading === `interview-${i.sessionId}` ? 'Loading...' : 'View Report'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RESUME HISTORICAL RECORDS */}
      {activeTab === 'resumes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {summary?.recentAnalyses && summary.recentAnalyses.length > 0 ? (
            summary.recentAnalyses.map((a: ResumeAnalysisHistoryItem) => (
              <div
                key={a.id}
                className="card card-elevated"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(232, 90, 11, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0
                    }}
                  >
                    <FileSearch size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                      {a.roleTitle}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                        {a.analyzedAt}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {a.matchStatus}
                      </span>
                    </div>
                    {a.summary && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '0.5rem', maxWidth: '600px' }}>
                        {a.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {a.overallScore}
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ATS Score</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={actionLoading === `resume-${a.id}`}
                    onClick={() => handleOpenResume(a.id)}
                  >
                    {actionLoading === `resume-${a.id}` ? 'Loading...' : 'View Scorecard'}
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <FileSearch size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                No Saved Resumes Yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Analyze any PDF or DOCX resume to extract real ATS diagnostics and save your scorecard permanently.
              </p>
              <button type="button" className="btn btn-primary" onClick={onNavigateToAnalyzer}>
                Upload & Analyze Resume
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LEARNING ROADMAPS */}
      {activeTab === 'roadmaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {summary?.recentRoadmaps && summary.recentRoadmaps.length > 0 ? (
            summary.recentRoadmaps.map((r: RoadmapHistoryItem) => {
              const details = loadedRoadmapDetails[r.id];
              const isExpanded = expandedRoadmapId === r.id;

              return (
                <div key={r.id} className="card card-elevated" style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.5rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(59, 130, 246, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#3b82f6',
                          flexShrink: 0
                        }}
                      >
                        <Compass size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                          {r.roleTitle}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                            {r.totalEstimatedHours} hours · {r.totalWeeks} weeks
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                            {r.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleToggleRoadmapExpand(r.id)}
                      >
                        {isExpanded ? 'Hide Checklist' : 'Track Milestones'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading === `open-roadmap-${r.id}`}
                        onClick={() => handleOpenRoadmap(r.id)}
                      >
                        {actionLoading === `open-roadmap-${r.id}` ? 'Loading...' : 'Open Full Roadmap'}
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {r.completedMilestones} of {r.totalMilestones} Milestones Completed
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.progressPercentage}%</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${r.progressPercentage}%`,
                          height: '100%',
                          backgroundColor: 'var(--accent-primary)',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Expandable Milestone Checklist */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '1.5rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Milestone Mastery Checklist
                      </h4>
                      {actionLoading === `roadmap-${r.id}` ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading milestones...</p>
                      ) : details?.roadmap?.milestones ? (
                        details.roadmap.milestones.map((m) => {
                          const isCompleted = details.completion[m.id] || false;
                          return (
                            <div
                              key={m.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input
                                  type="checkbox"
                                  id={`chk-${m.id}`}
                                  checked={isCompleted}
                                  onChange={() => handleToggleMilestone(r.id, m.id, isCompleted)}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    accentColor: 'var(--accent-primary)',
                                    cursor: 'pointer'
                                  }}
                                />
                                <label
                                  htmlFor={`chk-${m.id}`}
                                  style={{
                                    fontSize: '0.88rem',
                                    fontWeight: 500,
                                    color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    textDecoration: isCompleted ? 'line-through' : 'none'
                                  }}
                                >
                                  {m.title} ({m.estimatedHours}h)
                                </label>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.74rem',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                                  color: isCompleted ? '#10b981' : 'var(--text-muted)'
                                }}
                              >
                                {isCompleted ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No milestones recorded.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Compass size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                No Roadmaps Generated Yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Diagnose skill gaps and generate a step-by-step personalized curriculum with curated free resources.
              </p>
              <button type="button" className="btn btn-primary" onClick={onNavigateToAnalyzer}>
                Start with Resume Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MOCK INTERVIEW SCORECARDS */}
      {activeTab === 'interviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {summary?.recentInterviews && summary.recentInterviews.length > 0 ? (
            summary.recentInterviews.map((i: InterviewHistoryItem) => (
              <div
                key={i.id}
                className="card card-elevated"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0
                    }}
                  >
                    <Brain size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                      {i.roleTitle} Mock Interview
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-secondary)',
                          textTransform: 'capitalize'
                        }}
                      >
                        {i.interviewType} · {i.difficulty}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                        {i.answeredCount} of {i.totalQuestions} questions answered
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                        {i.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {i.overallScore !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: '#10b981' }}>
                        {i.overallScore}
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Performance</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={actionLoading === `interview-${i.sessionId}`}
                    onClick={() => handleOpenInterview(i.sessionId)}
                  >
                    {actionLoading === `interview-${i.sessionId}` ? 'Loading...' : 'View Scorecard'}
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Brain size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                No Completed Interviews Yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Take an interactive AI mock interview to practice STAR responses and technical questions with instant scoring.
              </p>
              <button type="button" className="btn btn-primary" onClick={onNavigateToInterview}>
                Start Mock Interview
              </button>
            </div>
          )}
        </div>
      )}

      {/* Safety Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="card card-elevated"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--accent-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ef4444' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>
                Reset Candidate Records?
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              This action will permanently delete all your analyzed resume scorecards, learning roadmaps, milestone progress,
              and mock interview evaluations from the persistent database. This cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
                onClick={handleDeleteAllHistory}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
