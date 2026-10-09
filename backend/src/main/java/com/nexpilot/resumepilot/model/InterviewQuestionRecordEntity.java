package com.nexpilot.resumepilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_question_records", indexes = {
    @Index(name = "idx_interview_questions_session", columnList = "interview_session_id, question_number ASC")
})
public class InterviewQuestionRecordEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interview_session_id", nullable = false)
    private InterviewSessionEntity session;

    @Column(name = "question_key", nullable = false, length = 64)
    private String questionKey;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Column(name = "competency", nullable = false, length = 128)
    private String competency;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "difficulty", nullable = false, length = 32)
    private String difficulty;

    @Column(name = "is_follow_up", nullable = false)
    private Boolean isFollowUp = false;

    @Column(name = "parent_question_id", length = 64)
    private String parentQuestionId;

    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    @Column(name = "score")
    private Integer score;

    @Column(name = "strengths_json", columnDefinition = "TEXT")
    private String strengthsJson;

    @Column(name = "improvement_areas_json", columnDefinition = "TEXT")
    private String improvementAreasJson;

    @Column(name = "missing_concepts_json", columnDefinition = "TEXT")
    private String missingConceptsJson;

    @Column(name = "suggested_answer", columnDefinition = "TEXT")
    private String suggestedAnswer;

    @Column(name = "next_step", columnDefinition = "TEXT")
    private String nextStep;

    @Column(name = "rubric_type", length = 64)
    private String rubricType;

    @Column(name = "spoken_summary", columnDefinition = "TEXT")
    private String spokenSummary;

    @Column(name = "answered", nullable = false)
    private Boolean answered = false;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    public InterviewQuestionRecordEntity() {
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.isFollowUp == null) {
            this.isFollowUp = false;
        }
        if (this.answered == null) {
            this.answered = false;
        }
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public InterviewSessionEntity getSession() { return session; }
    public void setSession(InterviewSessionEntity session) { this.session = session; }

    public String getQuestionKey() { return questionKey; }
    public void setQuestionKey(String questionKey) { this.questionKey = questionKey; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCompetency() { return competency; }
    public void setCompetency(String competency) { this.competency = competency; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Boolean getIsFollowUp() { return isFollowUp; }
    public void setIsFollowUp(Boolean followUp) { this.isFollowUp = followUp; }

    public String getParentQuestionId() { return parentQuestionId; }
    public void setParentQuestionId(String parentQuestionId) { this.parentQuestionId = parentQuestionId; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getStrengthsJson() { return strengthsJson; }
    public void setStrengthsJson(String strengthsJson) { this.strengthsJson = strengthsJson; }

    public String getImprovementAreasJson() { return improvementAreasJson; }
    public void setImprovementAreasJson(String improvementAreasJson) { this.improvementAreasJson = improvementAreasJson; }

    public String getMissingConceptsJson() { return missingConceptsJson; }
    public void setMissingConceptsJson(String missingConceptsJson) { this.missingConceptsJson = missingConceptsJson; }

    public String getSuggestedAnswer() { return suggestedAnswer; }
    public void setSuggestedAnswer(String suggestedAnswer) { this.suggestedAnswer = suggestedAnswer; }

    public String getNextStep() { return nextStep; }
    public void setNextStep(String nextStep) { this.nextStep = nextStep; }

    public String getRubricType() { return rubricType; }
    public void setRubricType(String rubricType) { this.rubricType = rubricType; }

    public String getSpokenSummary() { return spokenSummary; }
    public void setSpokenSummary(String spokenSummary) { this.spokenSummary = spokenSummary; }

    public Boolean getAnswered() { return answered; }
    public void setAnswered(Boolean answered) { this.answered = answered; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}

