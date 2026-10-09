package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CapstoneProjectDto(
    String title,
    String description,
    List<String> skillsDemonstrated,
    List<String> deliverables,
    int estimatedHours
) {
}

