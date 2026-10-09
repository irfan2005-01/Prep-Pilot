package com.nexpilot.resumepilot.repository;

import com.nexpilot.resumepilot.model.RoadmapEntity;
import com.nexpilot.resumepilot.model.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoadmapRepository extends JpaRepository<RoadmapEntity, UUID> {
    List<RoadmapEntity> findAllByStudentOrderByCreatedAtDesc(StudentEntity student);
    Optional<RoadmapEntity> findByIdAndStudent(UUID id, StudentEntity student);
    long countByStudent(StudentEntity student);
    void deleteAllByStudent(StudentEntity student);
}

