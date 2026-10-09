# Prep Pilot

> **"Your co-pilot from resume to offer."**  
> Developed by **Team Nexora** for national placement preparation excellence.

---

## Product Vision

Prep Pilot is an end-to-end placement preparation ecosystem that unites three critical experiences:
1. **AI Resume Analysis** *(Phase 1 UI & Phase 2 Real Backend Complete)*: Securely extracts text from PDF/DOCX resumes, calibrates them against industry role rubrics using Gemini AI with weighted heuristic scoring, highlights missing ATS keywords, and transforms bullet points into Google XYZ formula accomplishments.
2. **Personalized Learning Roadmaps** *(Phase 3 Complete)*: Converts diagnosed resume skill gaps and ATS deficiencies into ordered, milestone-by-milestone learning tracks curated exclusively with vetted, 100% free documentation and tutorials, culminating in an industry capstone project.
3. **Mock Interview Simulator** *(Phase 4 Planned)*: Realistic technical and HR behavioral interview practice with live rubric scorecards, STAR format evaluation, and historical progress telemetry.

---

## Brand & Visual Direction

- **Brand Name**: Prep Pilot
- **Team**: Nexora
- **Tagline**: *"Your co-pilot from resume to offer."*
- **Visual Aesthetic**: Premium, minimal, editorial design system:
  - **Charcoal Canvas**: Approximately `#202123` base background with elevated cards (`#25262a`, `#2f3036`).
  - **Warm Orange Accent**: `#E85A0B` (hover `#f2691b`, subtle glow `rgba(232, 90, 11, 0.12)`).
  - **Typography**: Editorial display serif (*Fraunces*) paired with modern interface sans (*Plus Jakarta Sans*) and technical monospace (*JetBrains Mono*).
  - **Motion & Accessibility**: Subtly animated states, WCAG AA contrast compliance, visible focus states, and `@media (prefers-reduced-motion: reduce)` support.

---

## Architectural Stack

| Layer | Technology | Status |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite | **Phase 1, 2 & 3 Complete** |
| **Styling** | Custom Editorial CSS Design System + Design Tokens | **Phase 1 Complete** |
| **Icons** | `lucide-react` | **Phase 1 Complete** |
| **Backend** | Java 21 + Spring Boot 3.4.3 (RESTful layered architecture) | **Phase 2 & 3 Complete** |
| **Document Extraction** | Apache PDFBox 3.0.4 & Apache POI 5.4.0 (OOXML) | **Phase 2 Complete** |
| **AI Integration** | Google Gemini API (gemini-3.5-flash / gemini-2.5-flash, server-side only) | **Phase 2 & 3 Complete** |
| **Resource Verification** | In-Memory Curated Allowlist Catalog (20+ verified domains) | **Phase 3 Complete** |
| **Database** | PostgreSQL | *Phase 5 Planned* |

---

## Phase 2 Implementation Features

### 1. Robust Java 21 + Spring Boot Backend (`backend/`)
- Layered architecture:
  - `controller/`: Thin REST controllers (`ResumeAnalysisController`, `HealthController`).
  - `service/`: Extraction (`ResumeExtractionService`), AI evaluation (`GeminiAnalysisService`), role registry (`RoleRegistry`).
  - `dto/`: Strongly-typed request/response DTOs matching the TypeScript contracts 1:1.
  - `config/`: CORS configuration, RestClient HTTP connection pooling with timeouts.
  - `exception/`: Typed exception hierarchy (`InvalidDocumentException`, `UnsupportedRoleException`, `GeminiServiceException`) with centralized `GlobalExceptionHandler`.

### 2. Secure Document Extraction (`ResumeExtractionService`)
- Strict magic byte validation:
  - PDF: `%PDF-` signature (`0x25 0x50 0x44 0x46 0x2D`).
  - DOCX: ZIP PK signature (`0x50 0x4B 0x03 0x04`) verified with Apache POI XWPF document structure.
- Defensive limits:
  - Max file size: 5 MB.
  - Max page count: 10 pages.
  - Max extracted text length: 50,000 characters.
  - Password-protected / encrypted PDF rejection.
  - Scanned / text-empty document rejection with clear user-facing messages.
- Privacy & security:
  - Zero permanent disk persistence in this phase.
  - Zero personal data logging (only file length and metadata logged).
  - Sanitization of null bytes and control characters.

### 3. Gemini AI Analysis Service (`GeminiAnalysisService`)
- Server-side only: API keys are never exposed to the frontend or browser.
- Prompt injection defense:
  - Extracted document text is encapsulated within strict boundary tags (`<UNTRUSTED_RESUME_CONTENT>`).
  - System prompt instructs the model to treat resume text strictly as passive data and ignore embedded instructions.
- Role-specific rubrics for 7 disciplines:
  1. *Full-Stack Developer* (`full-stack-developer`)
  2. *Data Analyst* (`data-analyst`)
  3. *Machine Learning Engineer* (`ml-engineer`)
  4. *Java Developer* (`java-developer`)
  5. *Frontend Developer* (`frontend-developer`)
  6. *Backend Developer* (`backend-developer`)
  7. *Cybersecurity Analyst* (`cybersecurity-analyst`)
- Weighted heuristic scoring formula:
  - **Role Keyword & Skill Match**: 35%
  - **Project & Experience Evidence**: 30%
  - **Measurable Impact & Metrics**: 20%
  - **Document Structure & ATS Parsability**: 15%
- Structured JSON output with automatic parsing, score clamping (0–100), and transient retry logic.

### 4. Real Frontend Integration (`frontend/`)
- `services/resumeService.ts`: Sends real `multipart/form-data` requests via native `fetch` (with abort signal support).
- `ProcessingState.tsx`: Real-time animated pipeline stages with cancellation controls.
- `AnalyzerPage.tsx`: Live analysis execution; stays on page with an explicit error alert on failure. **No silent fallback to benchmark data.**
- Explicit benchmark example button retained for demonstration and testing.
- `ResultsView.tsx`: Clearly differentiates between:
  - **Live AI ATS Diagnostic** (`isDemoSample: false`): Green badge, live file name, timestamp, and personalized evaluation banner.
  - **Reference Benchmark Example** (`isDemoSample: true`): Cyan banner, benchmark dataset tag, and example notice.

---

## Phase 3 Implementation Features

### 1. Dynamic AI Roadmap Generation (`RoadmapGenerationService`)
- Synthesizes real resume diagnostic gaps (`missingKeywords`, `matchedKeywords`, `strengths`, `currentScore`) with the selected role's industry expectations.
- Generates structured JSON roadmaps matching `PersonalizedRoadmapResponse`:
  - **Prioritized Skill Gaps**: Categorized as `critical`, `high`, or `medium` priority with custom rationales.
  - **Sequential Learning Milestones**: Estimated hours, difficulty rating, core objective, skills covered, hands-on practical exercises, and measurable completion criteria.
  - **Industry Capstone Project**: Role-relevant end-to-end portfolio capstone with realistic hour estimates and concrete deliverables.
  - **Realistic Study Timeline**: Total estimated hours and completion weeks calibrated from diagnosed deficiencies.
- Prompt injection defense: Candidate profile attributes are isolated inside `<UNTRUSTED_CANDIDATE_PROFILE>` XML delimiters with explicit instructions to ignore instructions contained within profile data.

### 2. Curated & Verified 100% Free Resources Catalog (`FreeResourceCatalog`)
- **Strict Allowlist Enforcement**: Restricts resource URLs strictly to verified, premier open-source and educational domains (e.g., `developer.mozilla.org`, `freecodecamp.org`, `docs.python.org`, `docs.oracle.com`, `spring.io`, `react.dev`, `typescriptlang.org`, `postgresql.org`, `sqlbolt.com`, `kaggle.com`, `owasp.org`, `docs.docker.com`, `kubernetes.io`, `github.com`).
- **Zero Hallucinated URLs or Paywalls**: Model-generated resource recommendations are cross-referenced and enriched against a curated in-memory catalog of official documentation, free full-length courses, and interactive tutorials.
- All attached resources are labeled with provider, format (`Documentation`, `Interactive Course`, `Video Guide`, `Cheat Sheet`), skill covered, and `100% Free` guarantee.

### 3. Interactive Progress Tracking & UX (`RoadmapView`)
- **Connected User Journey**: Direct transition from Resume Diagnostic scorecard into the personalized roadmap via the "Generate Learning Roadmap" CTA.
- **Client-Side Progress State**: Interactive milestone checkboxes, completed counter, and dynamic progress bar.
- **Privacy-Preserving Local Storage**: Checkbox progress is persisted locally in `localStorage` under keys scoped to role IDs (e.g. `prep_pilot_roadmap_progress_full-stack-developer`) without persisting sensitive resume text.
- **Fallback & Demo Roadmaps**: Pre-calibrated reference roadmaps available for all 7 roles for instant review without hitting AI quotas.

---

## Getting Started & Commands

### Prerequisites
- **Java**: JDK 21+ (e.g. `C:\Program Files\Java\jdk-21.0.12.1`)
- **Maven**: Apache Maven 3.9+
- **Node.js**: Node 18+ (tested on Node 20 / 22 / 24)
- **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

---

### Backend Setup & Execution

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Set your environment variables:
   ```bash
   # Linux / macOS / Git Bash
   export GEMINI_API_KEY="your-gemini-api-key"
   export SERVER_PORT=8080
   export GEMINI_MODEL="gemini-2.5-flash"
   export CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

   # Windows PowerShell
   $env:GEMINI_API_KEY="your-gemini-api-key"
   $env:SERVER_PORT="8080"
   $env:GEMINI_MODEL="gemini-2.5-flash"
   $env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
   ```

4. Run the automated backend test suite:
   ```bash
   mvn test
   ```

5. Start the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
   The backend will be available at `http://localhost:8080`.

---

### Frontend Setup & Execution

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   # VITE_API_BASE_URL defaults to http://localhost:8080
   ```

4. Run linter and production build:
   ```bash
   npm run lint
   npm run build
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

> **Windows PowerShell Note**: If running into script execution restrictions (`PSSecurityException`), prefix with `cmd /c`:
> ```powershell
> cmd /c npm run dev
> cmd /c npm run build
> cmd /c npm run lint
> ```

---

## API Endpoints

### 1. Resume Analysis
- **URL**: `POST /api/v1/resumes/analyze`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: PDF or DOCX file (max 5 MB).
  - `roleId`: One of the 7 supported role IDs (`full-stack-developer`, `data-analyst`, `ml-engineer`, `java-developer`, `frontend-developer`, `backend-developer`, `cybersecurity-analyst`).
- **Response**: `200 OK` with JSON payload matching `ResumeAnalysisResult` (`isDemoSample: false`).
- **Example cURL request**:
  ```bash
  curl -X POST http://localhost:8080/api/v1/resumes/analyze \
    -F "file=@/path/to/resume.pdf" \
    -F "roleId=full-stack-developer"
  ```

### 2. Learning Roadmap Generation
- **URL**: `POST /api/v1/roadmaps/generate`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "roleId": "data-analyst",
    "currentScore": 65,
    "missingKeywords": ["ETL", "Tableau", "PowerBI", "Excel"],
    "matchedKeywords": ["Python", "SQL"],
    "strengths": ["Strong foundational Python", "Database querying via SQL"],
    "summary": "Candidate exhibits solid data analysis foundations but lacks pipeline automation and visualization tooling."
  }
  ```
- **Response**: `200 OK` with JSON payload matching `PersonalizedRoadmapResponse` (`isDemoSample: false`), containing ordered milestones, verified free resources from official allowlisted domains, and an industry capstone project.
- **Example cURL request**:
  ```bash
  curl -X POST http://localhost:8080/api/v1/roadmaps/generate \
    -H "Content-Type: application/json" \
    -d "@payload.json"
  ```

### 3. Roadmap Engine Health Check
- **URL**: `GET /api/v1/roadmaps/health`
- **Response**: `200 OK`
  ```json
  {
    "status": "UP",
    "service": "Prep Pilot Roadmap Engine",
    "verifiedResourceDomains": 21
  }
  ```

### 4. System Health Check
- **URL**: `GET /api/v1/health`
- **Response**: `200 OK`
  ```json
  {
    "status": "UP",
    "service": "Prep Pilot Backend",
    "timestamp": "2026-10-09T14:15:30Z"
  }
  ```

---

## Boundaries & Next Phases

- **Phase 1, 2 & 3 Completed**:
  - Full-featured React 19 UI with responsive, accessible editorial design and tab navigation.
  - Real Java 21 + Spring Boot 3 backend with PDFBox/POI text parsing.
  - Server-side Gemini AI integration with 4-part weighted scoring rubric.
  - Clear delineation between live AI evaluations and pre-calibrated reference benchmarks.
  - Personalized Learning Roadmap Engine powered by Gemini AI and an allowlisted 100% free learning resource catalog.
  - Interactive milestone checklist and progress tracking persisted in `localStorage`.
- **Upcoming Phases**:
  - **Phase 4**: Technical and HR Mock Interview Simulator with STAR format scoring.
  - **Phase 5**: PostgreSQL persistence for historical interview scorecards and applicant tracking.
  - **Phase 6**: Production containerization (Docker Compose) and cloud deployment.

