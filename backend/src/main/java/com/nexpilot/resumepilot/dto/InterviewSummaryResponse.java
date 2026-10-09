package com.nexpilot.resumepilot.dto;

import java.util.List;

public record InterviewSummaryResponse(
    String sessionId,
    String roleId,
    String roleTitle,
    String interviewType,
    String difficulty,
    int totalQuestions,
    int answeredQuestions,
    int overallPracticeScore,
    String scoringExplanation,
    List<String> topStrengths,
    List<String> criticalImprovementAreas,
    List<String> recommendedPracticeActivities,
    List<FreeResourceDto> recommendedResources,
    String nextSessionRecommendation,
    List<PerQuestionResultDto> questionResults,
    String practiceDisclaimer
) {}

