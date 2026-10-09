import type { InterviewSummary } from '../types/interview';

export const BENCHMARK_INTERVIEWS: Record<string, InterviewSummary> = {
  'full-stack-developer': {
    sessionId: 'benchmark-session-fsd',
    roleId: 'full-stack-developer',
    roleTitle: 'Full-Stack Developer',
    interviewType: 'mixed',
    difficulty: 'intermediate',
    totalQuestions: 5,
    answeredQuestions: 5,
    overallPracticeScore: 84,
    scoringExplanation: 'Arithmetic mean calculated from 5 completed question evaluations: [82, 88, 79, 91, 80].',
    topStrengths: [
      'Crisp articulation of React reconciliation and DOM batching',
      'Solid architectural trade-off discussion between relational and document datastores',
      'Demonstrated accountability and STAR structure during the incident postmortem behavioral question',
      'Clear understanding of idempotent HTTP verbs in REST API design'
    ],
    criticalImprovementAreas: [
      'Quantify latency impact and database indexing strategies when discussing query optimization',
      'Explicitly mention distributed cache invalidation strategies (e.g. Cache-Aside pattern)',
      'Detail retrospective action items taken to prevent recurring deployment regressions'
    ],
    recommendedPracticeActivities: [
      'Practice drawing sequence diagrams for end-to-end user authentication flows',
      'Review RFC 7231 method specifications and HTTP caching headers',
      'Practice answering behavioral questions using the STAR framework within a 2-minute limit',
      'Build a small full-stack feature with automated integration tests using Testcontainers'
    ],
    recommendedResources: [
      {
        title: 'MDN Web Docs — HTTP Caching & Idempotency',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
        provider: 'Mozilla MDN',
        skillCovered: 'RESTful APIs',
        freeStatus: '100% Free',
        type: 'Documentation'
      },
      {
        title: 'FreeCodeCamp — System Design & Microservices Guide',
        url: 'https://www.freecodecamp.org/news/systems-design-for-beginners/',
        provider: 'FreeCodeCamp',
        skillCovered: 'System Architecture',
        freeStatus: '100% Free',
        type: 'Tutorial'
      },
      {
        title: 'React Official Documentation — State Preservation & Effects',
        url: 'https://react.dev/learn/preserving-and-resetting-state',
        provider: 'React Core Team',
        skillCovered: 'React & Frontend State',
        freeStatus: '100% Free',
        type: 'Documentation'
      }
    ],
    nextSessionRecommendation: 'Excellent demonstration of intermediate full-stack competencies. Recommend attempting the Advanced tier for high-concurrency architecture practice.',
    practiceDisclaimer: 'Prep Pilot practice scorecard is designed for diagnostic learning and does not guarantee or predict actual employment outcomes.',
    questionResults: [
      {
        question: {
          id: 'q-1',
          questionNumber: 1,
          totalQuestions: 5,
          category: 'technical',
          competency: 'RESTful API Design',
          questionText: 'What makes an HTTP method idempotent, and how would you design an API endpoint for processing monetary payments safely against duplicate network retries?',
          difficulty: 'intermediate'
        },
        answerText: 'An idempotent HTTP method produces the same side effect regardless of how many times it is executed. For payment processing, POST is not naturally idempotent, so I would implement Idempotency-Key headers stored in Redis with atomic SETNX to prevent duplicate credit card charges.',
        feedback: {
          questionId: 'q-1',
          score: 88,
          strengths: ['Identified that POST is non-idempotent by default', 'Proposed Idempotency-Key header with Redis distributed lock'],
          improvementAreas: ['Detail payload fingerprinting to prevent parameter tampering with the same idempotency key'],
          missingConcepts: ['Cryptographic payload hashing for idempotency verification'],
          suggestedAnswer: 'Idempotency ensures identical side effects on duplicate execution. For payments, clients submit an Idempotency-Key header. The server verifies whether a transaction with that key already completed or is in-flight using an atomic datastore like Redis, returning the cached response if repeated.',
          nextStep: 'Read Stripe\'s engineering guide on designing idempotent APIs.',
          rubricType: 'technical',
          practiceDisclaimer: 'Practice evaluation only — not predictive of employment outcomes.'
        },
        answered: true
      },
      {
        question: {
          id: 'q-2',
          questionNumber: 2,
          totalQuestions: 5,
          category: 'behavioral',
          competency: 'Ownership & Incident Management',
          questionText: 'Tell me about a time when a change you pushed to production caused an unexpected issue or outage. How did you handle communication and remediation?',
          difficulty: 'intermediate'
        },
        answerText: 'In my last project, an unindexed database migration caused API latency to surge to 12 seconds during peak traffic. When automated PagerDuty alerts fired, I acknowledged the incident in Slack #war-room, immediately rolled back the release pipeline, and verified traffic stabilized. Afterward, I authored a blameless postmortem and added pre-deployment query execution plan linting.',
        feedback: {
          questionId: 'q-2',
          score: 91,
          strengths: ['Exemplary STAR framework delivery', 'Demonstrated personal ownership without shifting blame', 'Mentioned proactive preventive guardrails (query plan linting)'],
          improvementAreas: ['Briefly mention stakeholder status updates for non-technical users'],
          missingConcepts: ['Customer impact SLA communication'],
          suggestedAnswer: 'Clear, structured answer demonstrating ownership, swift rollback, blameless reflection, and continuous architectural improvement.',
          nextStep: 'Continue using this exact 4-part STAR structure for incident and failure questions.',
          rubricType: 'star-behavioral',
          practiceDisclaimer: 'Practice evaluation only — not predictive of employment outcomes.'
        },
        answered: true
      }
    ]
  }
};

