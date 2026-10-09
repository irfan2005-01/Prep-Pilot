package com.nexpilot.resumepilot.repository;

import com.nexpilot.resumepilot.model.InterviewSessionEntity;
import com.nexpilot.resumepilot.model.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSessionEntity, UUID> {
    List<InterviewSessionEntity> findAllByStudentOrderByCreatedAtDesc(StudentEntity student);
    Optional<InterviewSessionEntity> findBySessionId(String sessionId);
    Optional<InterviewSessionEntity> findBySessionIdAndStudent(String sessionId, StudentEntity student);
    boolean existsBySessionIdAndStudent(String sessionId, StudentEntity student);
    Optional<InterviewSessionEntity> findByIdAndStudent(UUID id, StudentEntity student);
    long countByStudent(StudentEntity student);
    long countByStudentAndIsFinishedTrue(StudentEntity student);
    void deleteAllByStudent(StudentEntity student);
}

