package com.nexpilot.resumepilot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.controller.InterviewController;
import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.exception.GlobalExceptionHandler;
import com.nexpilot.resumepilot.exception.InterviewSessionNotFoundException;
import com.nexpilot.resumepilot.service.InterviewSessionManager;
import com.nexpilot.resumepilot.service.InterviewSimulatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InterviewController.class)
@Import({GlobalExceptionHandler.class})
public class InterviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InterviewSimulatorService interviewService;

    @MockBean
    private InterviewSessionManager sessionManager;

    @MockBean
    private com.nexpilot.resumepilot.service.StudentIdentityService identityService;

    @MockBean
    private com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService;

    @MockBean
    private com.nexpilot.resumepilot.repository.InterviewSessionRepository interviewSessionRepository;

    private InterviewQuestionDto sampleQuestion;

    @BeforeEach
    void setUp() {
        when(identityService.resolveOrCreateStudent(any()))
            .thenReturn(new com.nexpilot.resumepilot.model.StudentEntity(java.util.UUID.randomUUID(), "test-student-token"));
        when(interviewSessionRepository.existsBySessionIdAndStudent(any(), any())).thenReturn(true);

        sampleQuestion = new InterviewQuestionDto(
            "q-1",
            1,
            5,
            "technical",
            "Concurrency",
            "Explain thread safety in Java collections",
            "intermediate"
        );
    }

    @Test
    @DisplayName("POST /api/v1/interviews/start returns 200 with session details")
    void testStartInterviewSuccess() throws Exception {
        InterviewSessionStartResponse startResponse = new InterviewSessionStartResponse(
            "test-session-123",
            "java-developer",
            "Java Developer",
            "technical",
            "intermediate",
            5,
            sampleQuestion,
            Instant.now()
        );

        when(interviewService.startInterview(any())).thenReturn(startResponse);

        InterviewSetupRequest request = new InterviewSetupRequest(
            "java-developer",
            "technical",
            "intermediate",
            5,
            List.of("Spring Boot", "Java 21"),
            List.of("Kafka"),
            null
        );

        mockMvc.perform(post("/api/v1/interviews/start")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sessionId").value("test-session-123"))
            .andExpect(jsonPath("$.roleId").value("java-developer"))
            .andExpect(jsonPath("$.totalQuestions").value(5))
            .andExpect(jsonPath("$.currentQuestion.id").value("q-1"));
    }

    @Test
    @DisplayName("POST /api/v1/interviews/start with invalid input returns 400 Bad Request")
    void testStartInterviewValidationFailure() throws Exception {
        InterviewSetupRequest invalid = new InterviewSetupRequest(
            "", // Blank roleId
            "technical",
            "intermediate",
            1, // Question count below min 3
            null,
            null,
            null
        );

        mockMvc.perform(post("/api/v1/interviews/start")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/v1/interviews/{sessionId}/answer returns 200 with feedback")
    void testSubmitAnswerSuccess() throws Exception {
        AnswerEvaluationDto feedback = new AnswerEvaluationDto(
            "q-1",
            85,
            List.of("Correctly explained ConcurrentHashMap bucket locking"),
            List.of("Mention CopyOnWriteArrayList"),
            List.of("Read/Write locks"),
            "Strong model answer",
            "Review java.util.concurrent",
            "technical",
            "Practice feedback only"
        );

        SubmitAnswerResponse answerResponse = new SubmitAnswerResponse(
            "q-1",
            feedback,
            true,
            new InterviewQuestionDto("q-2", 2, 5, "behavioral", "STAR", "Describe resolving a bug", "intermediate"),
            false
        );

        when(interviewService.submitAnswer(eq("test-session-123"), any())).thenReturn(answerResponse);

        SubmitAnswerRequest request = new SubmitAnswerRequest("q-1", "ConcurrentHashMap uses segmented locking and CAS operations for thread-safe concurrent reads and writes.");

        mockMvc.perform(post("/api/v1/interviews/test-session-123/answer")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.feedback.score").value(85))
            .andExpect(jsonPath("$.hasNextQuestion").value(true))
            .andExpect(jsonPath("$.nextQuestion.id").value("q-2"));
    }

    @Test
    @DisplayName("POST /api/v1/interviews/{sessionId}/answer returns 404 for missing session")
    void testSubmitAnswerNotFound() throws Exception {
        when(interviewService.submitAnswer(eq("invalid-id"), any()))
            .thenThrow(new InterviewSessionNotFoundException("invalid-id"));

        SubmitAnswerRequest request = new SubmitAnswerRequest("q-1", "A valid answer with enough characters to pass validation.");

        mockMvc.perform(post("/api/v1/interviews/invalid-id/answer")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Session Not Found"));
    }

    @Test
    @DisplayName("POST answer rejects another student's interview session")
    void testSubmitAnswerRejectsSessionOwnedByAnotherStudent() throws Exception {
        when(interviewSessionRepository.existsBySessionIdAndStudent(eq("other-student-session"), any())).thenReturn(false);
        SubmitAnswerRequest request = new SubmitAnswerRequest("q-1", "A valid answer with enough characters to pass validation.");

        mockMvc.perform(post("/api/v1/interviews/other-student-session/answer")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/interviews/health returns 200 OK")
    void testInterviewHealth() throws Exception {
        when(sessionManager.getActiveSessionCount()).thenReturn(3);

        mockMvc.perform(get("/api/v1/interviews/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"))
            .andExpect(jsonPath("$.activeSessions").value(3));
    }
}

