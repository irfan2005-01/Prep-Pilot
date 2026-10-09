package com.nexpilot.resumepilot.exception;

public class InterviewSessionNotFoundException extends RuntimeException {
    public InterviewSessionNotFoundException(String sessionId) {
        super("Interview session not found or has expired: " + sessionId);
    }
}

