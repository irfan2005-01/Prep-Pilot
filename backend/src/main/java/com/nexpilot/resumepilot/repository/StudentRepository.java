package com.nexpilot.resumepilot.repository;

import com.nexpilot.resumepilot.model.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, UUID> {
    Optional<StudentEntity> findByStudentToken(String studentToken);
    Optional<StudentEntity> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}

