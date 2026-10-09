package com.nexpilot.resumepilot.service;

import com.nexpilot.resumepilot.dto.AnswerEvaluationDto;
import com.nexpilot.resumepilot.dto.InterviewQuestionDto;
import com.nexpilot.resumepilot.dto.InterviewSummaryResponse;
import com.nexpilot.resumepilot.exception.InterviewSessionExpiredException;
import com.nexpilot.resumepilot.exception.InterviewSessionNotFoundException;
import com.nexpilot.resumepilot.exception.InvalidInterviewStateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InterviewSessionManager {

    private static final Logger log = LoggerFactory.getLogger(InterviewSessionManager.class);

    public static final Duration SESSION_TTL = Duration.ofMinutes(120); // 2 hours TTL
    public static final int MAX_ACTIVE_SESSIONS = 1000;

    public record SubmittedAnswerRecord(
        String questionId,
        String answerText,
        AnswerEvaluationDto feedback,
        Instant submittedAt
    ) {}

    public static class InterviewSession {
        private final String sessionId;
        private final String roleId;
        private final String roleTitle;
        private final String interviewType;
        private final String difficulty;
        private final int initialTotalQuestions;
        private final List<InterviewQuestionDto> questions;
        private final Map<String, SubmittedAnswerRecord> answers = new LinkedHashMap<>();
        private int currentQuestionIndex = 0;
        private final Instant createdAt;
        private Instant lastActivityAt;
        private boolean finished = false;
        private final boolean enableFollowUps;
        private InterviewSummaryResponse cachedSummary;

        public InterviewSession(
            String sessionId,
            String roleId,
            String roleTitle,
            String interviewType,
            String difficulty,
            List<InterviewQuestionDto> questions,
            boolean enableFollowUps
        ) {
            this.sessionId = sessionId;
            this.roleId = roleId;
            this.roleTitle = roleTitle;
            this.interviewType = interviewType;
            this.difficulty = difficulty;
            this.initialTotalQuestions = questions.size();
            this.questions = Collections.synchronizedList(new ArrayList<>(questions));
            this.enableFollowUps = enableFollowUps;
            this.createdAt = Instant.now();
            this.lastActivityAt = this.createdAt;
        }

        public InterviewSession(
            String sessionId,
            String roleId,
            String roleTitle,
            String interviewType,
            String difficulty,
            List<InterviewQuestionDto> questions
        ) {
            this(sessionId, roleId, roleTitle, interviewType, difficulty, questions, true);
        }

        public String getSessionId() { return sessionId; }
        public String getRoleId() { return roleId; }
        public String getRoleTitle() { return roleTitle; }
        public String getInterviewType() { return interviewType; }
        public String getDifficulty() { return difficulty; }
        public int getTotalQuestions() { return questions.size(); }
        public int getInitialTotalQuestions() { return initialTotalQuestions; }
        public boolean isEnableFollowUps() { return enableFollowUps; }
        public List<InterviewQuestionDto> getQuestions() {
            synchronized (questions) {
                return Collections.unmodifiableList(new ArrayList<>(questions));
            }
        }
        public Map<String, SubmittedAnswerRecord> getAnswers() { return Collections.unmodifiableMap(answers); }
        public int getCurrentQuestionIndex() { return currentQuestionIndex; }
        public Instant getCreatedAt() { return createdAt; }
        public Instant getLastActivityAt() { return lastActivityAt; }
        public boolean isFinished() { return finished; }
        public InterviewSummaryResponse getCachedSummary() { return cachedSummary; }

        public synchronized InterviewQuestionDto getCurrentQuestion() {
            if (currentQuestionIndex < questions.size()) {
                return questions.get(currentQuestionIndex);
            }
            return null;
        }

        public synchronized boolean canInsertFollowUp(String parentQuestionId) {
            if (!enableFollowUps || parentQuestionId == null) return false;
            synchronized (questions) {
                long count = questions.stream()
                    .filter(q -> Boolean.TRUE.equals(q.isFollowUp()) && parentQuestionId.equals(q.parentQuestionId()))
                    .count();
                return count == 0;
            }
        }

        public synchronized void insertFollowUpQuestion(InterviewQuestionDto followUp) {
            if (followUp == null) return;
            synchronized (questions) {
                // Insert at currentQuestionIndex so it becomes the next active question
                questions.add(currentQuestionIndex, followUp);
            }
            finished = false;
            lastActivityAt = Instant.now();
            log.info("Inserted contextual follow-up question [{}] into session [{}]. Total questions now: {}",
                followUp.id(), sessionId, questions.size());
        }

        public synchronized void recordAnswer(String questionId, String answerText, AnswerEvaluationDto feedback) {
            if (finished) {
                throw new InvalidInterviewStateException("Interview session is already completed.");
            }
            if (currentQuestionIndex >= questions.size()) {
                throw new InvalidInterviewStateException("All questions have already been answered.");
            }
            InterviewQuestionDto expectedQuestion = questions.get(currentQuestionIndex);
            if (!expectedQuestion.id().equals(questionId)) {
                throw new InvalidInterviewStateException(
                    "Submitted question ID '" + questionId + "' does not match pending question '" + expectedQuestion.id() + "'."
                );
            }
            if (answers.containsKey(questionId)) {
                throw new InvalidInterviewStateException("Answer for question '" + questionId + "' has already been submitted.");
            }

            answers.put(questionId, new SubmittedAnswerRecord(questionId, answerText, feedback, Instant.now()));
            currentQuestionIndex++;
            lastActivityAt = Instant.now();

            if (currentQuestionIndex >= questions.size()) {
                finished = true;
            }
        }

        public synchronized void markFinished(InterviewSummaryResponse summary) {
            this.finished = true;
            this.cachedSummary = summary;
            this.lastActivityAt = Instant.now();
        }

        public synchronized void touch() {
            this.lastActivityAt = Instant.now();
        }
    }

    private final Map<String, InterviewSession> sessions = new ConcurrentHashMap<>();

    public InterviewSession createSession(
        String roleId,
        String roleTitle,
        String interviewType,
        String difficulty,
        List<InterviewQuestionDto> questions,
        boolean enableFollowUps
    ) {
        enforceCapacityLimit();
        String sessionId = UUID.randomUUID().toString();
        InterviewSession session = new InterviewSession(
            sessionId,
            roleId,
            roleTitle,
            interviewType,
            difficulty,
            questions,
            enableFollowUps
        );
        sessions.put(sessionId, session);
        log.info("Created new interview session: id={}, role={}, type={}, questions={}, followUps={}",
            sessionId, roleId, interviewType, questions.size(), enableFollowUps);
        return session;
    }

    public InterviewSession createSession(
        String roleId,
        String roleTitle,
        String interviewType,
        String difficulty,
        List<InterviewQuestionDto> questions
    ) {
        return createSession(roleId, roleTitle, interviewType, difficulty, questions, true);
    }

    public InterviewSession getSession(String sessionId) {
        if (sessionId == null || sessionId.trim().isBlank()) {
            throw new InterviewSessionNotFoundException("Session ID cannot be empty");
        }
        InterviewSession session = sessions.get(sessionId.trim());
        if (session == null) {
            throw new InterviewSessionNotFoundException(sessionId);
        }

        // Check TTL expiration
        if (isExpired(session)) {
            sessions.remove(sessionId);
            log.warn("Session {} has expired and was evicted.", sessionId);
            throw new InterviewSessionExpiredException(sessionId);
        }

        session.touch();
        return session;
    }

    public void removeSession(String sessionId) {
        if (sessionId != null) {
            sessions.remove(sessionId.trim());
        }
    }

    public int getActiveSessionCount() {
        return sessions.size();
    }

    @Scheduled(fixedRate = 300000) // 5 minutes
    public void cleanupExpiredSessions() {
        Instant now = Instant.now();
        int evicted = 0;
        for (Map.Entry<String, InterviewSession> entry : sessions.entrySet()) {
            if (isExpired(entry.getValue(), now)) {
                sessions.remove(entry.getKey());
                evicted++;
            }
        }
        if (evicted > 0) {
            log.info("Scheduled eviction purged {} expired interview sessions. Remaining active: {}",
                evicted, sessions.size());
        }
    }

    private boolean isExpired(InterviewSession session) {
        return isExpired(session, Instant.now());
    }

    private boolean isExpired(InterviewSession session, Instant now) {
        return Duration.between(session.getLastActivityAt(), now).compareTo(SESSION_TTL) > 0;
    }

    private synchronized void enforceCapacityLimit() {
        if (sessions.size() >= MAX_ACTIVE_SESSIONS) {
            // Evict oldest 10% of sessions by lastActivityAt
            List<Map.Entry<String, InterviewSession>> sorted = new ArrayList<>(sessions.entrySet());
            sorted.sort(Comparator.comparing(e -> e.getValue().getLastActivityAt()));
            int toRemove = Math.max(1, MAX_ACTIVE_SESSIONS / 10);
            for (int i = 0; i < toRemove && i < sorted.size(); i++) {
                sessions.remove(sorted.get(i).getKey());
            }
            log.warn("Reached MAX_ACTIVE_SESSIONS ({}). Evicted {} oldest sessions.", MAX_ACTIVE_SESSIONS, toRemove);
        }
    }
}
