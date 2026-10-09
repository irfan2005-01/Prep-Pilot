package com.nexpilot.resumepilot.dto;

import java.util.List;

public record DashboardSummaryDto(
    String studentToken,
    String name,
    String memberSince,
    long totalAnalyses,
    Integer latestAtsScore,
    String latestRoleTarget,
    long totalRoadmaps,
    long totalMilestones,
    long completedMilestones,
    int roadmapProgressPercentage,
    long totalInterviews,
    Integer averageInterviewScore,
    List<ResumeAnalysisHistoryItemDto> recentAnalyses,
    List<RoadmapHistoryItemDto> recentRoadmaps,
    List<InterviewHistoryItemDto> recentInterviews
) {}

