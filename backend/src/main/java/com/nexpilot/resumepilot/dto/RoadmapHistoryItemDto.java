package com.nexpilot.resumepilot.dto;

import java.util.UUID;

public record RoadmapHistoryItemDto(
    UUID id,
    String roleId,
    String roleTitle,
    int totalEstimatedHours,
    int totalWeeks,
    int totalMilestones,
    long completedMilestones,
    int progressPercentage,
    String createdAt
) {}

