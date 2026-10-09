package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SectionIssueDto(
    String id,
    String section,
    String severity,
    String title,
    String issue,
    String recommendation
) {
}

