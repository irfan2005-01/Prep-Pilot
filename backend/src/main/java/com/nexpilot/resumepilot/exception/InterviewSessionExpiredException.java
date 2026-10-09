package com.nexpilot.resumepilot.exception;

public class InterviewSessionExpiredException extends RuntimeException {
    public InterviewSessionExpiredException(String sessionId) {
        super("Interview session has expired due to inactivity: " + sessionId);
    }
}

