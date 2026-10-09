import type { PersonalizedRoadmap } from '../types/roadmap';

export const BENCHMARK_ROADMAPS: Record<string, PersonalizedRoadmap> = {
  'full-stack-developer': {
    roleId: 'full-stack-developer',
    roleTitle: 'Full-Stack Developer',
    generatedAt: 'Reference Benchmark Dataset',
    isDemoSample: true,
    totalEstimatedHours: 85,
    totalWeeks: 7,
    currentStrengths: ['JavaScript Fundamentals', 'HTML5 & CSS3 Layouts', 'REST API Consumption'],
    prioritizedGaps: [
      {
        skill: 'TypeScript & Strict Types',
        priority: 'critical',
        rationale: 'Industry-standard baseline for enterprise React and Node codebases.'
      },
      {
        skill: 'PostgreSQL & Database Design',
        priority: 'high',
        rationale: 'Required for building persistent, relational data layers with indexing.'
      },
      {
        skill: 'Docker & Containerization',
        priority: 'medium',
        rationale: 'Essential for reproducible microservice deployment and CI/CD pipelines.'
      }
    ],
    milestones: [
      {
        id: 'm-1',
        orderIndex: 1,
        title: 'Modern TypeScript & Type-Safe Architecture',
        objective: 'Transition from vanilla JavaScript to robust TypeScript with generics and strict null safety.',
        skillsCovered: ['TypeScript', 'JavaScript'],
        estimatedHours: 18,
        difficulty: 'beginner',
        resources: [
          {
            title: 'TypeScript for JavaScript Programmers',
            url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
            provider: 'Microsoft TypeScript',
            skillCovered: 'TypeScript',
            freeStatus: '100% Free',
            type: 'Documentation'
          },
          {
            title: 'MDN JavaScript Deep Dive',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            provider: 'MDN Web Docs',
            skillCovered: 'JavaScript',
            freeStatus: '100% Free',
            type: 'Documentation'
          }
        ],
        practicalExercise: 'Refactor an untyped React state model to use strict discriminated unions and generic API response envelopes.',
        completionCriteria: 'Pass tsc compiler checks with zero "any" types and zero compilation warnings.'
      },
      {
        id: 'm-2',
        orderIndex: 2,
        title: 'Relational Database Engineering with PostgreSQL',
        objective: 'Master schema migrations, foreign keys, transaction isolation levels, and indexing strategies.',
        skillsCovered: ['PostgreSQL', 'SQL'],
        estimatedHours: 20,
        difficulty: 'intermediate',
        resources: [
          {
            title: 'SQLBolt — Interactive SQL Lessons',
            url: 'https://sqlbolt.com/',
            provider: 'SQLBolt',
            skillCovered: 'SQL',
            freeStatus: '100% Free',
            type: 'Interactive Course'
          },
          {
            title: 'PostgreSQL Official Tutorial',
            url: 'https://www.postgresql.org/docs/current/tutorial.html',
            provider: 'PostgreSQL Global Development Group',
            skillCovered: 'PostgreSQL',
            freeStatus: '100% Free',
            type: 'Documentation'
          }
        ],
        practicalExercise: 'Design an e-commerce data model with users, orders, and products; optimize a multi-table JOIN with compound indexes.',
        completionCriteria: 'Explain plan query cost reduced by >80% after index creation.'
      },
      {
        id: 'm-3',
        orderIndex: 3,
        title: 'Production Backend APIs & Authentication',
        objective: 'Build resilient REST services with input validation, JWT token refresh rotations, and error handling.',
        skillsCovered: ['REST APIs', 'Node.js', 'Security'],
        estimatedHours: 22,
        difficulty: 'intermediate',
        resources: [
          {
            title: 'OWASP Top 10 Web Application Security',
            url: 'https://owasp.org/www-project-top-ten/',
            provider: 'OWASP Foundation',
            skillCovered: 'Security',
            freeStatus: '100% Free',
            type: 'Documentation'
          },
          {
            title: 'FreeCodeCamp Back End Development Curriculum',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            provider: 'FreeCodeCamp',
            skillCovered: 'Node.js & APIs',
            freeStatus: '100% Free',
            type: 'Interactive Course'
          }
        ],
        practicalExercise: 'Implement a secure authentication API with bcrypt hashing, HttpOnly refresh cookies, and rate limiting.',
        completionCriteria: 'Pass automated integration tests verifying token expiration and tampering rejection.'
      },
      {
        id: 'm-4',
        orderIndex: 4,
        title: 'Containerization & CI/CD Deployment',
        objective: 'Package frontend and backend services into multi-stage Docker images and configure automated testing pipelines.',
        skillsCovered: ['Docker', 'CI/CD', 'DevOps'],
        estimatedHours: 15,
        difficulty: 'advanced',
        resources: [
          {
            title: 'Docker Curriculum — Hands-On Guide',
            url: 'https://docker-curriculum.com/',
            provider: 'Docker Curriculum',
            skillCovered: 'Docker',
            freeStatus: '100% Free',
            type: 'Tutorial'
          },
          {
            title: 'Docker Official Get Started Guide',
            url: 'https://docs.docker.com/get-started/',
            provider: 'Docker Inc.',
            skillCovered: 'Docker',
            freeStatus: '100% Free',
            type: 'Documentation'
          }
        ],
        practicalExercise: 'Create a docker-compose.yml file linking React, Node/Spring, and PostgreSQL with environment configuration and persistent volumes.',
        completionCriteria: 'Spin up full multi-container environment with a single `docker compose up` command.'
      }
    ],
    capstoneProject: {
      title: 'DevPulse — Real-Time Developer Activity & Metrics Platform',
      description: 'A production-grade full-stack platform that aggregates GitHub commit webhooks, computes team velocity analytics, and displays live metrics on an interactive dashboard.',
      skillsDemonstrated: ['React', 'TypeScript', 'Node.js / Spring Boot', 'PostgreSQL', 'Docker'],
      deliverables: [
        'GitHub repository with monorepo or separated client/server architecture',
        'Normalized PostgreSQL schema with migrations and seed data',
        'Interactive dashboard with real-time updates and responsive UI',
        'Dockerfile and docker-compose.yml for zero-configuration startup'
      ],
      estimatedHours: 25
    }
  },

  'data-analyst': {
    roleId: 'data-analyst',
    roleTitle: 'Data Analyst',
    generatedAt: 'Reference Benchmark Dataset',
    isDemoSample: true,
    totalEstimatedHours: 80,
    totalWeeks: 7,
    currentStrengths: ['Python (Pandas, NumPy)', 'Relational Databases (SQL)', 'Statistical Foundations'],
    prioritizedGaps: [
      {
        skill: 'Tableau & Executive Dashboards',
        priority: 'critical',
        rationale: 'Primary business visualization tool expected in enterprise data teams.'
      },
      {
        skill: 'PowerBI & DAX Modeling',
        priority: 'high',
        rationale: 'Core Microsoft analytics suite used across finance and corporate operations.'
      },
      {
        skill: 'Advanced SQL Window Functions',
        priority: 'critical',
        rationale: 'Heavily tested in technical screening interviews for cohort analysis and ranking.'
      }
    ],
    milestones: [
      {
        id: 'm-1',
        orderIndex: 1,
        title: 'Advanced SQL Analytics & Window Functions',
        objective: 'Master RANK(), DENSE_RANK(), LAG(), LEAD(), and running totals over partitioned datasets.',
        skillsCovered: ['SQL', 'Data Analysis'],
        estimatedHours: 20,
        difficulty: 'intermediate',
        resources: [
          {
            title: 'SQLBolt — Complex Queries and Aggregations',
            url: 'https://sqlbolt.com/',
            provider: 'SQLBolt',
            skillCovered: 'SQL',
            freeStatus: '100% Free',
            type: 'Interactive Course'
          },
          {
            title: 'PostgreSQL Window Function Documentation',
            url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
            provider: 'PostgreSQL Global Development Group',
            skillCovered: 'SQL',
            freeStatus: '100% Free',
            type: 'Documentation'
          }
        ],
        practicalExercise: 'Write queries to compute month-over-month revenue growth, 7-day rolling active users, and customer cohort retention.',
        completionCriteria: 'Successfully solve 10 real-world SQL business case study scenarios.'
      },
      {
        id: 'm-2',
        orderIndex: 2,
        title: 'Business Intelligence & Tableau Storytelling',
        objective: 'Design interactive, stakeholder-ready dashboards with parameters, LOD expressions, and storytelling layouts.',
        skillsCovered: ['Tableau', 'Data Visualization'],
        estimatedHours: 20,
        difficulty: 'beginner',
        resources: [
          {
            title: 'Tableau Public Free Training Videos',
            url: 'https://www.tableau.com/learn/training/2022-1',
            provider: 'Salesforce Tableau',
            skillCovered: 'Tableau',
            freeStatus: '100% Free',
            type: 'Video Guide'
          },
          {
            title: 'Kaggle Data Visualization Course',
            url: 'https://www.kaggle.com/learn/data-visualization',
            provider: 'Kaggle',
            skillCovered: 'Data Visualization',
            freeStatus: '100% Free',
            type: 'Interactive Course'
          }
        ],
        practicalExercise: 'Build a multi-tab executive sales dashboard displaying KPI cards, geographic heatmaps, and trend projections.',
        completionCriteria: 'Publish a polished, interactive dashboard on Tableau Public.'
      },
      {
        id: 'm-3',
        orderIndex: 3,
        title: 'PowerBI & Star Schema Modeling',
        objective: 'Build semantic data models, create DAX measures, and implement row-level security filters.',
        skillsCovered: ['PowerBI', 'Data Modeling'],
        estimatedHours: 18,
        difficulty: 'intermediate',
        resources: [
          {
            title: 'Microsoft Learn: Power BI Training Curriculum',
            url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi',
            provider: 'Microsoft Learn',
            skillCovered: 'PowerBI',
            freeStatus: '100% Free',
            type: 'Tutorial'
          }
        ],
        practicalExercise: 'Transform raw multi-source CSV files into a normalized star schema with fact and dimension tables.',
        completionCriteria: 'Accurately calculate YTD, MTD, and YoY variances using custom DAX measures.'
      }
    ],
    capstoneProject: {
      title: 'Customer Churn & Revenue Intelligence Suite',
      description: 'An end-to-end analytical project analyzing customer behavior across 50,000 subscription accounts, identifying key churn indicators and modeling lifetime customer value.',
      skillsDemonstrated: ['SQL', 'Tableau', 'PowerBI', 'Python / Pandas'],
      deliverables: [
        'Exploratory data analysis Jupyter notebook with statistical testing',
        'Published Tableau Public dashboard with interactive cohort filters',
        'Executive summary document with 3 actionable business recommendations'
      ],
      estimatedHours: 22
    }
  }
};

