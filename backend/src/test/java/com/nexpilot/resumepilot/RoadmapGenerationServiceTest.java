package com.nexpilot.resumepilot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.dto.PersonalizedRoadmapResponse;
import com.nexpilot.resumepilot.dto.RoadmapGenerationRequest;
import com.nexpilot.resumepilot.exception.GeminiServiceException;
import com.nexpilot.resumepilot.service.FreeResourceCatalog;
import com.nexpilot.resumepilot.service.RoadmapGenerationService;
import com.nexpilot.resumepilot.service.RoleRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

public class RoadmapGenerationServiceTest {

    private MockRestServiceServer mockServer;
    private ObjectMapper objectMapper;
    private RoadmapGenerationService roadmapService;
    private RoleRegistry roleRegistry;
    private FreeResourceCatalog resourceCatalog;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        RestClient restClient = builder.build();

        objectMapper = new ObjectMapper();
        roleRegistry = new RoleRegistry();
        resourceCatalog = new FreeResourceCatalog();

        roadmapService = new RoadmapGenerationService(
            restClient,
            objectMapper,
            roleRegistry,
            resourceCatalog
        );

        ReflectionTestUtils.setField(roadmapService, "apiKey", "test-mock-api-key");
        ReflectionTestUtils.setField(roadmapService, "modelName", "gemini-3.5-flash");
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
    void shouldGenerateValidRoadmapFromAnalysisGaps() {
        String mockModelJson = """
            {
              "currentStrengths": ["Python", "SQL Basics"],
              "prioritizedGaps": [
                {
                  "skill": "Tableau",
                  "priority": "critical",
                  "rationale": "Essential for corporate business intelligence dashboards."
                },
                {
                  "skill": "PowerBI",
                  "priority": "high",
                  "rationale": "Commonly demanded enterprise visualization tool."
                }
              ],
              "milestones": [
                {
                  "id": "m-1",
                  "title": "Business Intelligence Foundations & Tableau",
                  "objective": "Build automated BI dashboards with calculated fields.",
                  "skillsCovered": ["Tableau", "SQL"],
                  "estimatedHours": 18,
                  "difficulty": "beginner",
                  "resources": [
                    {
                      "title": "Tableau Free Tutorials",
                      "url": "https://www.tableau.com/learn/training/2022-1",
                      "provider": "Tableau",
                      "skillCovered": "Tableau",
                      "type": "Video Guide"
                    }
                  ],
                  "practicalExercise": "Build a sales performance dashboard with interactive filters.",
                  "completionCriteria": "Publish interactive dashboard to Tableau Public."
                },
                {
                  "id": "m-2",
                  "title": "Advanced SQL & Data Modeling",
                  "objective": "Master window functions, CTEs, and star schema modeling.",
                  "skillsCovered": ["SQL", "Data Analysis"],
                  "estimatedHours": 20,
                  "difficulty": "intermediate",
                  "resources": [],
                  "practicalExercise": "Analyze 1M row dataset with window functions.",
                  "completionCriteria": "Complete all SQLBolt complex queries."
                }
              ],
              "capstoneProject": {
                "title": "End-to-End Enterprise BI Dashboard Suite",
                "description": "Comprehensive customer churn prediction and revenue dashboard.",
                "skillsDemonstrated": ["SQL", "Tableau", "PowerBI"],
                "deliverables": [
                  "Interactive Tableau dashboard",
                  "SQL ETL script repository",
                  "Executive presentation slide deck"
                ],
                "estimatedHours": 25
              }
            }
            """;

        mockServer.expect(requestTo(containsString("generativelanguage.googleapis.com")))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withSuccess(createMockGeminiEnvelope(mockModelJson), MediaType.APPLICATION_JSON));

        RoadmapGenerationRequest request = new RoadmapGenerationRequest(
            "data-analyst",
            "Data Analyst",
            List.of("Python", "SQL"),
            List.of("Tableau", "PowerBI"),
            List.of("Python", "SQL"),
            55
        );

        PersonalizedRoadmapResponse response = roadmapService.generateRoadmap(request);

        assertNotNull(response);
        assertEquals("data-analyst", response.roleId());
        assertEquals("Data Analyst", response.roleTitle());
        assertFalse(response.isDemoSample());
        assertEquals(2, response.milestones().size());
        assertEquals(63, response.totalEstimatedHours()); // 18 + 20 + 25 = 63
        assertNotNull(response.capstoneProject());

        // Verify resources are enriched with valid allowlisted URLs
        RoadmapGenerationServiceTest.this.resourceCatalog.getAllowedDomains();
        for (var milestone : response.milestones()) {
            assertFalse(milestone.resources().isEmpty());
            for (var res : milestone.resources()) {
                assertTrue(resourceCatalog.isDomainAllowed(res.url()), "Resource URL should be on allowlist: " + res.url());
            }
        }

        mockServer.verify();
    }

    @Test
    void shouldFailWhenApiKeyIsMissing() {
        ReflectionTestUtils.setField(roadmapService, "apiKey", "");

        RoadmapGenerationRequest request = new RoadmapGenerationRequest(
            "data-analyst",
            "Data Analyst",
            List.of(),
            List.of(),
            List.of(),
            null
        );

        GeminiServiceException ex = assertThrows(GeminiServiceException.class, () ->
            roadmapService.generateRoadmap(request)
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, ex.getHttpStatus());
        assertEquals("MISSING_API_KEY", ex.getCode());
    }

    @Test
    void shouldHandleQuotaExceededException() {
        mockServer.expect(requestTo(containsString("generativelanguage.googleapis.com")))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS));

        RoadmapGenerationRequest request = new RoadmapGenerationRequest(
            "frontend-developer",
            "Frontend Developer",
            List.of(),
            List.of(),
            List.of(),
            null
        );

        GeminiServiceException ex = assertThrows(GeminiServiceException.class, () ->
            roadmapService.generateRoadmap(request)
        );

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getHttpStatus());
        assertEquals("QUOTA_EXCEEDED", ex.getCode());
        mockServer.verify();
    }
}
