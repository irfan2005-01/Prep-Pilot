package com.nexpilot.resumepilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "roadmap_milestones", indexes = {
    @Index(name = "idx_roadmap_milestones_roadmap", columnList = "roadmap_id, milestone_order ASC"),
    @Index(name = "idx_roadmap_milestones_key", columnList = "roadmap_id, milestone_key")
})
public class RoadmapMilestoneEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private RoadmapEntity roadmap;

    @Column(name = "milestone_order", nullable = false)
    private Integer milestoneOrder;

    @Column(name = "milestone_key", nullable = false, length = 32)
    private String milestoneKey;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "objective", nullable = false, columnDefinition = "TEXT")
    private String objective;

    @Column(name = "difficulty", nullable = false, length = 32)
    private String difficulty;

    @Column(name = "estimated_hours", nullable = false)
    private Integer estimatedHours;

    @Column(name = "skills_covered_json", nullable = false, columnDefinition = "TEXT")
    private String skillsCoveredJson;

    @Column(name = "practical_exercise", nullable = false, columnDefinition = "TEXT")
    private String practicalExercise;

    @Column(name = "completion_criteria", nullable = false, columnDefinition = "TEXT")
    private String completionCriteria;

    @Column(name = "resources_json", nullable = false, columnDefinition = "TEXT")
    private String resourcesJson;

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private Instant completedAt;

    public RoadmapMilestoneEntity() {
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.isCompleted == null) {
            this.isCompleted = false;
        }
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public RoadmapEntity getRoadmap() { return roadmap; }
    public void setRoadmap(RoadmapEntity roadmap) { this.roadmap = roadmap; }

    public Integer getMilestoneOrder() { return milestoneOrder; }
    public void setMilestoneOrder(Integer milestoneOrder) { this.milestoneOrder = milestoneOrder; }

    public String getMilestoneKey() { return milestoneKey; }
    public void setMilestoneKey(String milestoneKey) { this.milestoneKey = milestoneKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }

    public String getSkillsCoveredJson() { return skillsCoveredJson; }
    public void setSkillsCoveredJson(String skillsCoveredJson) { this.skillsCoveredJson = skillsCoveredJson; }

    public String getPracticalExercise() { return practicalExercise; }
    public void setPracticalExercise(String practicalExercise) { this.practicalExercise = practicalExercise; }

    public String getCompletionCriteria() { return completionCriteria; }
    public void setCompletionCriteria(String completionCriteria) { this.completionCriteria = completionCriteria; }

    public String getResourcesJson() { return resourcesJson; }
    public void setResourcesJson(String resourcesJson) { this.resourcesJson = resourcesJson; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean completed) {
        this.isCompleted = completed;
        if (Boolean.TRUE.equals(completed)) {
            if (this.completedAt == null) {
                this.completedAt = Instant.now();
            }
        } else {
            this.completedAt = null;
        }
    }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}

