import React from 'react';
import { ArrowDown, Code2, Database, FileText, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

const stack = [
  { icon: <Layers3 size={19} />, title: 'Web application', text: 'React 19, TypeScript, and Vite power the responsive student experience.' },
  { icon: <Code2 size={19} />, title: 'Application API', text: 'Java 21 and Spring Boot provide REST services, validation, and session-based authentication.' },
  { icon: <Database size={19} />, title: 'Student history', text: 'Spring Data JPA stores account activity in PostgreSQL; Flyway manages database migrations.' },
  { icon: <Sparkles size={19} />, title: 'AI and documents', text: 'The backend integrates Gemini and extracts resume text with Apache PDFBox and Apache POI.' },
  { icon: <ShieldCheck size={19} />, title: 'Account security', text: 'Passwords use BCrypt hashing. Server sessions and CSRF protection secure authenticated requests.' },
  { icon: <FileText size={19} />, title: 'Interview voice', text: 'Voice practice uses browser speech recognition and speech synthesis where supported.' },
];

export const RoadmapSection: React.FC = () => (
  <section aria-labelledby="architecture-title" style={{ padding: '4.5rem 0' }}>
    <div className="container">
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
        <Badge variant="orange" icon={<Layers3 size={13} />}>System Architecture</Badge>
        <h2 id="architecture-title" style={{ margin: '.85rem 0' }}>A clear path from preparation to progress</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Prep Pilot connects resume feedback, AI guidance, interview practice, and saved learning history through a secure application API.
        </p>
      </div>

      <div aria-label="Prep Pilot system flow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '.65rem', margin: '0 auto 2.5rem', padding: '1.25rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
        {['Student', 'Web Application', 'Spring Boot API', 'Gemini + PostgreSQL', 'Results + Learning History'].map((step, index) => (
          <React.Fragment key={step}>
            {index > 0 && <ArrowDown className="architecture-flow-arrow" size={17} aria-hidden="true" style={{ transform: 'rotate(-90deg)', color: 'var(--accent-primary)' }} />}
            <span style={{ padding: '.6rem .85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '.86rem', fontWeight: 600 }}>{step}</span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        {stack.map(({ icon, title, text }) => (
          <article className="card" key={title} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', marginBottom: '.55rem', color: 'var(--accent-primary)' }}>
              {icon}<h3 style={{ color: 'var(--text-primary)', fontSize: '.98rem', margin: 0 }}>{title}</h3>
            </div>
            <p style={{ fontSize: '.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{text}</p>
          </article>
        ))}
      </div>
      <p style={{ margin: '1rem 0 0', textAlign: 'center', fontSize: '.78rem', color: 'var(--text-muted)' }}>
        PostgreSQL is the application database. H2 is also configured for development and tests.
      </p>
    </div>
  </section>
);
