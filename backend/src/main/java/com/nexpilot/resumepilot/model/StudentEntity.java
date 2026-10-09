package com.nexpilot.resumepilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_students_token", columnList = "student_token")
})
public class StudentEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "student_token", nullable = false, unique = true, length = 64)
    private String studentToken;

    @Column(name = "name", length = 128)
    private String name;

    @Column(name = "email", unique = true, length = 254)
    private String email;

    @Column(name = "password_hash", length = 100)
    private String passwordHash;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeAnalysisEntity> analyses = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoadmapEntity> roadmaps = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InterviewSessionEntity> interviewSessions = new ArrayList<>();

    public StudentEntity() {
    }

    public StudentEntity(UUID id, String studentToken) {
        this.id = id != null ? id : UUID.randomUUID();
        this.studentToken = studentToken;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStudentToken() { return studentToken; }
    public void setStudentToken(String studentToken) { this.studentToken = studentToken; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<ResumeAnalysisEntity> getAnalyses() { return analyses; }
    public void setAnalyses(List<ResumeAnalysisEntity> analyses) { this.analyses = analyses; }

    public List<RoadmapEntity> getRoadmaps() { return roadmaps; }
    public void setRoadmaps(List<RoadmapEntity> roadmaps) { this.roadmaps = roadmaps; }

    public List<InterviewSessionEntity> getInterviewSessions() { return interviewSessions; }
    public void setInterviewSessions(List<InterviewSessionEntity> interviewSessions) { this.interviewSessions = interviewSessions; }
}

