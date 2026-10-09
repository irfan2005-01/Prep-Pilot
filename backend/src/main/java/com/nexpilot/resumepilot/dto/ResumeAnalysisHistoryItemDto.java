package com.nexpilot.resumepilot.dto;

import java.util.UUID;

public record ResumeAnalysisHistoryItemDto(
    UUID id,
    String roleId,
    String roleTitle,
    int overallScore,
    String matchStatus,
    String summary,
    String analyzedAt
) {}

