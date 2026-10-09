package com.nexpilot.resumepilot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.exception.GeminiServiceException;
import com.nexpilot.resumepilot.service.FreeResourceCatalog;
import com.nexpilot.resumepilot.service.InterviewSessionManager;
import com.nexpilot.resumepilot.service.InterviewSimulatorService;
import com.nexpilot.resumepilot.service.RoleRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class InterviewSimulatorServiceTest {

    private MockRestServiceServer mockServer;
    private InterviewSimulatorService interviewService;
    private InterviewSessionManager sessionManager;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        RestClient restClient = builder.build();

        ObjectMapper objectMapper = new ObjectMapper();
        RoleRegistry roleRegistry = new RoleRegistry();
        FreeResourceCatalog resourceCatalog = new FreeResourceCatalog();
        sessionManager = new InterviewSessionManager();

        interviewService = new InterviewSimulatorService(
            restClient,
            objectMapper,
            roleRegistry,
            resourceCatalog,
            sessionManager
        );

        ReflectionTestUtils.setField(interviewService, "apiKey", "test-mock-api-key");
        ReflectionTestUtils.setField(interviewService, "modelName", "gemini-3.5-flash");
    }

    private String createMockGeminiEnvelope(String innerJson) {
        String escaped = innerJson.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
        return """
            {
              "candidates": [
                {
                  "content": {
                    "parts": [
                      {
                        "text": "%s"
                      }
                    ]
                  }
                }
              ]
            }
            """.formatted(escaped);
    }

    @Test
    @DisplayName("Should throw GeminiServiceException when API key is missing")
    void testMissingApiKeyThrows() {
        ReflectionTestUtils.setField(interviewService, "apiKey", "");
        InterviewSetupRequest request = new InterviewSetupRequest(
            "full-stack-developer",
            "technical",
            "intermediate",
            5,
            null,
            null,
            null
        );

        GeminiServiceException ex = assertThrows(GeminiServiceException.class, () ->
            interviewService.startInterview(request)
        );
        assertEquals("MISSING_API_KEY", ex.getCode());
    }

    @Test
    @DisplayName("Should generate questions, create session, and return first question")
    void testStartInterviewSuccess() {
        String mockQuestionsJson = """
            {
              "questions": [
                {
                  "id": "q-1",
                  "questionNumber": 1,
                  "category": "technical",
                  "competency": "REST Architecture",
                  "questionText": "What are idempotent HTTP methods?",
                  "difficulty": "intermediate"
                },
                {
                  "id": "q-2",
                  "questionNumber": 2,
                  "category": "technical",
                  "competency": "React State",
                  "questionText": "How does React reconciliation work?",
                  "difficulty": "intermediate"
                },
                {
                  "id": "q-3",
                  "questionNumber": 3,
                  "category": "behavioral",
                  "competency": "Ownership",
                  "questionText": "Tell me about a production bug you introduced.",
                  "difficulty": "intermediate"
                }
              ]
            }
            """;

        mockServer.expect(requestTo(containsString("generativelanguage.googleapis.com")))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withSuccess(createMockGeminiEnvelope(mockQuestionsJson), MediaType.APPLICATION_JSON));

        InterviewSetupRequest request = new InterviewSetupRequest(
            "full-stack-developer",
            "mixed",
            "intermediate",
            3,
            List.of("TypeScript", "React"),
            List.of("Docker", "CI/CD"),
            null
        );

        InterviewSessionStartResponse response = interviewService.startInterview(request);

        assertNotNull(response);
        assertNotNull(response.sessionId());
        assertEquals("full-stack-developer", response.roleId());
        assertEquals(3, response.totalQuestions());
        assertNotNull(response.currentQuestion());
        assertEquals("q-1", response.currentQuestion().id());
        assertEquals(1, response.currentQuestion().questionNumber());
        assertEquals("What are idempotent HTTP methods?", response.currentQuestion().questionText());
    }

    @Test
    @DisplayName("Should evaluate submitted answer and calculate summary score")
    void testSubmitAnswerAndFinish() {
        // First create session directly in manager with 2 questions
        List<InterviewQuestionDto> questions = List.of(
            new InterviewQuestionDto("q-1", 1, 2, "technical", "HTTP", "Explain idempotent methods", "intermediate"),
            new InterviewQuestionDto("q-2", 2, 2, "behavioral", "STAR", "Describe resolving a team conflict", "intermediate")
        );
        var session = sessionManager.createSession("full-stack-developer", "Full-Stack Developer", "mixed", "intermediate", questions);

        // Mock evaluation response
        String mockEvalJson = """
            {
              "score": 88,
              "strengths": ["Accurately defined GET and PUT idempotency", "Clear explanation of side effects"],
              "improvementAreas": ["Mention DELETE idempotency subtleties"],
              "missingConcepts": ["DELETE idempotent vs safe"],
              "suggestedAnswer": "Idempotent HTTP methods produce the same server state regardless of execution count.",
              "nextStep": "Review RFC 7231 method specifications.",
              "rubricType": "technical"
            }
            """;

        mockServer.expect(requestTo(containsString("generativelanguage.googleapis.com")))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withSuccess(createMockGeminiEnvelope(mockEvalJson), MediaType.APPLICATION_JSON));

        SubmitAnswerRequest answerRequest = new SubmitAnswerRequest("q-1", "GET, PUT, and DELETE are idempotent methods because repeated identical requests produce the same server state.");
        SubmitAnswerResponse answerResponse = interviewService.submitAnswer(session.getSessionId(), answerRequest);

        assertNotNull(answerResponse);
        assertEquals(88, answerResponse.feedback().score());
        assertTrue(answerResponse.hasNextQuestion());
        assertEquals("q-2", answerResponse.nextQuestion().id());
        assertFalse(answerResponse.isFinished());

        // Finish early with 1 answered question
        InterviewSummaryResponse summary = interviewService.finishInterview(session.getSessionId());
        assertNotNull(summary);
        assertEquals(88, summary.overallPracticeScore());
        assertEquals(1, summary.answeredQuestions());
        assertEquals(2, summary.totalQuestions());
        assertFalse(summary.topStrengths().isEmpty());
    }
}
