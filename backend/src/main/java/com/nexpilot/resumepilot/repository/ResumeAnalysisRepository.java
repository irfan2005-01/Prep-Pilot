package com.nexpilot.resumepilot.repository;

import com.nexpilot.resumepilot.model.ResumeAnalysisEntity;
import com.nexpilot.resumepilot.model.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysisEntity, UUID> {
    List<ResumeAnalysisEntity> findAllByStudentOrderByCreatedAtDesc(StudentEntity student);
    Optional<ResumeAnalysisEntity> findByIdAndStudent(UUID id, StudentEntity student);
    long countByStudent(StudentEntity student);
    void deleteAllByStudent(StudentEntity student);
}

