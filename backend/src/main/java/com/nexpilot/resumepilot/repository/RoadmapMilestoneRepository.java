package com.nexpilot.resumepilot.repository;

import com.nexpilot.resumepilot.model.RoadmapEntity;
import com.nexpilot.resumepilot.model.RoadmapMilestoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoadmapMilestoneRepository extends JpaRepository<RoadmapMilestoneEntity, UUID> {
    List<RoadmapMilestoneEntity> findAllByRoadmapOrderByMilestoneOrderAsc(RoadmapEntity roadmap);
    Optional<RoadmapMilestoneEntity> findByRoadmapAndMilestoneKey(RoadmapEntity roadmap, String milestoneKey);
    Optional<RoadmapMilestoneEntity> findByRoadmapAndId(RoadmapEntity roadmap, UUID id);
    long countByRoadmapAndIsCompletedTrue(RoadmapEntity roadmap);
}

