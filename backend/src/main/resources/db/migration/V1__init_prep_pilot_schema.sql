-- Prep Pilot Database Schema V1
-- Team Nexora: Student Identity, Resume Analysis, Personalized Roadmaps, and Mock Interviews

-- 1. Student Profiles / Anonymous Ownership Identity
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY,
    student_token VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(128),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_token ON students(student_token);

-- 2. Resume Analyses (Privacy-preserving: metadata & structured insights, NO raw resume PDF or text)
CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL,
    role_title VARCHAR(128) NOT NULL,
    overall_score INTEGER NOT NULL,
    match_status VARCHAR(64) NOT NULL,
    summary TEXT NOT NULL,
    score_categories_json TEXT NOT NULL,
    strengths_json TEXT NOT NULL,
    skill_gaps_json TEXT NOT NULL,
    keyword_analysis_json TEXT NOT NULL,
    section_breakdown_json TEXT NOT NULL,
    bullet_improvements_json TEXT NOT NULL,
    target_role_info_json TEXT NOT NULL,
    disclaimer TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_student ON resume_analyses(student_id, created_at DESC);

-- 3. Personalized Learning Roadmaps
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL,
    role_title VARCHAR(128) NOT NULL,
    total_estimated_hours INTEGER NOT NULL,
    total_weeks INTEGER NOT NULL,
    current_strengths_json TEXT NOT NULL,
    prioritized_gaps_json TEXT NOT NULL,
    capstone_title VARCHAR(255) NOT NULL,
    capstone_description TEXT NOT NULL,
    capstone_hours INTEGER NOT NULL,
    capstone_skills_json TEXT NOT NULL,
    capstone_deliverables_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_student ON learning_roadmaps(student_id, created_at DESC);

-- 4. Roadmap Milestones & Completion Tracking
CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id UUID PRIMARY KEY,
    roadmap_id UUID NOT NULL REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
    milestone_order INTEGER NOT NULL,
    milestone_key VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    objective TEXT NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    estimated_hours INTEGER NOT NULL,
    skills_covered_json TEXT NOT NULL,
    practical_exercise TEXT NOT NULL,
    completion_criteria TEXT NOT NULL,
    resources_json TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_roadmap ON roadmap_milestones(roadmap_id, milestone_order ASC);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_key ON roadmap_milestones(roadmap_id, milestone_key);

-- 5. Mock Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL,
    role_title VARCHAR(128) NOT NULL,
    interview_type VARCHAR(32) NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    initial_total_questions INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answered_count INTEGER NOT NULL DEFAULT 0,
    overall_score INTEGER,
    score_explanation TEXT,
    top_strengths_json TEXT,
    critical_gaps_json TEXT,
    recommended_activities_json TEXT,
    recommended_resources_json TEXT,
    next_session_recommendation TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
    is_finished BOOLEAN NOT NULL DEFAULT FALSE,
    enable_follow_ups BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_student ON interview_sessions(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_sid ON interview_sessions(session_id);

-- 6. Interview Question Records & Evaluations
CREATE TABLE IF NOT EXISTS interview_question_records (
    id UUID PRIMARY KEY,
    interview_session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_key VARCHAR(64) NOT NULL,
    question_number INTEGER NOT NULL,
    category VARCHAR(64) NOT NULL,
    competency VARCHAR(128) NOT NULL,
    question_text TEXT NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    is_follow_up BOOLEAN NOT NULL DEFAULT FALSE,
    parent_question_id VARCHAR(64),
    user_answer TEXT,
    score INTEGER,
    strengths_json TEXT,
    improvement_areas_json TEXT,
    missing_concepts_json TEXT,
    suggested_answer TEXT,
    next_step TEXT,
    rubric_type VARCHAR(64),
    spoken_summary TEXT,
    answered BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_session ON interview_question_records(interview_session_id, question_number ASC);

