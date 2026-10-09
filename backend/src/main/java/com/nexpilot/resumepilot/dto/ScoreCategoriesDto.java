package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ScoreCategoriesDto(
    ScoreCategoryDto keywordMatch,
    ScoreCategoryDto contentImpact,
    ScoreCategoryDto atsParsability,
    ScoreCategoryDto structureCompleteness
) {
}

