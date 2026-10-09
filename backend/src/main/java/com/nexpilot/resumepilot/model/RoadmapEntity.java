package com.nexpilot.resumepilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "learning_roadmaps", indexes = {
    @Index(name = "idx_learning_roadmaps_student", columnList = "student_id, created_at DESC")
})
public class RoadmapEntity {

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

    @Column(name = "total_estimated_hours", nullable = false)
    private Integer totalEstimatedHours;

    @Column(name = "total_weeks", nullable = false)
    private Integer totalWeeks;

    @Column(name = "current_strengths_json", nullable = false, columnDefinition = "TEXT")
    private String currentStrengthsJson;

    @Column(name = "prioritized_gaps_json", nullable = false, columnDefinition = "TEXT")
    private String prioritizedGapsJson;

    @Column(name = "capstone_title", nullable = false)
    private String capstoneTitle;

    @Column(name = "capstone_description", nullable = false, columnDefinition = "TEXT")
    private String capstoneDescription;

    @Column(name = "capstone_hours", nullable = false)
    private Integer capstoneHours;

    @Column(name = "capstone_skills_json", nullable = false, columnDefinition = "TEXT")
    private String capstoneSkillsJson;

    @Column(name = "capstone_deliverables_json", nullable = false, columnDefinition = "TEXT")
    private String capstoneDeliverablesJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("milestoneOrder ASC")
    private List<RoadmapMilestoneEntity> milestones = new ArrayList<>();

    public RoadmapEntity() {
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

    public Integer getTotalEstimatedHours() { return totalEstimatedHours; }
    public void setTotalEstimatedHours(Integer totalEstimatedHours) { this.totalEstimatedHours = totalEstimatedHours; }

    public Integer getTotalWeeks() { return totalWeeks; }
    public void setTotalWeeks(Integer totalWeeks) { this.totalWeeks = totalWeeks; }

    public String getCurrentStrengthsJson() { return currentStrengthsJson; }
    public void setCurrentStrengthsJson(String currentStrengthsJson) { this.currentStrengthsJson = currentStrengthsJson; }

    public String getPrioritizedGapsJson() { return prioritizedGapsJson; }
    public void setPrioritizedGapsJson(String prioritizedGapsJson) { this.prioritizedGapsJson = prioritizedGapsJson; }

    public String getCapstoneTitle() { return capstoneTitle; }
    public void setCapstoneTitle(String capstoneTitle) { this.capstoneTitle = capstoneTitle; }

    public String getCapstoneDescription() { return capstoneDescription; }
    public void setCapstoneDescription(String capstoneDescription) { this.capstoneDescription = capstoneDescription; }

    public Integer getCapstoneHours() { return capstoneHours; }
    public void setCapstoneHours(Integer capstoneHours) { this.capstoneHours = capstoneHours; }

    public String getCapstoneSkillsJson() { return capstoneSkillsJson; }
    public void setCapstoneSkillsJson(String capstoneSkillsJson) { this.capstoneSkillsJson = capstoneSkillsJson; }

    public String getCapstoneDeliverablesJson() { return capstoneDeliverablesJson; }
    public void setCapstoneDeliverablesJson(String capstoneDeliverablesJson) { this.capstoneDeliverablesJson = capstoneDeliverablesJson; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<RoadmapMilestoneEntity> getMilestones() { return milestones; }
    public void setMilestones(List<RoadmapMilestoneEntity> milestones) { this.milestones = milestones; }
}

