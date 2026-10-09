package com.nexpilot.resumepilot.repository;

import com.nexpilot.resumepilot.model.InterviewQuestionRecordEntity;
import com.nexpilot.resumepilot.model.InterviewSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewQuestionRecordRepository extends JpaRepository<InterviewQuestionRecordEntity, UUID> {
    List<InterviewQuestionRecordEntity> findAllBySessionOrderByQuestionNumberAsc(InterviewSessionEntity session);
    Optional<InterviewQuestionRecordEntity> findBySessionAndQuestionKey(InterviewSessionEntity session, String questionKey);
}

