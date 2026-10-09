import type { ResumeAnalysisResult, TargetRoleId } from '../types/resume';

export const BENCHMARK_RESULTS: Record<TargetRoleId, ResumeAnalysisResult> = {
  'full-stack-developer': {
    roleId: 'full-stack-developer',
    roleTitle: 'Full-Stack Developer',
    fileName: 'Alex_Chen_FullStack_Resume.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 78,
      verdict: 'Strong Contender',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 72,
          weight: 35,
          description: 'Evaluates alignment with high-frequency ATS job description keywords and core engineering competencies.',
          status: 'good'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 82,
          weight: 30,
          description: 'Measures metric-driven phrasing, action verbs, and Google XYZ achievement formula density.',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 88,
          weight: 20,
          description: 'Checks for single-column structure, standard fonts, parsable headers, and absence of tables or image text.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 75,
          weight: 15,
          description: 'Validates presence of vital sections: Contact Info, Technical Skills, Experience, Education, and Production Projects.',
          status: 'good'
        }
      }
    },
    strengths: [
      {
        id: 'str-1',
        title: 'Effective Metric Quantification in Work History',
        description: 'Demonstrated measurable engineering impact (e.g., "reduced query latency by 42%", "scaled to 15,000 active users"). Recruiter eye-tracking studies prioritize concrete numbers.',
        category: 'Impact',
        highlightedText: 'Reduced latency by 42% across 15,000 active users'
      },
      {
        id: 'str-2',
        title: 'Modern Full-Stack Technology Stack Alignment',
        description: 'Explicit coverage of modern reactive frontend frameworks (React, TypeScript) paired with relational databases (PostgreSQL) and containerization (Docker).',
        category: 'Skills',
        highlightedText: 'React, TypeScript, Node.js, PostgreSQL, Docker'
      },
      {
        id: 'str-3',
        title: 'Clean ATS-Friendly Layout Architecture',
        description: 'Standard chronological structure without nested tables, multi-column sidebars, or floating graphic containers that confuse legacy ATS parsers (Taleo, Workday).',
        category: 'Formatting'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'React', frequency: 6, importance: 'essential' },
        { keyword: 'TypeScript', frequency: 4, importance: 'essential' },
        { keyword: 'Node.js', frequency: 5, importance: 'essential' },
        { keyword: 'PostgreSQL', frequency: 3, importance: 'essential' },
        { keyword: 'RESTful APIs', frequency: 4, importance: 'essential' },
        { keyword: 'Docker', frequency: 2, importance: 'high' },
        { keyword: 'Git', frequency: 3, importance: 'high' },
        { keyword: 'Tailwind CSS', frequency: 2, importance: 'medium' }
      ],
      missingKeywords: [
        {
          keyword: 'CI/CD Pipelines (GitHub Actions / Jenkins)',
          importance: 'essential',
          rationale: '92% of Full-Stack job listings require continuous integration and automated test/deployment pipeline familiarity.',
          suggestedContext: 'Detail how you deployed your projects using GitHub Actions or automated Docker build workflows.'
        },
        {
          keyword: 'Distributed Caching / Redis',
          importance: 'high',
          rationale: 'Full-stack systems evaluation focuses heavily on state caching, session management, and rate-limiting.',
          suggestedContext: 'Mention caching hot queries or session state via Redis in your backend projects.'
        },
        {
          keyword: 'Automated Unit / E2E Testing (Jest / Playwright)',
          importance: 'high',
          rationale: 'ATS filters specifically scan for testing frameworks to gauge production readiness and engineering maturity.',
          suggestedContext: 'Include test coverage percentages or test suites authored with Vitest, Jest, or Cypress.'
        },
        {
          keyword: 'System Design & Scalability',
          importance: 'medium',
          rationale: 'Mid-level recruiter screening algorithms elevate resumes referencing architectural patterns and load handling.',
          suggestedContext: 'Highlight architectural decisions: microservices decoupling, database indexing, or horizontal scaling.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-1',
        section: 'Summary / Objective',
        severity: 'improvement',
        title: 'Generic Objective Statement Instead of Value Proposition',
        issue: 'Your opening statement begins with "Motivated computer science student seeking an entry-level position...", which focuses on what you want rather than what you bring to the team.',
        recommendation: 'Replace with a 2-line Professional Summary: "Full-Stack Software Engineer specializing in React, TypeScript, and distributed Node.js/PostgreSQL services. Built production systems handling 10k+ daily queries with 99.8% uptime."'
      },
      {
        id: 'sec-2',
        section: 'Skills & Competencies',
        severity: 'improvement',
        title: 'Uncategorized Skills List',
        issue: 'Technical skills are presented in a continuous comma-separated list without categorical breakdown (Languages, Frameworks, Databases, Tools).',
        recommendation: 'Group into clear categories: Languages (TypeScript, JavaScript, Python, SQL), Frontend (React, HTML5, CSS3), Backend (Node.js, Express, PostgreSQL), DevOps & Tools (Docker, Git, Vite).'
      },
      {
        id: 'sec-3',
        section: 'Work Experience',
        severity: 'critical',
        title: 'Passive Responsibility Phrasing in Project/Work Bullets',
        issue: 'Several bullet points start with passive phrases like "Responsible for developing the API" or "Assisted team members with testing".',
        recommendation: 'Always initiate bullets with strong action verbs: "Engineered RESTful API endpoints...", "Architected responsive UI components...", "Automated regression tests..."'
      },
      {
        id: 'sec-4',
        section: 'Projects',
        severity: 'positive',
        title: 'Strong Live Deployment Links & GitHub Citations',
        issue: 'All projects include active GitHub repositories and production demo URLs, significantly increasing recruiter click-through rates.',
        recommendation: 'Retain clickable hyperlinks; ensure link anchor text reads "GitHub Repository" rather than raw unformatted URLs for maximum ATS cleanliness.'
      }
    ],
    bulletImprovements: [
      {
        id: 'b-1',
        section: 'E-Commerce Platform (Full-Stack Project)',
        original: 'Worked on the checkout page and integrated Stripe for processing payments.',
        improved: 'Architected end-to-end checkout pipeline with Stripe API & webhook validation, reducing cart abandonment by 18% and processing $45K+ in simulated transactions across 1,200 test users.',
        critique: 'The original bullet lacks context on how the feature was engineered, the technical challenge handled (webhooks, validation), and the business/system impact.',
        formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)'
      },
      {
        id: 'b-2',
        section: 'Software Engineering Intern (Summer 2024)',
        original: 'Responsible for writing database queries and fixing slow backend performance.',
        improved: 'Optimized 14 relational PostgreSQL queries using composite indexing and query plan analysis, slashing p95 response latency from 680ms to 95ms under peak traffic.',
        critique: '"Responsible for" is a passive duty descriptor. Specifying exact database optimizations and measurable latency drops (680ms -> 95ms) proves tangible engineering competence.',
        formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)'
      },
      {
        id: 'b-3',
        section: 'Task Management App',
        original: 'Created a task tracking tool with React and Redux with authentication.',
        improved: 'Engineered responsive single-page task workspace utilizing React, TypeScript, and Redux Toolkit with JWT-based session security, achieving a 98/100 Google Lighthouse performance score.',
        critique: 'Fails to emphasize TypeScript, authentication mechanisms, or performance standards. The improved version incorporates specific tech stack choices and quantifiable Lighthouse metrics.',
        formula: 'Action-Metric-Result'
      }
    ]
  },
  'java-developer': {
    roleId: 'java-developer',
    roleTitle: 'Java Developer',
    fileName: 'Rohan_Sharma_Java_Backend.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 82,
      verdict: 'Strong Contender',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 84,
          weight: 35,
          description: 'Alignment with Spring Boot ecosystem, JVM internals, persistence, and enterprise design patterns.',
          status: 'excellent'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 79,
          weight: 30,
          description: 'Measurement of throughput, latency, concurrency handling, and system reliability metrics.',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 86,
          weight: 20,
          description: 'Document structure, clean headings, standard font encoding, and absence of non-text glyphs.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 80,
          weight: 15,
          description: 'Presence of enterprise project descriptions, testing frameworks, and database schema citations.',
          status: 'good'
        }
      }
    },
    strengths: [
      {
        id: 'str-j1',
        title: 'Deep Spring Boot & Hibernate Ecosystem Coverage',
        description: 'Clear articulation of Spring Data JPA, Spring Security, and REST controller architecture.',
        category: 'Skills',
        highlightedText: 'Java 21, Spring Boot 3, Hibernate, Spring Security'
      },
      {
        id: 'str-j2',
        title: 'Concurrency & Multi-Threading Citations',
        description: 'Mention of Java Virtual Threads (Project Loom) or ExecutorService demonstrates modern Java 21 proficiency.',
        category: 'Impact',
        highlightedText: 'Handled 5,000 concurrent socket connections via Java 21 Virtual Threads'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'Java 21', frequency: 5, importance: 'essential' },
        { keyword: 'Spring Boot', frequency: 7, importance: 'essential' },
        { keyword: 'Spring Data JPA', frequency: 3, importance: 'essential' },
        { keyword: 'PostgreSQL', frequency: 4, importance: 'essential' },
        { keyword: 'JUnit 5 / Mockito', frequency: 3, importance: 'high' },
        { keyword: 'Maven', frequency: 2, importance: 'high' }
      ],
      missingKeywords: [
        {
          keyword: 'Apache Kafka / RabbitMQ',
          importance: 'essential',
          rationale: 'Enterprise Java roles heavily filter for asynchronous message brokering and event-driven patterns.',
          suggestedContext: 'Detail message consumption, producer dead-letter queues, or asynchronous notification workflows.'
        },
        {
          keyword: 'Microservices & Spring Cloud',
          importance: 'high',
          rationale: 'Recruiters scan for API Gateway, Eureka/Consul service discovery, or distributed tracing (Micrometer/Zipkin).',
          suggestedContext: 'Describe how services communicated over REST or gRPC in a decoupled architecture.'
        },
        {
          keyword: 'Docker & Containerization',
          importance: 'high',
          rationale: 'Modern enterprise deployment mandates containerized JVM builds and multi-stage Dockerfiles.',
          suggestedContext: 'Include containerization of Spring Boot JARs in project descriptions.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-j1',
        section: 'Work Experience',
        severity: 'critical',
        title: 'Missing Database Indexing & Transaction Context',
        issue: 'Mentions building CRUD endpoints without discussing transactional isolation, connection pooling (HikariCP), or indexing.',
        recommendation: 'Highlight database considerations: "Engineered transactional financial ledger using Spring Data JPA with @Version optimistic locking to prevent double-spending."'
      },
      {
        id: 'sec-j2',
        section: 'Skills & Competencies',
        severity: 'improvement',
        title: 'Java Version Unspecified in Header',
        issue: 'Listing simply "Java" without version cues can make recruiters assume outdated Java 8 experience.',
        recommendation: 'Explicitly specify: "Java (17 & 21, Records, Pattern Matching, Virtual Threads)" to stand out.'
      }
    ],
    bulletImprovements: [
      {
        id: 'bj-1',
        section: 'Banking Gateway Microservice',
        original: 'Built a payment processing API using Spring Boot and connected it to MySQL.',
        improved: 'Developed high-concurrency payment ingestion API utilizing Spring Boot 3, HikariCP, and PostgreSQL, processing 2,400 transactions/second with sub-40ms latency and 99.95% uptime.',
        critique: 'Original is passive and misses high-concurrency details that Java recruiters prioritize.',
        formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)'
      }
    ]
  },
  'data-analyst': {
    roleId: 'data-analyst',
    roleTitle: 'Data Analyst',
    fileName: 'Priya_Nair_Data_Analyst.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 74,
      verdict: 'Strong Contender',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 70,
          weight: 35,
          description: 'Validation against SQL complexity, business intelligence tools, and exploratory data analysis libraries.',
          status: 'good'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 78,
          weight: 30,
          description: 'Measurement of business value delivered, executive decisions influenced, and revenue/cost optimizations.',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 85,
          weight: 20,
          description: 'Formatting structure, tabular data safety, and clean metric visibility.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 68,
          weight: 15,
          description: 'Portfolio visibility, case studies, and statistical methodologies.',
          status: 'needs-work'
        }
      }
    },
    strengths: [
      {
        id: 'str-d1',
        title: 'Strong SQL and Data Wrangling Tooling',
        description: 'Explicit mention of complex SQL window functions, CTEs, and Python Pandas data transformation pipelines.',
        category: 'Skills',
        highlightedText: 'SQL (Window functions, CTEs, self-joins), Python (Pandas, NumPy)'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'SQL', frequency: 8, importance: 'essential' },
        { keyword: 'Python (Pandas)', frequency: 5, importance: 'essential' },
        { keyword: 'Tableau', frequency: 3, importance: 'essential' },
        { keyword: 'Excel (VLOOKUP, Pivot)', frequency: 4, importance: 'high' }
      ],
      missingKeywords: [
        {
          keyword: 'A/B Testing & Statistical Hypothesis Testing',
          importance: 'essential',
          rationale: 'Modern tech companies demand experiment analysis: p-values, sample sizing, and confidence intervals.',
          suggestedContext: 'Detail an experiment where you evaluated conversion lift across user cohorts.'
        },
        {
          keyword: 'ETL Pipelines / Data Warehouse (Snowflake / BigQuery)',
          importance: 'high',
          rationale: 'Analysts frequently interface with cloud warehouses rather than raw transactional databases.',
          suggestedContext: 'Cite querying data warehouses like BigQuery or orchestrating ETL jobs.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-d1',
        section: 'Projects',
        severity: 'critical',
        title: 'Lack of Business Decision Outcomes',
        issue: 'Project descriptions focus solely on charts created without detailing what business action was taken based on those findings.',
        recommendation: 'Frame findings around ROI: "Synthesized cohort churn analysis in Tableau, uncovering a 24% onboarding drop-off that informed product redesign."'
      }
    ],
    bulletImprovements: [
      {
        id: 'bd-1',
        section: 'Customer Analytics Dashboard',
        original: 'Created Tableau dashboards for sales team to see monthly revenue numbers.',
        improved: 'Engineered automated executive Tableau dashboard querying 450K+ SQL records, reducing weekly reporting overhead by 12 hours and identifying a $140K cross-sell opportunity.',
        critique: 'Shows both operational efficiency savings (12 hours/week) and financial revenue impact ($140K).',
        formula: 'Action-Metric-Result'
      }
    ]
  },
  'ml-engineer': {
    roleId: 'ml-engineer',
    roleTitle: 'Machine Learning Engineer',
    fileName: 'Karan_Verma_MLE_Resume.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 80,
      verdict: 'Strong Contender',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 82,
          weight: 35,
          description: 'Assessment against deep learning architectures, MLOps tooling, and mathematical rigor.',
          status: 'excellent'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 80,
          weight: 30,
          description: 'Model performance benchmarks (F1-score, BLEU, latency, inference GPU cost).',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 84,
          weight: 20,
          description: 'Mathematical symbol encoding and standard layout readability.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 72,
          weight: 15,
          description: 'Research publications, Kaggle/HuggingFace benchmarks, and production deployments.',
          status: 'good'
        }
      }
    },
    strengths: [
      {
        id: 'str-m1',
        title: 'Clear Model Metrics and Evaluation Criteria',
        description: 'Correctly cited precision, recall, and inference latency rather than relying on raw accuracy.',
        category: 'Impact',
        highlightedText: 'Improved F1-score from 0.74 to 0.89 while pruning model parameters by 35%'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'PyTorch', frequency: 5, importance: 'essential' },
        { keyword: 'Scikit-Learn', frequency: 4, importance: 'essential' },
        { keyword: 'FastAPI', frequency: 3, importance: 'high' },
        { keyword: 'Docker', frequency: 2, importance: 'high' }
      ],
      missingKeywords: [
        {
          keyword: 'Vector Databases (Chroma / Milvus / Pinecone)',
          importance: 'essential',
          rationale: 'Generative AI and RAG application stacks are mandatory keywords for 2024-2026 hiring filters.',
          suggestedContext: 'Detail semantic search or RAG embeddings indexing with ChromaDB or FAISS.'
        },
        {
          keyword: 'Model Deployment & MLOps (MLflow / ONNX / Triton)',
          importance: 'high',
          rationale: 'ML Engineer roles prioritize production serving and monitoring over isolated Jupyter experiments.',
          suggestedContext: 'Describe model quantization or containerized serving via Triton or ONNX.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-m1',
        section: 'Projects',
        severity: 'critical',
        title: 'Jupyter-Only Perception',
        issue: 'Resume reads like academic coursework without clear evidence of model deployment to an API endpoint or edge device.',
        recommendation: 'Highlight the serving layer: "Packaged PyTorch model via ONNX runtime within a Dockerized FastAPI container deployed on AWS EC2."'
      }
    ],
    bulletImprovements: [
      {
        id: 'bm-1',
        section: 'LLM Document Search',
        original: 'Trained a language model to find relevant documents from a dataset.',
        improved: 'Constructed an end-to-end RAG question-answering pipeline using Llama-3, LangChain, and ChromaDB, lifting retrieval precision by 28% and achieving sub-350ms generation latency.',
        critique: 'Transitions from vague "trained a model" to modern architectural specifics with tangible latency and precision gains.',
        formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)'
      }
    ]
  },
  'frontend-developer': {
    roleId: 'frontend-developer',
    roleTitle: 'Frontend Developer',
    fileName: 'Sarah_Lin_Frontend_Engineer.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 85,
      verdict: 'Ready for Application',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 88,
          weight: 35,
          description: 'Focus on modern ECMAScript/TypeScript, component lifecycles, and state management.',
          status: 'excellent'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 83,
          weight: 30,
          description: 'Core Web Vitals improvements, conversion lifts, and bundle size reduction metrics.',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 90,
          weight: 20,
          description: 'Clean hierarchy, standard section headers, and semantic typography.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 78,
          weight: 15,
          description: 'Design systems, live interactive links, and open-source contributions.',
          status: 'good'
        }
      }
    },
    strengths: [
      {
        id: 'str-f1',
        title: 'Exceptional Performance Optimization Metrics',
        description: 'Quantified bundle reduction and Core Web Vitals (LCP, FID/INP, CLS) optimization.',
        category: 'Impact',
        highlightedText: 'Reduced bundle payload by 44% through dynamic imports, raising Lighthouse to 96'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'React 18/19', frequency: 7, importance: 'essential' },
        { keyword: 'TypeScript', frequency: 6, importance: 'essential' },
        { keyword: 'Tailwind CSS', frequency: 4, importance: 'high' },
        { keyword: 'Next.js', frequency: 3, importance: 'high' }
      ],
      missingKeywords: [
        {
          keyword: 'Web Accessibility (WCAG 2.1 AA / ARIA)',
          importance: 'essential',
          rationale: 'Hiring teams rigorously check for accessibility compliance and keyboard navigation design.',
          suggestedContext: 'Cite building accessible components adhering to WCAG 2.1 AA with axe-core automated audits.'
        },
        {
          keyword: 'End-to-End Testing (Playwright / Cypress)',
          importance: 'high',
          rationale: 'Frontend automation testing is a vital differentiator between junior and production-ready engineers.',
          suggestedContext: 'Mention authoring automated UI test suites in Playwright with CI execution.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-f1',
        section: 'Skills & Competencies',
        severity: 'improvement',
        title: 'Include Design Tool Collaboration',
        issue: 'No mention of Figma or design token translation in your technical toolset.',
        recommendation: 'Add Figma / Storybook / Design Tokens to demonstrate close collaboration with product design teams.'
      }
    ],
    bulletImprovements: [
      {
        id: 'bf-1',
        section: 'SaaS Analytics Dashboard UI',
        original: 'Designed components for analytics charts and made the website responsive on phones.',
        improved: 'Architected reusable component library in React 19 + TypeScript adhering to WCAG 2.1 AA; boosted mobile conversion by 22% and decreased LCP by 1.2s across 80K monthly visitors.',
        critique: 'Replaces generic "designed components" with concrete architectural leadership and business performance gains.',
        formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)'
      }
    ]
  },
  'backend-developer': {
    roleId: 'backend-developer',
    roleTitle: 'Backend Developer',
    fileName: 'Marcus_Vance_Backend_Engineer.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 81,
      verdict: 'Strong Contender',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 83,
          weight: 35,
          description: 'Backend protocols (HTTP/2, gRPC, WebSocket), database optimization, and caching.',
          status: 'excellent'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 80,
          weight: 30,
          description: 'Throughput metrics (QPS/RPS), latency percentiles (p50/p95/p99), and fault tolerance.',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 87,
          weight: 20,
          description: 'Document clarity and parser friendliness.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 75,
          weight: 15,
          description: 'Infrastructure context and architectural descriptions.',
          status: 'good'
        }
      }
    },
    strengths: [
      {
        id: 'str-b1',
        title: 'Clear Throughput and Concurrency Metrics',
        description: 'Quantified system load handling and latency mitigation with concrete percentiles.',
        category: 'Impact',
        highlightedText: 'Scaled microservice to support 4,500 RPS with p99 latency under 45ms'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'PostgreSQL', frequency: 5, importance: 'essential' },
        { keyword: 'Redis', frequency: 4, importance: 'essential' },
        { keyword: 'Docker', frequency: 3, importance: 'high' },
        { keyword: 'REST APIs', frequency: 6, importance: 'essential' }
      ],
      missingKeywords: [
        {
          keyword: 'Message Queues (Kafka / RabbitMQ)',
          importance: 'essential',
          rationale: 'Essential for distributed decoupling and resilient asynchronous job processing.',
          suggestedContext: 'Detail pub/sub architectures or task workers with RabbitMQ/Celery or Kafka.'
        },
        {
          keyword: 'Database Indexing & Query Profiling (EXPLAIN ANALYZE)',
          importance: 'high',
          rationale: 'Shows deep comprehension of relational query execution plans and index strategies.',
          suggestedContext: 'Highlight query execution plan analysis and index tuning on high-volume tables.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-b1',
        section: 'Work Experience',
        severity: 'improvement',
        title: 'Include Security & Auth Specifics',
        issue: 'Mentions "authentication" without indicating whether OAuth2, JWT with refresh rotation, or RBAC was implemented.',
        recommendation: 'Specify exact auth protocols: "Implemented OAuth2 / JWT authentication with Redis token revocation and rate limiting (sliding window)."'
      }
    ],
    bulletImprovements: [
      {
        id: 'bb-1',
        section: 'High-Throughput Notification Engine',
        original: 'Built a backend service to send user notifications and emails.',
        improved: 'Engineered asynchronous notification service with Redis pub/sub and bullmq workers, dispatching 120K+ daily notifications with 99.98% delivery rate and zero message drop.',
        critique: 'Quantifies volume, delivery reliability, and specific async technology stack.',
        formula: 'Action-Metric-Result'
      }
    ]
  },
  'cybersecurity-analyst': {
    roleId: 'cybersecurity-analyst',
    roleTitle: 'Cybersecurity Analyst',
    fileName: 'Aisha_Tariq_CyberSecurity_Resume.pdf',
    analyzedAt: 'Calibrated Benchmark Report',
    isDemoSample: true,
    score: {
      overall: 76,
      verdict: 'Strong Contender',
      categories: {
        keywordMatch: {
          label: 'Role Keyword Match',
          score: 75,
          weight: 35,
          description: 'Coverage of security frameworks (NIST, MITRE ATT&CK), SIEM monitoring, and compliance.',
          status: 'good'
        },
        contentImpact: {
          label: 'Impact & Quantification',
          score: 74,
          weight: 30,
          description: 'Incident response reduction times (MTTD/MTTR) and vulnerability remediation volume.',
          status: 'good'
        },
        atsParsability: {
          label: 'ATS Parsability & Format',
          score: 86,
          weight: 20,
          description: 'Format readability and clean security certifications display.',
          status: 'excellent'
        },
        structureCompleteness: {
          label: 'Structural Integrity',
          score: 70,
          weight: 15,
          description: 'Certifications section (Security+, CEH) and lab environments (TryHackMe, HackTheBox).',
          status: 'good'
        }
      }
    },
    strengths: [
      {
        id: 'str-c1',
        title: 'Practical Hands-On Lab Rankings & Certifications',
        description: 'Demonstrated initiative through top 5% TryHackMe ranking and CompTIA Security+ certification.',
        category: 'Skills',
        highlightedText: 'CompTIA Security+ (SY0-701), Top 4% on TryHackMe (120+ rooms solved)'
      }
    ],
    keywords: {
      matchedKeywords: [
        { keyword: 'Wireshark', frequency: 3, importance: 'essential' },
        { keyword: 'SIEM (Splunk)', frequency: 4, importance: 'essential' },
        { keyword: 'OWASP Top 10', frequency: 2, importance: 'essential' },
        { keyword: 'Linux', frequency: 5, importance: 'high' }
      ],
      missingKeywords: [
        {
          keyword: 'MITRE ATT&CK Framework Mapping',
          importance: 'essential',
          rationale: 'Standard taxonomy used by enterprise SOC teams to classify tactics, techniques, and procedures (TTPs).',
          suggestedContext: 'Detail mapping detected intrusions and log alerts against MITRE ATT&CK techniques.'
        },
        {
          keyword: 'Incident Response Lifecycle (MTTD / MTTR)',
          importance: 'high',
          rationale: 'Hiring managers look for key security operations metrics: Mean Time to Detect and Remediate.',
          suggestedContext: 'Cite speeding up triage or reducing incident response times in simulated or internship scenarios.'
        }
      ]
    },
    sectionIssues: [
      {
        id: 'sec-c1',
        section: 'Summary / Objective',
        severity: 'improvement',
        title: 'Highlight Clearance or Certifications First',
        issue: 'Valuable security credentials (e.g., Security+) are buried at the bottom of page two.',
        recommendation: 'Place key certifications in the top header adjacent to your name: "Aisha Tariq | CompTIA Security+ Certified".'
      }
    ],
    bulletImprovements: [
      {
        id: 'bc-1',
        section: 'SOC Operations Internship',
        original: 'Monitored Splunk dashboard for security alerts and investigated suspicious events.',
        improved: 'Triaged 350+ weekly SIEM alerts in Splunk, mapping findings to MITRE ATT&CK techniques; cut false-positive alerts by 32% through customized correlation rule tuning.',
        critique: 'Turns passive alert watching into active operational tuning and framework mapping with a 32% noise reduction.',
        formula: 'Google XYZ (Accomplished X, measured by Y, by doing Z)'
      }
    ]
  }
};
