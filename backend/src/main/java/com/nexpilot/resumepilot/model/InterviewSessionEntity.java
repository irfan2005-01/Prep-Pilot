package com.nexpilot.resumepilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interview_sessions", indexes = {
    @Index(name = "idx_interview_sessions_student", columnList = "student_id, created_at DESC"),
    @Index(name = "idx_interview_sessions_sid", columnList = "session_id")
})
public class InterviewSessionEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "session_id", nullable = false, unique = true, length = 64)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @Column(name = "role_id", nullable = false, length = 64)
    private String roleId;

    @Column(name = "role_title", nullable = false, length = 128)
    private String roleTitle;

    @Column(name = "interview_type", nullable = false, length = 32)
    private String interviewType;

    @Column(name = "difficulty", nullable = false, length = 32)
    private String difficulty;

    @Column(name = "initial_total_questions", nullable = false)
    private Integer initialTotalQuestions;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "answered_count", nullable = false)
    private Integer answeredCount = 0;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "score_explanation", columnDefinition = "TEXT")
    private String scoreExplanation;

    @Column(name = "top_strengths_json", columnDefinition = "TEXT")
    private String topStrengthsJson;

    @Column(name = "critical_gaps_json", columnDefinition = "TEXT")
    private String criticalGapsJson;

    @Column(name = "recommended_activities_json", columnDefinition = "TEXT")
    private String recommendedActivitiesJson;

    @Column(name = "recommended_resources_json", columnDefinition = "TEXT")
    private String recommendedResourcesJson;

    @Column(name = "next_session_recommendation", columnDefinition = "TEXT")
    private String nextSessionRecommendation;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "IN_PROGRESS";

    @Column(name = "is_finished", nullable = false)
    private Boolean isFinished = false;

    @Column(name = "enable_follow_ups", nullable = false)
    private Boolean enableFollowUps = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionNumber ASC")
    private List<InterviewQuestionRecordEntity> questions = new ArrayList<>();

    public InterviewSessionEntity() {
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.answeredCount == null) {
            this.answeredCount = 0;
        }
        if (this.isFinished == null) {
            this.isFinished = false;
        }
        if (this.status == null) {
            this.status = "IN_PROGRESS";
        }
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getInitialTotalQuestions() { return initialTotalQuestions; }
    public void setInitialTotalQuestions(Integer initialTotalQuestions) { this.initialTotalQuestions = initialTotalQuestions; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getAnsweredCount() { return answeredCount; }
    public void setAnsweredCount(Integer answeredCount) { this.answeredCount = answeredCount; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getScoreExplanation() { return scoreExplanation; }
    public void setScoreExplanation(String scoreExplanation) { this.scoreExplanation = scoreExplanation; }

    public String getTopStrengthsJson() { return topStrengthsJson; }
    public void setTopStrengthsJson(String topStrengthsJson) { this.topStrengthsJson = topStrengthsJson; }

    public String getCriticalGapsJson() { return criticalGapsJson; }
    public void setCriticalGapsJson(String criticalGapsJson) { this.criticalGapsJson = criticalGapsJson; }

    public String getRecommendedActivitiesJson() { return recommendedActivitiesJson; }
    public void setRecommendedActivitiesJson(String recommendedActivitiesJson) { this.recommendedActivitiesJson = recommendedActivitiesJson; }

    public String getRecommendedResourcesJson() { return recommendedResourcesJson; }
    public void setRecommendedResourcesJson(String recommendedResourcesJson) { this.recommendedResourcesJson = recommendedResourcesJson; }

    public String getNextSessionRecommendation() { return nextSessionRecommendation; }
    public void setNextSessionRecommendation(String nextSessionRecommendation) { this.nextSessionRecommendation = nextSessionRecommendation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsFinished() { return isFinished; }
    public void setIsFinished(Boolean finished) { this.isFinished = finished; }

    public Boolean getEnableFollowUps() { return enableFollowUps; }
    public void setEnableFollowUps(Boolean enableFollowUps) { this.enableFollowUps = enableFollowUps; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public List<InterviewQuestionRecordEntity> getQuestions() { return questions; }
    public void setQuestions(List<InterviewQuestionRecordEntity> questions) { this.questions = questions; }
}

