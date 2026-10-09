package com.nexpilot.resumepilot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.controller.RoadmapController;
import com.nexpilot.resumepilot.dto.CapstoneProjectDto;
import com.nexpilot.resumepilot.dto.FreeResourceDto;
import com.nexpilot.resumepilot.dto.PersonalizedRoadmapResponse;
import com.nexpilot.resumepilot.dto.RoadmapGenerationRequest;
import com.nexpilot.resumepilot.dto.RoadmapMilestoneDto;
import com.nexpilot.resumepilot.dto.SkillGapDto;
import com.nexpilot.resumepilot.exception.GlobalExceptionHandler;
import com.nexpilot.resumepilot.service.RoadmapGenerationService;
import com.nexpilot.resumepilot.service.RoleRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoadmapController.class)
@Import({GlobalExceptionHandler.class, RoleRegistry.class})
public class RoadmapControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RoadmapGenerationService roadmapGenerationService;

    @MockBean
    private com.nexpilot.resumepilot.service.StudentIdentityService identityService;

    @MockBean
    private com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService;

    private PersonalizedRoadmapResponse mockRoadmap;

    @BeforeEach
    void setUp() {
        org.mockito.Mockito.doNothing().when(identityService).requireAuthenticatedRequest();
        when(identityService.resolveOrCreateStudent(any()))
            .thenReturn(new com.nexpilot.resumepilot.model.StudentEntity(java.util.UUID.randomUUID(), "test-student-token"));
        com.nexpilot.resumepilot.model.RoadmapEntity savedRoadmap = new com.nexpilot.resumepilot.model.RoadmapEntity();
        savedRoadmap.setId(java.util.UUID.randomUUID());
        when(persistenceService.saveRoadmap(any(), any())).thenReturn(savedRoadmap);
        mockRoadmap = new PersonalizedRoadmapResponse(
            "data-analyst",
            "Data Analyst",
            "Oct 09, 2026 · 17:00 UTC",
            false,
            65,
            6,
            List.of("Python", "SQL"),
            List.of(new SkillGapDto("Tableau", "critical", "Key visualization tool")),
            List.of(
                new RoadmapMilestoneDto(
                    "m-1",
                    1,
                    "Tableau & Data Visualization",
                    "Build dashboards",
                    List.of("Tableau"),
                    20,
                    "beginner",
                    List.of(new FreeResourceDto("Tableau Training", "https://www.tableau.com/learn/training/2022-1", "Tableau", "Tableau", "100% Free", "Video Guide")),
                    "Build a dashboard",
                    "Publish to public"
                )
            ),
            new CapstoneProjectDto(
                "Sales Intelligence Dashboard",
                "End to end analytics suite",
                List.of("Tableau", "SQL"),
                List.of("Dashboard file"),
                25
            )
        );
    }

    @Test
    void shouldGenerateRoadmapSuccessfully() throws Exception {
        when(roadmapGenerationService.generateRoadmap(any(RoadmapGenerationRequest.class)))
            .thenReturn(mockRoadmap);

        RoadmapGenerationRequest request = new RoadmapGenerationRequest(
            "data-analyst",
            "Data Analyst",
            List.of("Python", "SQL"),
            List.of("Tableau"),
            List.of("Python"),
            60
        );

        mockMvc.perform(post("/api/v1/roadmaps/generate")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.roleId").value("data-analyst"))
            .andExpect(jsonPath("$.roleTitle").value("Data Analyst"))
            .andExpect(jsonPath("$.totalEstimatedHours").value(65))
            .andExpect(jsonPath("$.milestones[0].title").value("Tableau & Data Visualization"))
            .andExpect(jsonPath("$.capstoneProject.title").value("Sales Intelligence Dashboard"));
    }

    @Test
    void shouldRejectUnsupportedRole() throws Exception {
        RoadmapGenerationRequest request = new RoadmapGenerationRequest(
            "space-shuttle-pilot",
            "Space Shuttle Pilot",
            List.of(),
            List.of(),
            List.of(),
            null
        );

        mockMvc.perform(post("/api/v1/roadmaps/generate")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("INVALID_ROLE"));
    }

    @Test
    void shouldReturnHealthStatus() throws Exception {
        mockMvc.perform(get("/api/v1/roadmaps/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"))
            .andExpect(jsonPath("$.service").value("Prep Pilot Roadmap Engine"));
    }
}
