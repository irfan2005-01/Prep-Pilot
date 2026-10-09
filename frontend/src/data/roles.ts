import type { TargetRole } from '../types/resume';

export const TARGET_ROLES: TargetRole[] = [
  {
    id: 'full-stack-developer',
    title: 'Full-Stack Developer',
    category: 'Software Engineering',
    description: 'End-to-end web architecture, distributed services, relational/NoSQL datastores, and modern reactive interfaces.',
    popularSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'RESTful APIs', 'Next.js', 'CI/CD'],
    recommendedKeywords: ['Microservices', 'GraphQL', 'AWS/GCP', 'Unit Testing', 'Redis', 'State Management', 'System Design'],
    minExperienceLevel: 'Entry to Mid-Level (0 - 4 yrs)'
  },
  {
    id: 'java-developer',
    title: 'Java Developer',
    category: 'Enterprise Engineering',
    description: 'Enterprise server-side architecture, Spring Boot ecosystem, JVM tuning, concurrency, and persistent transactional systems.',
    popularSkills: ['Java 17/21', 'Spring Boot', 'Spring Data JPA', 'Hibernate', 'PostgreSQL', 'Maven/Gradle', 'JUnit 5', 'Kafka'],
    recommendedKeywords: ['Microservices Architecture', 'Multithreading', 'Spring Security', 'Docker', 'Kubernetes', 'Design Patterns (SOLID)', 'Liquibase/Flyway'],
    minExperienceLevel: 'Entry to Mid-Level (0 - 4 yrs)'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Quantitative modeling, exploratory data analysis, business intelligence dashboards, and SQL analytics.',
    popularSkills: ['SQL', 'Python (Pandas, NumPy)', 'Tableau / PowerBI', 'Excel (VBA/Power Query)', 'Statistical Analysis', 'A/B Testing'],
    recommendedKeywords: ['Data Cleansing', 'ETL Pipelines', 'Data Visualization', 'Hypothesis Testing', 'Cohort Analysis', 'Stakeholder Communication'],
    minExperienceLevel: 'Entry to Mid-Level (0 - 3 yrs)'
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'Artificial Intelligence',
    description: 'ML lifecycle, feature engineering, model training & quantization, MLOps, deep learning frameworks, and LLM orchestration.',
    popularSkills: ['Python', 'PyTorch / TensorFlow', 'Scikit-Learn', 'Hugging Face', 'MLflow', 'Docker', 'FastAPI', 'Pandas'],
    recommendedKeywords: ['Model Fine-Tuning', 'Vector Databases (Chroma/Pinecone)', 'RAG Pipelines', 'Hyperparameter Optimization', 'ONNX Runtime', 'Distributed Training'],
    minExperienceLevel: 'Junior to Mid-Level (0 - 4 yrs)'
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'User Interface Engineering',
    description: 'Modern component-driven frontends, web performance optimization, accessible UI/UX, responsive CSS, and state management.',
    popularSkills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML5 / Modern CSS', 'REST / GraphQL', 'Vite', 'Jest / Vitest'],
    recommendedKeywords: ['Core Web Vitals', 'Accessibility (WCAG AA)', 'Responsive Design', 'State Architecture (Redux/Zustand)', 'Micro-Frontends', 'Lighthouse Optimization'],
    minExperienceLevel: 'Entry to Mid-Level (0 - 3 yrs)'
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Server & Systems Engineering',
    description: 'High-throughput APIs, database normalization and query tuning, caching architectures, asynchronous messaging, and security.',
    popularSkills: ['Node.js / Go / Java', 'PostgreSQL', 'Redis', 'Docker', 'REST / gRPC', 'Git', 'Linux / Bash', 'RabbitMQ / Kafka'],
    recommendedKeywords: ['Database Indexing', 'OAuth2 / JWT Authentication', 'Distributed Caching', 'Rate Limiting', 'Event-Driven Architecture', 'System Scalability'],
    minExperienceLevel: 'Entry to Mid-Level (0 - 4 yrs)'
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Information Security',
    description: 'Threat modeling, vulnerability assessment, SIEM monitoring, penetration testing fundamentals, and compliance standards.',
    popularSkills: ['Network Security', 'Wireshark', 'SIEM (Splunk / Elastic)', 'Linux Security', 'Python / Bash Scripting', 'OWASP Top 10', 'NIST Framework'],
    recommendedKeywords: ['Incident Response', 'Vulnerability Scanning (Nessus)', 'Identity & Access Management (IAM)', 'Penetration Testing', 'Firewalls & IDS/IPS', 'Zero Trust Architecture'],
    minExperienceLevel: 'Entry to Mid-Level (0 - 3 yrs)'
  }
];

export const DEFAULT_ROLE = TARGET_ROLES[0];

