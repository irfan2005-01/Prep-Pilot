package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record KeywordAnalysisDto(
    List<MatchedKeywordDto> matchedKeywords,
    List<MissingKeywordDto> missingKeywords
) {
}

