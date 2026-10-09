package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResumeAnalysisResponse(
    String roleId,
    String roleTitle,
    String fileName,
    String analyzedAt,
    boolean isDemoSample,
    ScoreBreakdownDto score,
    List<ResumeStrengthDto> strengths,
    KeywordAnalysisDto keywords,
    List<SectionIssueDto> sectionIssues,
    List<BulletImprovementDto> bulletImprovements
) {
}

