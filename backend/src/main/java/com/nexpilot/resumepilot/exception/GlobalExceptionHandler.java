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

