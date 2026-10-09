package com.nexpilot.resumepilot.exception;

public class InvalidDocumentException extends RuntimeException {
    private final String code;

    public InvalidDocumentException(String message, String code) {
        super(message);
        this.code = code;
    }

    public InvalidDocumentException(String message, String code, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}

