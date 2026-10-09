package com.nexpilot.resumepilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resume_analyses", indexes = {
    @Index(name = "idx_resume_analyses_student", columnList = "student_id, created_at DESC")
})
public class ResumeAnalysisEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @Column(name = "role_id", nullable = false, length = 64)
    private String roleId;

    @Column(name = "role_title", nullable = false, length = 128)
    private String roleTitle;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore;

    @Column(name = "match_status", nullable = false, length = 64)
    private String matchStatus;

    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "score_categories_json", nullable = false, columnDefinition = "TEXT")
    private String scoreCategoriesJson;

    @Column(name = "strengths_json", nullable = false, columnDefinition = "TEXT")
    private String strengthsJson;

    @Column(name = "skill_gaps_json", nullable = false, columnDefinition = "TEXT")
    private String skillGapsJson;

    @Column(name = "keyword_analysis_json", nullable = false, columnDefinition = "TEXT")
    private String keywordAnalysisJson;

    @Column(name = "section_breakdown_json", nullable = false, columnDefinition = "TEXT")
    private String sectionBreakdownJson;

    @Column(name = "bullet_improvements_json", nullable = false, columnDefinition = "TEXT")
    private String bulletImprovementsJson;

    @Column(name = "target_role_info_json", nullable = false, columnDefinition = "TEXT")
    private String targetRoleInfoJson;

    @Column(name = "disclaimer", nullable = false, columnDefinition = "TEXT")
    private String disclaimer;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ResumeAnalysisEntity() {
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getMatchStatus() { return matchStatus; }
    public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getScoreCategoriesJson() { return scoreCategoriesJson; }
    public void setScoreCategoriesJson(String scoreCategoriesJson) { this.scoreCategoriesJson = scoreCategoriesJson; }

    public String getStrengthsJson() { return strengthsJson; }
    public void setStrengthsJson(String strengthsJson) { this.strengthsJson = strengthsJson; }

    public String getSkillGapsJson() { return skillGapsJson; }
    public void setSkillGapsJson(String skillGapsJson) { this.skillGapsJson = skillGapsJson; }

    public String getKeywordAnalysisJson() { return keywordAnalysisJson; }
    public void setKeywordAnalysisJson(String keywordAnalysisJson) { this.keywordAnalysisJson = keywordAnalysisJson; }

    public String getSectionBreakdownJson() { return sectionBreakdownJson; }
    public void setSectionBreakdownJson(String sectionBreakdownJson) { this.sectionBreakdownJson = sectionBreakdownJson; }

    public String getBulletImprovementsJson() { return bulletImprovementsJson; }
    public void setBulletImprovementsJson(String bulletImprovementsJson) { this.bulletImprovementsJson = bulletImprovementsJson; }

    public String getTargetRoleInfoJson() { return targetRoleInfoJson; }
    public void setTargetRoleInfoJson(String targetRoleInfoJson) { this.targetRoleInfoJson = targetRoleInfoJson; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

