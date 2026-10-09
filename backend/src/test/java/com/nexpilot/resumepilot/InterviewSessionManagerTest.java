package com.nexpilot.resumepilot;

import com.nexpilot.resumepilot.dto.AnswerEvaluationDto;
import com.nexpilot.resumepilot.dto.InterviewQuestionDto;
import com.nexpilot.resumepilot.exception.InterviewSessionNotFoundException;
import com.nexpilot.resumepilot.exception.InvalidInterviewStateException;
import com.nexpilot.resumepilot.service.InterviewSessionManager;
import com.nexpilot.resumepilot.service.InterviewSessionManager.InterviewSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class InterviewSessionManagerTest {

    private InterviewSessionManager sessionManager;

    @BeforeEach
    void setUp() {
        sessionManager = new InterviewSessionManager();
    }

    private List<InterviewQuestionDto> createSampleQuestions() {
        return List.of(
            new InterviewQuestionDto("q-1", 1, 2, "technical", "Java Basics", "Explain Polymorphism", "intermediate"),
            new InterviewQuestionDto("q-2", 2, 2, "behavioral", "Teamwork", "Describe a conflict", "intermediate")
        );
    }

    private AnswerEvaluationDto createSampleEvaluation(String qId, int score) {
        return new AnswerEvaluationDto(
            qId,
            score,
            List.of("Good explanation"),
            List.of("Could add examples"),
            List.of("Edge cases"),
            "Stronger answer example",
            "Next step practice tip",
            "technical",
            "Practice disclaimer"
        );
    }

    @Test
    @DisplayName("Should create interview session and retrieve current question")
    void testCreateAndRetrieveSession() {
        List<InterviewQuestionDto> questions = createSampleQuestions();
        InterviewSession session = sessionManager.createSession(
            "java-developer",
            "Java Developer",
            "mixed",
            "intermediate",
            questions
        );

        assertNotNull(session.getSessionId());
        assertEquals("java-developer", session.getRoleId());
        assertEquals(2, session.getTotalQuestions());
        assertEquals(0, session.getCurrentQuestionIndex());
        assertFalse(session.isFinished());

        InterviewQuestionDto current = session.getCurrentQuestion();
        assertNotNull(current);
        assertEquals("q-1", current.id());

        // Retrieve from manager
        InterviewSession retrieved = sessionManager.getSession(session.getSessionId());
        assertEquals(session.getSessionId(), retrieved.getSessionId());
    }

    @Test
    @DisplayName("Should progress through questions and mark finished when all answered")
    void testQuestionProgression() {
        List<InterviewQuestionDto> questions = createSampleQuestions();
        InterviewSession session = sessionManager.createSession(
            "java-developer",
            "Java Developer",
            "mixed",
            "intermediate",
            questions
        );

        // Submit answer 1
        session.recordAnswer("q-1", "Polymorphism allows objects to take multiple forms.", createSampleEvaluation("q-1", 85));
        assertEquals(1, session.getCurrentQuestionIndex());
        assertFalse(session.isFinished());
        assertEquals("q-2", session.getCurrentQuestion().id());

        // Submit answer 2
        session.recordAnswer("q-2", "In a past project, we had a debate about SQL vs NoSQL...", createSampleEvaluation("q-2", 90));
        assertEquals(2, session.getCurrentQuestionIndex());
        assertTrue(session.isFinished());
        assertNull(session.getCurrentQuestion());
    }

    @Test
    @DisplayName("Should reject answer with mismatched question ID")
    void testRejectMismatchedQuestionId() {
        List<InterviewQuestionDto> questions = createSampleQuestions();
        InterviewSession session = sessionManager.createSession(
            "java-developer",
            "Java Developer",
            "mixed",
            "intermediate",
            questions
        );

        // Try submitting for q-2 when current is q-1
        assertThrows(InvalidInterviewStateException.class, () ->
            session.recordAnswer("q-2", "Premature answer", createSampleEvaluation("q-2", 70))
        );
    }

    @Test
    @DisplayName("Should dynamically insert contextual follow-up question and progress properly")
    void testFollowUpQuestionInsertion() {
        List<InterviewQuestionDto> questions = createSampleQuestions();
        InterviewSession session = sessionManager.createSession(
            "java-developer",
            "Java Developer",
            "mixed",
            "intermediate",
            questions,
            true
        );

        assertTrue(session.canInsertFollowUp("q-1"));

        // Submit answer for q-1
        session.recordAnswer("q-1", "Polymorphism is method overloading and overriding.", createSampleEvaluation("q-1", 75));

        // Insert follow-up question for q-1
        InterviewQuestionDto followUp = new InterviewQuestionDto(
            "q-1-f",
            1,
            3,
            "technical",
            "Java Basics (Follow-up)",
            "How does dynamic method dispatch implement overriding in the JVM?",
            "intermediate",
            true,
            "q-1"
        );
        session.insertFollowUpQuestion(followUp);

        // Verify total questions increased and current question is the follow-up
        assertEquals(3, session.getTotalQuestions());
        assertFalse(session.isFinished());
        assertNotNull(session.getCurrentQuestion());
        assertEquals("q-1-f", session.getCurrentQuestion().id());
        assertTrue(session.getCurrentQuestion().isFollowUp());

        // Cannot insert another follow-up for q-1
        assertFalse(session.canInsertFollowUp("q-1"));

        // Answer follow-up question
        session.recordAnswer("q-1-f", "The JVM uses invokevirtual and vtables.", createSampleEvaluation("q-1-f", 88));
        assertEquals("q-2", session.getCurrentQuestion().id());
        assertFalse(session.isFinished());

        // Answer q-2
        session.recordAnswer("q-2", "We resolved the team debate using data benchmarks.", createSampleEvaluation("q-2", 92));
        assertTrue(session.isFinished());
        assertNull(session.getCurrentQuestion());
        assertEquals(3, session.getAnswers().size());
    }

    @Test
    @DisplayName("Should respect enableFollowUps false flag")
    void testDisabledFollowUps() {
        List<InterviewQuestionDto> questions = createSampleQuestions();
        InterviewSession session = sessionManager.createSession(
            "java-developer",
            "Java Developer",
            "mixed",
            "intermediate",
            questions,
            false
        );

        assertFalse(session.canInsertFollowUp("q-1"));
    }

    @Test
    @DisplayName("Should throw InterviewSessionNotFoundException for unknown session ID")
    void testSessionNotFound() {
        assertThrows(InterviewSessionNotFoundException.class, () ->
            sessionManager.getSession("non-existent-uuid")
        );
    }
}

