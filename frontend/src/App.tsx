import { useState } from 'react';
import type { TargetRole, ResumeAnalysisResult } from './types/resume';
import type { PersonalizedRoadmap, RoadmapGenerationPayload } from './types/roadmap';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { PillarsSection } from './components/landing/PillarsSection';
import { RoadmapSection } from './components/landing/RoadmapSection';
import { AnalyzerPage } from './components/analyzer/AnalyzerPage';
import { ResultsView } from './components/results/ResultsView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { BENCHMARK_RESULTS } from './data/benchmarkResults';
import { BENCHMARK_ROADMAPS } from './data/benchmarkRoadmaps';
import { DEFAULT_ROLE } from './data/roles';
import { generateRoadmapApi } from './services/roadmapService';

export function App() {
  const [activeView, setActiveView] = useState<'home' | 'analyzer' | 'results' | 'architecture' | 'roadmap'>('home');
  const [currentResult, setCurrentResult] = useState<ResumeAnalysisResult>(BENCHMARK_RESULTS[DEFAULT_ROLE.id]);
  const [currentRoadmap, setCurrentRoadmap] = useState<PersonalizedRoadmap | null>(
    BENCHMARK_ROADMAPS[DEFAULT_ROLE.id] || null
  );
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  const handleStartAnalysis = () => {
    setActiveView('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onExploreSample={handleExploreSample}
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
          />
        )}

        {activeView === 'results' && (
          <ResultsView
            initialResult={currentResult}
            onUploadNew={handleStartAnalysis}
            onGenerateRoadmap={handleGenerateRoadmap}
          />
        )}

        {activeView === 'roadmap' && (
          <RoadmapView
            key={currentRoadmap?.roleId || 'default-roadmap'}
            roadmap={currentRoadmap}
            isLoading={isGeneratingRoadmap}
            errorMessage={roadmapError}
            onRetry={handleRetryRoadmap}
            onBackToScorecard={handleBackToScorecard}
            onAnalyzeAnother={handleStartAnalysis}
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
