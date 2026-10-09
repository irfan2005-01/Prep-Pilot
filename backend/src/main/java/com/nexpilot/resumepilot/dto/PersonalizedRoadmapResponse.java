package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PersonalizedRoadmapResponse(
    String roleId,
    String roleTitle,
    String generatedAt,
    boolean isDemoSample,
    int totalEstimatedHours,
    int totalWeeks,
    List<String> currentStrengths,
    List<SkillGapDto> prioritizedGaps,
    List<RoadmapMilestoneDto> milestones,
    CapstoneProjectDto capstoneProject
) {
}

