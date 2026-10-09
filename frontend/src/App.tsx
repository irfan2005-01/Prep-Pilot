import { useEffect, useState } from 'react';
import type { TargetRole, ResumeAnalysisResult } from './types/resume';
import type { PersonalizedRoadmap, RoadmapGenerationPayload } from './types/roadmap';
import type { InterviewSummary } from './types/interview';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { PillarsSection } from './components/landing/PillarsSection';
import { RoadmapSection } from './components/landing/RoadmapSection';
import { AnalyzerPage } from './components/analyzer/AnalyzerPage';
import { ResultsView } from './components/results/ResultsView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { InterviewSimulatorPage } from './components/interview/InterviewSimulatorPage';
import { StudentDashboardPage } from './components/dashboard/StudentDashboardPage';
import { BENCHMARK_RESULTS } from './data/benchmarkResults';
import { BENCHMARK_ROADMAPS } from './data/benchmarkRoadmaps';
import { DEFAULT_ROLE } from './data/roles';
import { generateRoadmapApi } from './services/roadmapService';
import { AuthPage } from './components/auth/AuthPage';
import { logout, restoreSession, type AuthUser } from './services/authService';
import { INITIAL_VIEW, navigationTransition, postAuthenticationView, resumeAnalysisTransition, type AppView } from './appNavigation';

type View = AppView;

export function App() {
  const [activeView, setActiveView] = useState<View>(INITIAL_VIEW);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [returnAfterAuth, setReturnAfterAuth] = useState<View>('analyzer');
  const [authNotice, setAuthNotice] = useState('');
  useEffect(() => { restoreSession().then(setUser).catch(() => setUser(null)).finally(() => setAuthReady(true)); }, []);
  useEffect(() => {
    if (!user) return;
    const timer = window.setInterval(() => {
      restoreSession().then((sessionUser) => {
        if (!sessionUser) { setUser(null); setActiveView((view) => view === 'dashboard' || view === 'interview' || view === 'roadmap' ? 'login' : view); }
      }).catch(() => { setUser(null); setActiveView((view) => view === 'dashboard' || view === 'interview' || view === 'roadmap' ? 'login' : view); });
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [user]);

  const navigate = (view: View) => {
    const transition = navigationTransition(view, Boolean(user), currentResult.isDemoSample);
    if (transition.requiresAuth) { setReturnAfterAuth(transition.returnTo); setAuthNotice('Sign in or create an account to continue.'); }
    setActiveView(transition.view);
  };
  const [currentResult, setCurrentResult] = useState<ResumeAnalysisResult>(BENCHMARK_RESULTS[DEFAULT_ROLE.id]);
  const [currentRoadmap, setCurrentRoadmap] = useState<PersonalizedRoadmap | null>(
    BENCHMARK_ROADMAPS[DEFAULT_ROLE.id] || null
  );
  const [currentInterviewSummary, setCurrentInterviewSummary] = useState<InterviewSummary | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  const handleStartAnalysis = () => {
    setActiveView('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requireResumeAuth = () => {
    const transition = resumeAnalysisTransition(Boolean(user));
    setReturnAfterAuth(transition.returnTo);
    setAuthNotice('Please sign in before selecting or uploading a resume. After signing in, choose your file to continue.');
    setActiveView(transition.view);
  };

  const handleViewBenchmarkReport = (role: TargetRole) => {
    const benchmark = BENCHMARK_RESULTS[role.id] || BENCHMARK_RESULTS['full-stack-developer'];
    setCurrentResult(benchmark);
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreSample = () => {
    setCurrentResult(BENCHMARK_RESULTS['full-stack-developer']);
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisSuccess = (result: ResumeAnalysisResult) => {
    setCurrentResult(result);
    // Clear previously cached roadmaps when a new resume is analyzed
    setCurrentRoadmap(null);
    setRoadmapError(null);
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateRoadmap = async (result: ResumeAnalysisResult) => {
    // If it's a benchmark sample and we already have a curated benchmark roadmap, use it
    if (result.isDemoSample && BENCHMARK_ROADMAPS[result.roleId]) {
      setCurrentRoadmap(BENCHMARK_ROADMAPS[result.roleId]);
      setRoadmapError(null);
      setActiveView('roadmap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Otherwise, call the backend AI roadmap generator
    setIsGeneratingRoadmap(true);
    setRoadmapError(null);
    setActiveView('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const payload: RoadmapGenerationPayload = {
      roleId: result.roleId,
      roleTitle: result.roleTitle,
      strengths: result.strengths.map((s) => s.title),
      missingKeywords: result.keywords.missingKeywords.map((k) => k.keyword),
      matchedKeywords: result.keywords.matchedKeywords.map((k) => k.keyword),
      currentScore: result.score.overall
    };

    try {
      const roadmap = await generateRoadmapApi(payload);
      setCurrentRoadmap(roadmap);
      setIsGeneratingRoadmap(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate personalized learning roadmap.';
      setRoadmapError(message);
      setIsGeneratingRoadmap(false);
    }
  };

  const handleRetryRoadmap = () => {
    handleGenerateRoadmap(currentResult);
  };

  const handleBackToScorecard = () => {
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartInterview = (roleOrResult?: TargetRole | ResumeAnalysisResult | string) => {
    if (!user) { setReturnAfterAuth('interview'); setAuthNotice('Sign in to practice and save your interview progress.'); setActiveView('login'); return; }
    if (roleOrResult && typeof roleOrResult === 'object' && 'roleId' in roleOrResult) {
      // It's a ResumeAnalysisResult or TargetRole with roleId
      const roleId = roleOrResult.roleId;
      const matched = BENCHMARK_RESULTS[roleId];
      if (matched && !currentResult) {
        setCurrentResult(matched);
      }
    }
    setCurrentInterviewSummary(null);
    setActiveView('interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDashboardResume = (result: ResumeAnalysisResult) => {
    setCurrentResult(result);
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDashboardRoadmap = (roadmap: PersonalizedRoadmap) => {
    setCurrentRoadmap(roadmap);
    setActiveView('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDashboardInterview = (summary: InterviewSummary) => {
    setCurrentInterviewSummary(summary);
    setActiveView('interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeView === 'login' || activeView === 'signup') return <AuthPage mode={activeView} notice={authNotice} onMode={setActiveView} onSuccess={(authenticatedUser) => { setUser(authenticatedUser); setAuthNotice(''); setActiveView(postAuthenticationView(returnAfterAuth)); }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activeView={activeView}
        setActiveView={navigate}
        onExploreSample={handleExploreSample}
        user={user}
        onSignIn={() => { setReturnAfterAuth('analyzer'); setAuthNotice(''); setActiveView('login'); }}
        onSignUp={() => { setReturnAfterAuth('analyzer'); setAuthNotice(''); setActiveView('signup'); }}
        onSignOut={async () => { try { await logout(); } finally { setUser(null); setActiveView('home'); } }}
      />

      <main style={{ flex: 1 }}>
        {activeView === 'home' && (
          <>
            <HeroSection
              onStartAnalysis={handleStartAnalysis}
              onViewBenchmark={handleExploreSample}
            />
            <PillarsSection onGoToAnalyzer={handleStartAnalysis} />
            <RoadmapSection />
          </>
        )}

        {activeView === 'analyzer' && (
          <AnalyzerPage
            onViewBenchmarkReport={handleViewBenchmarkReport}
            onAnalysisSuccess={handleAnalysisSuccess}
            isAuthenticated={Boolean(user)}
            authReady={authReady}
            onRequireAuth={requireResumeAuth}
          />
        )}

        {activeView === 'results' && (
          <ResultsView
            initialResult={currentResult}
            onUploadNew={handleStartAnalysis}
            onGenerateRoadmap={handleGenerateRoadmap}
            onStartInterview={handleStartInterview}
          />
        )}

        {activeView === 'roadmap' && (
          <RoadmapView
            key={currentRoadmap?.persistenceId || currentRoadmap?.roleId || 'default-roadmap'}
            roadmap={currentRoadmap}
            isLoading={isGeneratingRoadmap}
            errorMessage={roadmapError}
            onRetry={handleRetryRoadmap}
            onBackToScorecard={handleBackToScorecard}
            onAnalyzeAnother={handleStartAnalysis}
            onStartInterview={handleStartInterview}
          />
        )}

        {activeView === 'interview' && (
          <InterviewSimulatorPage
            key={currentInterviewSummary?.sessionId || 'fresh-interview'}
            initialRoleId={currentResult?.roleId || DEFAULT_ROLE.id}
            contextStrengths={currentResult?.strengths?.map((s) => s.title) || []}
            contextSkillGaps={currentResult?.keywords?.missingKeywords?.map((k) => k.keyword) || []}
            initialSummary={currentInterviewSummary}
            onNavigateToRoadmap={() => {
              setActiveView('roadmap');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAnalyzer={() => {
              setActiveView('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'dashboard' && (
          <StudentDashboardPage
            onViewResumeScorecard={handleViewDashboardResume}
            onViewRoadmap={handleViewDashboardRoadmap}
            onViewInterviewScorecard={handleViewDashboardInterview}
            onNavigateToAnalyzer={handleStartAnalysis}
            onNavigateToInterview={() => {
              setCurrentInterviewSummary(null);
              setActiveView('interview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'architecture' && (
          <div style={{ padding: '2rem 0' }}>
            <RoadmapSection />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
