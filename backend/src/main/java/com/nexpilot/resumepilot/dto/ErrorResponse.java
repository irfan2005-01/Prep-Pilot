package com.nexpilot.resumepilot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
    String error,
    String message,
    String code,
    int status,
    String timestamp
) {
    public static ErrorResponse of(String error, String message, String code, int status) {
        return new ErrorResponse(error, message, code, status, Instant.now().toString());
    }
}

