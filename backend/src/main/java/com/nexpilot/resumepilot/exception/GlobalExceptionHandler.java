package com.nexpilot.resumepilot.exception;

import com.nexpilot.resumepilot.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(InvalidDocumentException.class)
    public ResponseEntity<ErrorResponse> handleInvalidDocument(InvalidDocumentException ex) {
        log.warn("Invalid document upload: code={}, message={}", ex.getCode(), ex.getMessage());
        ErrorResponse error = ErrorResponse.of(
            "Document Validation Failed",
            ex.getMessage(),
            ex.getCode(),
            HttpStatus.BAD_REQUEST.value()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UnsupportedRoleException.class)
    public ResponseEntity<ErrorResponse> handleUnsupportedRole(UnsupportedRoleException ex) {
        log.warn("Unsupported target role: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(
            "Invalid Target Role",
            ex.getMessage(),
            "INVALID_ROLE",
            HttpStatus.BAD_REQUEST.value()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(GeminiServiceException.class)
    public ResponseEntity<ErrorResponse> handleGeminiService(GeminiServiceException ex) {
        log.error("AI Analysis Provider error: code={}, message={}", ex.getCode(), ex.getMessage());
        ErrorResponse error = ErrorResponse.of(
            "AI Analysis Service Error",
            ex.getMessage(),
            ex.getCode(),
            ex.getHttpStatus().value()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(error);
    }

    @ExceptionHandler(InterviewSessionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleInterviewSessionNotFound(InterviewSessionNotFoundException ex) {
        log.warn("Interview session not found: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(
            "Session Not Found",
            ex.getMessage(),
            "SESSION_NOT_FOUND",
            HttpStatus.NOT_FOUND.value()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InterviewSessionExpiredException.class)
    public ResponseEntity<ErrorResponse> handleInterviewSessionExpired(InterviewSessionExpiredException ex) {
        log.warn("Interview session expired: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(
            "Session Expired",
            ex.getMessage(),
            "SESSION_EXPIRED",
            HttpStatus.GONE.value()
        );
        return ResponseEntity.status(HttpStatus.GONE).body(error);
    }

    @ExceptionHandler(InvalidInterviewStateException.class)
    public ResponseEntity<ErrorResponse> handleInvalidInterviewState(InvalidInterviewStateException ex) {
        log.warn("Invalid interview state transition: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(
            "Invalid Interview State",
            ex.getMessage(),
            "INVALID_INTERVIEW_STATE",
            HttpStatus.BAD_REQUEST.value()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        log.warn("Upload exceeds maximum allowed size");
        ErrorResponse error = ErrorResponse.of(
            "File Too Large",
            "The uploaded file exceeds the maximum allowed size of 5 MB.",
            "FILE_TOO_LARGE",
            HttpStatus.PAYLOAD_TOO_LARGE.value()
        );
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(error);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .findFirst()
            .orElse("Validation failed");
        log.warn("Request validation failed: {}", message);
        ErrorResponse error = ErrorResponse.of(
            "Validation Failed",
            message,
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST.value()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(org.springframework.web.server.ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String message = ex.getReason() != null ? ex.getReason() : status.getReasonPhrase();
        ErrorResponse error = ErrorResponse.of(
            status.is4xxClientError() ? "Request Rejected" : "Request Failed",
            message,
            "HTTP_" + status.value(),
            status.value()
        );
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unhandled internal server error occurred", ex);
        // Do not expose stack traces or raw server internals to client
        ErrorResponse error = ErrorResponse.of(
            "Internal Server Error",
            "An unexpected error occurred while processing the resume. Please try again.",
            "INTERNAL_SERVER_ERROR",
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

