package com.nexpilot.resumepilot.exception;

import org.springframework.http.HttpStatus;

public class GeminiServiceException extends RuntimeException {
    private final String code;
    private final HttpStatus httpStatus;

    public GeminiServiceException(String message, String code, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public GeminiServiceException(String message, String code, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}

