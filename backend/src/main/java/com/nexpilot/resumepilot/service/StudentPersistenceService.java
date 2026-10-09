package com.nexpilot.resumepilot.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.model.*;
import com.nexpilot.resumepilot.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class StudentPersistenceService {

    private static final Logger log = LoggerFactory.getLogger(StudentPersistenceService.class);

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapMilestoneRepository milestoneRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final InterviewQuestionRecordRepository questionRecordRepository;
    private final ObjectMapper objectMapper;

    public StudentPersistenceService(
        ResumeAnalysisRepository resumeAnalysisRepository,
        RoadmapRepository roadmapRepository,
        RoadmapMilestoneRepository milestoneRepository,
        InterviewSessionRepository interviewSessionRepository,
        InterviewQuestionRecordRepository questionRecordRepository,
        ObjectMapper objectMapper
    ) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.roadmapRepository = roadmapRepository;
        this.milestoneRepository = milestoneRepository;
        this.interviewSessionRepository = interviewSessionRepository;
        this.questionRecordRepository = questionRecordRepository;
        this.objectMapper = objectMapper;
    }

    // ==================== RESUME ANALYSES ====================

    @Transactional
    public ResumeAnalysisEntity saveResumeAnalysis(StudentEntity student, ResumeAnalysisResponse response) {
        try {
            ResumeAnalysisEntity entity = new ResumeAnalysisEntity();
            entity.setId(UUID.randomUUID());
            entity.setStudent(student);
            entity.setRoleId(response.roleId() != null ? response.roleId() : "software-engineer");
            entity.setRoleTitle(response.roleTitle() != null ? response.roleTitle() : "Software Engineer");
            entity.setOverallScore(response.score() != null ? response.score().overall() : 70);
            entity.setMatchStatus(response.score() != null ? response.score().verdict() : "Ready for Application");
            entity.setSummary(response.score() != null ? response.score().verdict() : "Candidate evaluation");
            entity.setScoreCategoriesJson(objectMapper.writeValueAsString(response.score() != null ? response.score().categories() : null));
            entity.setStrengthsJson(objectMapper.writeValueAsString(response.strengths() != null ? response.strengths() : Collections.emptyList()));
            entity.setSkillGapsJson("[]");
            entity.setKeywordAnalysisJson(objectMapper.writeValueAsString(response.keywords()));
            entity.setSectionBreakdownJson(objectMapper.writeValueAsString(response.sectionIssues() != null ? response.sectionIssues() : Collections.emptyList()));
            entity.setBulletImprovementsJson(objectMapper.writeValueAsString(response.bulletImprovements() != null ? response.bulletImprovements() : Collections.emptyList()));
            entity.setTargetRoleInfoJson(response.fileName() != null ? response.fileName() : "resume.pdf");
            entity.setDisclaimer("Prep Pilot ATS analysis is a diagnostic tool and does not guarantee job placement.");
            entity.setCreatedAt(Instant.now());

            ResumeAnalysisEntity saved = resumeAnalysisRepository.save(entity);
            log.info("Persisted resume analysis [{}]", saved.getId());
            return saved;
        } catch (Exception e) {
            log.error("Failed to persist resume analysis: {}", e.getMessage(), e);
            throw new RuntimeException("Could not persist resume analysis record", e);
        }
    }

    @Transactional(readOnly = true)
    public ResumeAnalysisResponse reconstructResumeAnalysis(ResumeAnalysisEntity entity) {
        try {
            ScoreCategoriesDto categories = entity.getScoreCategoriesJson() != null
                ? objectMapper.readValue(entity.getScoreCategoriesJson(), ScoreCategoriesDto.class)
                : new ScoreCategoriesDto(
                    new ScoreCategoryDto("Keyword Match", entity.getOverallScore(), 30, "Matched role keywords", "good"),
                    new ScoreCategoryDto("Content Impact", entity.getOverallScore(), 30, "Action verbs & metrics", "good"),
                    new ScoreCategoryDto("ATS Parsability", entity.getOverallScore(), 20, "Clean standard layout", "good"),
                    new ScoreCategoryDto("Structure & Completeness", entity.getOverallScore(), 20, "Required sections present", "good")
                );

            ScoreBreakdownDto score = new ScoreBreakdownDto(
                entity.getOverallScore(),
                entity.getMatchStatus(),
                categories
            );

            List<ResumeStrengthDto> strengths = entity.getStrengthsJson() != null
                ? objectMapper.readValue(entity.getStrengthsJson(), new TypeReference<List<ResumeStrengthDto>>() {})
                : Collections.emptyList();

            KeywordAnalysisDto keywords = entity.getKeywordAnalysisJson() != null
                ? objectMapper.readValue(entity.getKeywordAnalysisJson(), KeywordAnalysisDto.class)
                : new KeywordAnalysisDto(Collections.emptyList(), Collections.emptyList());

            List<SectionIssueDto> sectionIssues = entity.getSectionBreakdownJson() != null
                ? objectMapper.readValue(entity.getSectionBreakdownJson(), new TypeReference<List<SectionIssueDto>>() {})
                : Collections.emptyList();

            List<BulletImprovementDto> bulletImprovements = entity.getBulletImprovementsJson() != null
                ? objectMapper.readValue(entity.getBulletImprovementsJson(), new TypeReference<List<BulletImprovementDto>>() {})
                : Collections.emptyList();

            String fileName = entity.getTargetRoleInfoJson() != null && !entity.getTargetRoleInfoJson().isBlank()
                ? entity.getTargetRoleInfoJson()
                : "resume.pdf";

            return new ResumeAnalysisResponse(
                entity.getRoleId(),
                entity.getRoleTitle(),
                fileName,
                DateTimeFormatter.ISO_INSTANT.format(entity.getCreatedAt()),
                false,
                score,
                strengths,
                keywords,
                sectionIssues,
                bulletImprovements
            );
        } catch (Exception e) {
            log.error("Failed to reconstruct resume analysis [{}]: {}", entity.getId(), e.getMessage());
            throw new RuntimeException("Could not reconstruct historical resume analysis", e);
        }
    }

    // ==================== LEARNING ROADMAPS ====================

    @Transactional
    public RoadmapEntity saveRoadmap(StudentEntity student, PersonalizedRoadmapResponse response) {
        try {
            RoadmapEntity entity = new RoadmapEntity();
            entity.setId(UUID.randomUUID());
            entity.setStudent(student);
            entity.setRoleId(response.roleId());
            entity.setRoleTitle(response.roleTitle());
            entity.setTotalEstimatedHours(response.totalEstimatedHours());
            entity.setTotalWeeks(response.totalWeeks());
            entity.setCurrentStrengthsJson(objectMapper.writeValueAsString(response.currentStrengths()));
            entity.setPrioritizedGapsJson(objectMapper.writeValueAsString(response.prioritizedGaps()));

            CapstoneProjectDto capstone = response.capstoneProject();
            if (capstone != null) {
                entity.setCapstoneTitle(capstone.title());
                entity.setCapstoneDescription(capstone.description());
                entity.setCapstoneHours(capstone.estimatedHours());
                entity.setCapstoneSkillsJson(objectMapper.writeValueAsString(capstone.skillsDemonstrated()));
                entity.setCapstoneDeliverablesJson(objectMapper.writeValueAsString(capstone.deliverables()));
            } else {
                entity.setCapstoneTitle(response.roleTitle() + " Capstone");
                entity.setCapstoneDescription("Capstone implementation");
                entity.setCapstoneHours(20);
                entity.setCapstoneSkillsJson("[]");
                entity.setCapstoneDeliverablesJson("[]");
            }

            entity.setCreatedAt(Instant.now());
            RoadmapEntity savedRoadmap = roadmapRepository.save(entity);

            if (response.milestones() != null) {
                List<RoadmapMilestoneEntity> milestoneEntities = new ArrayList<>();
                for (RoadmapMilestoneDto m : response.milestones()) {
                    RoadmapMilestoneEntity me = new RoadmapMilestoneEntity();
                    me.setId(UUID.randomUUID());
                    me.setRoadmap(savedRoadmap);
                    me.setMilestoneOrder(m.orderIndex());
                    me.setMilestoneKey(m.id());
                    me.setTitle(m.title());
                    me.setObjective(m.objective());
                    me.setDifficulty(m.difficulty());
                    me.setEstimatedHours(m.estimatedHours());
                    me.setSkillsCoveredJson(objectMapper.writeValueAsString(m.skillsCovered()));
                    me.setPracticalExercise(m.practicalExercise());
                    me.setCompletionCriteria(m.completionCriteria());
                    me.setResourcesJson(objectMapper.writeValueAsString(m.resources()));
                    me.setIsCompleted(false);
                    milestoneEntities.add(milestoneRepository.save(me));
                }
                savedRoadmap.setMilestones(milestoneEntities);
            }

            log.info("Persisted learning roadmap [{}]", savedRoadmap.getId());
            return savedRoadmap;
        } catch (Exception e) {
            log.error("Failed to persist learning roadmap: {}", e.getMessage(), e);
            throw new RuntimeException("Could not persist learning roadmap record", e);
        }
    }

    @Transactional(readOnly = true)
    public PersonalizedRoadmapResponse reconstructRoadmap(RoadmapEntity entity) {
        try {
            List<String> strengths = entity.getCurrentStrengthsJson() != null
                ? objectMapper.readValue(entity.getCurrentStrengthsJson(), new TypeReference<List<String>>() {})
                : Collections.emptyList();

            List<SkillGapDto> gaps = entity.getPrioritizedGapsJson() != null
                ? objectMapper.readValue(entity.getPrioritizedGapsJson(), new TypeReference<List<SkillGapDto>>() {})
                : Collections.emptyList();

            List<String> capstoneSkills = entity.getCapstoneSkillsJson() != null
                ? objectMapper.readValue(entity.getCapstoneSkillsJson(), new TypeReference<List<String>>() {})
                : Collections.emptyList();

            List<String> capstoneDeliverables = entity.getCapstoneDeliverablesJson() != null
                ? objectMapper.readValue(entity.getCapstoneDeliverablesJson(), new TypeReference<List<String>>() {})
                : Collections.emptyList();

            CapstoneProjectDto capstone = new CapstoneProjectDto(
                entity.getCapstoneTitle(),
                entity.getCapstoneDescription(),
                capstoneSkills,
                capstoneDeliverables,
                entity.getCapstoneHours()
            );

            List<RoadmapMilestoneDto> milestoneDtos = new ArrayList<>();
            List<RoadmapMilestoneEntity> milestones = milestoneRepository.findAllByRoadmapOrderByMilestoneOrderAsc(entity);
            for (RoadmapMilestoneEntity me : milestones) {
                List<String> skillsCovered = me.getSkillsCoveredJson() != null
                    ? objectMapper.readValue(me.getSkillsCoveredJson(), new TypeReference<List<String>>() {})
                    : Collections.emptyList();

                List<FreeResourceDto> resources = me.getResourcesJson() != null
                    ? objectMapper.readValue(me.getResourcesJson(), new TypeReference<List<FreeResourceDto>>() {})
                    : Collections.emptyList();

                milestoneDtos.add(new RoadmapMilestoneDto(
                    me.getMilestoneKey(),
                    me.getMilestoneOrder(),
                    me.getTitle(),
                    me.getObjective(),
                    skillsCovered,
                    me.getEstimatedHours(),
                    me.getDifficulty(),
                    resources,
                    me.getPracticalExercise(),
                    me.getCompletionCriteria()
                ));
            }

            String formattedDate = DateTimeFormatter.ofPattern("MMM dd, yyyy · HH:mm 'UTC'")
                .withZone(ZoneId.of("UTC"))
                .format(entity.getCreatedAt());

            return new PersonalizedRoadmapResponse(
                entity.getRoleId(),
                entity.getRoleTitle(),
                formattedDate,
                false,
                entity.getTotalEstimatedHours(),
                entity.getTotalWeeks(),
                strengths,
                gaps,
                milestoneDtos,
                capstone
            );
        } catch (Exception e) {
            log.error("Failed to reconstruct roadmap [{}]: {}", entity.getId(), e.getMessage());
            throw new RuntimeException("Could not reconstruct historical learning roadmap", e);
        }
    }

    @Transactional
    public RoadmapMilestoneEntity updateMilestoneCompletion(StudentEntity student, UUID roadmapId, String milestoneKey, boolean isCompleted) {
        RoadmapEntity roadmap = roadmapRepository.findByIdAndStudent(roadmapId, student)
            .orElseThrow(() -> new IllegalArgumentException("Roadmap not found or unauthorized"));

        RoadmapMilestoneEntity milestone = milestoneRepository.findByRoadmapAndMilestoneKey(roadmap, milestoneKey)
            .orElseGet(() -> {
                try {
                    UUID milestoneUuid = UUID.fromString(milestoneKey);
                    return milestoneRepository.findByRoadmapAndId(roadmap, milestoneUuid)
                        .orElseThrow(() -> new IllegalArgumentException("Milestone not found: " + milestoneKey));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Milestone not found: " + milestoneKey);
                }
            });

        milestone.setIsCompleted(isCompleted);
        RoadmapMilestoneEntity saved = milestoneRepository.save(milestone);
        log.info("Updated milestone [{}] completion state to {} in roadmap [{}]", milestoneKey, isCompleted, roadmapId);
        return saved;
    }

    // ==================== INTERVIEW SESSIONS ====================

    @Transactional
    public InterviewSessionEntity saveInterviewStart(
        StudentEntity student,
        InterviewSessionStartResponse response,
        List<InterviewQuestionDto> initialQuestions,
        boolean enableFollowUps
    ) {
        try {
            InterviewSessionEntity session = new InterviewSessionEntity();
            session.setId(UUID.randomUUID());
            session.setSessionId(response.sessionId());
            session.setStudent(student);
            session.setRoleId(response.roleId());
            session.setRoleTitle(response.roleTitle());
            session.setInterviewType(response.interviewType());
            session.setDifficulty(response.difficulty());
            session.setInitialTotalQuestions(response.totalQuestions());
            session.setTotalQuestions(response.totalQuestions());
            session.setAnsweredCount(0);
            session.setStatus("IN_PROGRESS");
            session.setIsFinished(false);
            session.setEnableFollowUps(enableFollowUps);
            session.setCreatedAt(response.createdAt() != null ? response.createdAt() : Instant.now());

            InterviewSessionEntity savedSession = interviewSessionRepository.save(session);

            if (initialQuestions != null) {
                for (InterviewQuestionDto q : initialQuestions) {
                    InterviewQuestionRecordEntity qr = new InterviewQuestionRecordEntity();
                    qr.setId(UUID.randomUUID());
                    qr.setSession(savedSession);
                    qr.setQuestionKey(q.id());
                    qr.setQuestionNumber(q.questionNumber());
                    qr.setCategory(q.category());
                    qr.setCompetency(q.competency());
                    qr.setQuestionText(q.questionText());
                    qr.setDifficulty(q.difficulty());
                    qr.setIsFollowUp(Boolean.TRUE.equals(q.isFollowUp()));
                    qr.setParentQuestionId(q.parentQuestionId());
                    qr.setAnswered(false);
                    questionRecordRepository.save(qr);
                }
            }

            log.info("Persisted interview session [{}]", savedSession.getSessionId());
            return savedSession;
        } catch (Exception e) {
            log.error("Failed to persist interview session start: {}", e.getMessage(), e);
            throw new RuntimeException("Could not persist interview session", e);
        }
    }

    @Transactional
    public void recordAnswerSubmission(
        String sessionId,
        String questionId,
        String answerText,
        AnswerEvaluationDto feedback,
        InterviewQuestionDto followUpQuestion
    ) {
        try {
            Optional<InterviewSessionEntity> optSession = interviewSessionRepository.findBySessionId(sessionId);
            if (optSession.isEmpty()) {
                log.warn("Session [{}] not found for answer recording in database", sessionId);
                return;
            }
            InterviewSessionEntity session = optSession.get();
            session.setAnsweredCount(session.getAnsweredCount() + 1);

            Optional<InterviewQuestionRecordEntity> optQ = questionRecordRepository.findBySessionAndQuestionKey(session, questionId);
            InterviewQuestionRecordEntity qRecord;
            if (optQ.isPresent()) {
                qRecord = optQ.get();
            } else {
                qRecord = new InterviewQuestionRecordEntity();
                qRecord.setId(UUID.randomUUID());
                qRecord.setSession(session);
                qRecord.setQuestionKey(questionId);
                qRecord.setQuestionNumber(session.getAnsweredCount());
                qRecord.setCategory("general");
                qRecord.setCompetency("Competency");
                qRecord.setQuestionText("");
                qRecord.setDifficulty(session.getDifficulty());
            }

            qRecord.setUserAnswer(answerText);
            qRecord.setScore(feedback != null ? feedback.score() : null);
            qRecord.setStrengthsJson(objectMapper.writeValueAsString(feedback != null ? feedback.strengths() : Collections.emptyList()));
            qRecord.setImprovementAreasJson(objectMapper.writeValueAsString(feedback != null ? feedback.improvementAreas() : Collections.emptyList()));
            qRecord.setMissingConceptsJson(objectMapper.writeValueAsString(feedback != null ? feedback.missingConcepts() : Collections.emptyList()));
            qRecord.setSuggestedAnswer(feedback != null ? feedback.suggestedAnswer() : "");
            qRecord.setNextStep(feedback != null ? feedback.nextStep() : "");
            qRecord.setRubricType(feedback != null ? feedback.rubricType() : "standard");
            qRecord.setSpokenSummary(feedback != null ? feedback.spokenSummary() : "");
            qRecord.setAnswered(true);
            qRecord.setSubmittedAt(Instant.now());
            questionRecordRepository.save(qRecord);

            // If a follow-up question was generated, record it into the database question table
            if (followUpQuestion != null) {
                InterviewQuestionRecordEntity followUpRecord = new InterviewQuestionRecordEntity();
                followUpRecord.setId(UUID.randomUUID());
                followUpRecord.setSession(session);
                followUpRecord.setQuestionKey(followUpQuestion.id());
                followUpRecord.setQuestionNumber(followUpQuestion.questionNumber());
                followUpRecord.setCategory(followUpQuestion.category());
                followUpRecord.setCompetency(followUpQuestion.competency());
                followUpRecord.setQuestionText(followUpQuestion.questionText());
                followUpRecord.setDifficulty(followUpQuestion.difficulty());
                followUpRecord.setIsFollowUp(true);
                followUpRecord.setParentQuestionId(questionId);
                followUpRecord.setAnswered(false);
                questionRecordRepository.save(followUpRecord);

                session.setTotalQuestions(session.getTotalQuestions() + 1);
            }

            interviewSessionRepository.save(session);
            log.info("Recorded answer for question [{}] in interview session [{}]", questionId, sessionId);
        } catch (Exception e) {
            log.error("Failed to record interview answer in DB: {}", e.getMessage(), e);
        }
    }

    @Transactional
    public void recordInterviewCompletion(String sessionId, InterviewSummaryResponse summary) {
        try {
            Optional<InterviewSessionEntity> optSession = interviewSessionRepository.findBySessionId(sessionId);
            if (optSession.isEmpty()) {
                log.warn("Session [{}] not found for interview completion in database", sessionId);
                return;
            }
            InterviewSessionEntity session = optSession.get();
            session.setOverallScore(summary.overallPracticeScore());
            session.setScoreExplanation(summary.scoringExplanation());
            session.setTopStrengthsJson(objectMapper.writeValueAsString(summary.topStrengths()));
            session.setCriticalGapsJson(objectMapper.writeValueAsString(summary.criticalImprovementAreas()));
            session.setRecommendedActivitiesJson(objectMapper.writeValueAsString(summary.recommendedPracticeActivities()));
            session.setRecommendedResourcesJson(objectMapper.writeValueAsString(summary.recommendedResources()));
            session.setNextSessionRecommendation(summary.nextSessionRecommendation());
            session.setTotalQuestions(summary.totalQuestions());
            session.setAnsweredCount(summary.answeredQuestions());
            session.setIsFinished(true);
            session.setStatus("COMPLETED");
            session.setCompletedAt(Instant.now());

            interviewSessionRepository.save(session);
            log.info("Recorded completion for interview session [{}] with overall score {}", sessionId, summary.overallPracticeScore());
        } catch (Exception e) {
            log.error("Failed to record interview completion in DB: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public InterviewSummaryResponse reconstructInterviewSummary(InterviewSessionEntity session) {
        try {
            List<String> topStrengths = session.getTopStrengthsJson() != null
                ? objectMapper.readValue(session.getTopStrengthsJson(), new TypeReference<List<String>>() {})
                : Collections.emptyList();

            List<String> criticalGaps = session.getCriticalGapsJson() != null
                ? objectMapper.readValue(session.getCriticalGapsJson(), new TypeReference<List<String>>() {})
                : Collections.emptyList();

            List<String> recommendedActivities = session.getRecommendedActivitiesJson() != null
                ? objectMapper.readValue(session.getRecommendedActivitiesJson(), new TypeReference<List<String>>() {})
                : Collections.emptyList();

            List<FreeResourceDto> recommendedResources = session.getRecommendedResourcesJson() != null
                ? objectMapper.readValue(session.getRecommendedResourcesJson(), new TypeReference<List<FreeResourceDto>>() {})
                : Collections.emptyList();

            List<InterviewQuestionRecordEntity> questionRecords = questionRecordRepository.findAllBySessionOrderByQuestionNumberAsc(session);
            List<PerQuestionResultDto> perQuestionResults = new ArrayList<>();

            for (InterviewQuestionRecordEntity qr : questionRecords) {
                InterviewQuestionDto qDto = new InterviewQuestionDto(
                    qr.getQuestionKey(),
                    qr.getQuestionNumber(),
                    session.getTotalQuestions(),
                    qr.getCategory(),
                    qr.getCompetency(),
                    qr.getQuestionText(),
                    qr.getDifficulty(),
                    Boolean.TRUE.equals(qr.getIsFollowUp()),
                    qr.getParentQuestionId()
                );

                AnswerEvaluationDto feedback = null;
                if (Boolean.TRUE.equals(qr.getAnswered()) && qr.getScore() != null) {
                    List<String> strengths = qr.getStrengthsJson() != null
                        ? objectMapper.readValue(qr.getStrengthsJson(), new TypeReference<List<String>>() {})
                        : Collections.emptyList();

                    List<String> improvementAreas = qr.getImprovementAreasJson() != null
                        ? objectMapper.readValue(qr.getImprovementAreasJson(), new TypeReference<List<String>>() {})
                        : Collections.emptyList();

                    List<String> missingConcepts = qr.getMissingConceptsJson() != null
                        ? objectMapper.readValue(qr.getMissingConceptsJson(), new TypeReference<List<String>>() {})
                        : Collections.emptyList();

                    feedback = new AnswerEvaluationDto(
                        qr.getQuestionKey(),
                        qr.getScore(),
                        strengths,
                        improvementAreas,
                        missingConcepts,
                        qr.getSuggestedAnswer() != null ? qr.getSuggestedAnswer() : "",
                        qr.getNextStep() != null ? qr.getNextStep() : "",
                        qr.getRubricType() != null ? qr.getRubricType() : "technical",
                        "Diagnostic practice scorecard",
                        null,
                        qr.getSpokenSummary()
                    );
                }

                perQuestionResults.add(new PerQuestionResultDto(
                    qDto,
                    qr.getUserAnswer() != null ? qr.getUserAnswer() : "",
                    feedback,
                    Boolean.TRUE.equals(qr.getAnswered())
                ));
            }

            return new InterviewSummaryResponse(
                session.getSessionId(),
                session.getRoleId(),
                session.getRoleTitle(),
                session.getInterviewType(),
                session.getDifficulty(),
                session.getTotalQuestions(),
                session.getAnsweredCount(),
                session.getOverallScore() != null ? session.getOverallScore() : 0,
                session.getScoreExplanation() != null ? session.getScoreExplanation() : "Completed interview session",
                topStrengths,
                criticalGaps,
                recommendedActivities,
                recommendedResources,
                session.getNextSessionRecommendation() != null ? session.getNextSessionRecommendation() : "",
                perQuestionResults,
                "Prep Pilot practice scorecard is designed for diagnostic learning and does not guarantee or predict actual employment outcomes."
            );
        } catch (Exception e) {
            log.error("Failed to reconstruct interview summary for session [{}]: {}", session.getSessionId(), e.getMessage());
            throw new RuntimeException("Could not reconstruct interview scorecard", e);
        }
    }

    // ==================== DATA DELETION ====================

    @Transactional
    public void deleteAllStudentData(StudentEntity student) {
        log.info("Deleting all historical data for a student");
        resumeAnalysisRepository.deleteAllByStudent(student);
        roadmapRepository.deleteAllByStudent(student);
        interviewSessionRepository.deleteAllByStudent(student);
    }
}

