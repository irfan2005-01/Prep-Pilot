package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RoadmapMilestoneDto(
    String id,
    int orderIndex,
    String title,
    String objective,
    List<String> skillsCovered,
    int estimatedHours,
    String difficulty,
    List<FreeResourceDto> resources,
    String practicalExercise,
    String completionCriteria
) {
}

