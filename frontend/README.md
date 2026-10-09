# Prep Pilot — Frontend (Phase 1: Foundation & UI)

**Team**: Nexora  
**Tagline**: *"Your co-pilot from resume to offer."*

---

## Overview

This is the React 19 + TypeScript + Vite frontend application for **Prep Pilot**, an AI-powered placement-preparation platform.

Phase 1 establishes the design foundation, target role selection, client-side resume validation, and a comprehensive ATS diagnostic scorecard.

---

## Scripts

```bash
# Start Vite development server
npm run dev

# Run TypeScript type-check and Vite production build
npm run build

# Run Oxlint linter
npm run lint

# Preview production build locally
npm run preview
```

*(On Windows PowerShell, use `cmd /c npm run <command>` if script execution policy is restricted).*

---

## Structure

```
frontend/
├── src/
│   ├── assets/               # Static assets
│   ├── components/
│   │   ├── analyzer/         # Resume Analyzer (RoleSelector, Dropzone, FilePreview, PrivacyNotice, ProcessingState)
│   │   ├── landing/          # HeroSection, PillarsSection, RoadmapSection
│   │   ├── layout/           # Navbar, Footer
│   │   ├── results/          # ATS Scorecard (ScoreCard, Strengths, Keywords, SectionIssues, BulletTransforms, Disclaimer)
│   │   └── ui/               # Reusable UI primitives (Badge, Buttons)
│   ├── data/
│   │   ├── benchmarkResults.ts # Role-specific ATS benchmark datasets for UI demonstration
│   │   └── roles.ts          # 7 supported placement target roles
│   ├── types/
│   │   └── resume.ts         # Strictly typed domain models
│   ├── App.tsx               # Orchestrates Landing, Analyzer, Results, and Architecture views
│   ├── index.css             # Editorial Charcoal (#202123) & Warm Orange (#E85A0B) CSS system
│   └── main.tsx              # Application entry point
├── index.html                # Editorial typography (Fraunces & Plus Jakarta Sans) and metadata
├── package.json
└── tsconfig.app.json
```

---

## Phase 1 Deliverables Implemented

1. **Brand & Visual Direction**: Editorial charcoal (`#202123`), warm orange (`#E85A0B`), display serif headings, accessible focus indicators, reduced motion support.
2. **Target Roles**: Full-Stack Developer, Data Analyst, Machine Learning Engineer, Java Developer, Frontend Developer, Backend Developer, Cybersecurity Analyst.
3. **Dropzone & Validation**: Drag-and-drop, PDF & DOCX format filters, 5 MB file size checks, error notifications, file preview, remove control.
4. **Processing Pipeline Simulation**: Animated client verification steps transitioning cleanly into results inspection.
5. **ATS Scorecard Component**: Overall score gauge, 4 dimension sub-scores, strengths with quotes, missing keywords with rationale, section-by-section breakdown with severity tags, Google XYZ bullet transformations, and non-guarantee estimation disclaimer.
6. **Architectural Integrity**: Zero client-side API keys, zero unverified backend mock claims, zero resume persistence in `localStorage`.
