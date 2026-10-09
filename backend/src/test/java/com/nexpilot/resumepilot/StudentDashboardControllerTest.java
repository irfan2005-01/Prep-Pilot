package com.nexpilot.resumepilot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.controller.StudentDashboardController;
import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.exception.GlobalExceptionHandler;
import com.nexpilot.resumepilot.model.*;
import com.nexpilot.resumepilot.repository.*;
import com.nexpilot.resumepilot.service.StudentIdentityService;
import com.nexpilot.resumepilot.service.StudentPersistenceService;
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
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentDashboardController.class)
@Import({GlobalExceptionHandler.class})
public class StudentDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentIdentityService identityService;

    @MockBean
    private StudentPersistenceService persistenceService;

    @MockBean
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @MockBean
    private RoadmapRepository roadmapRepository;

    @MockBean
    private RoadmapMilestoneRepository milestoneRepository;

    @MockBean
    private InterviewSessionRepository interviewSessionRepository;

    private StudentEntity mockStudent;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        mockStudent = new StudentEntity(testId, "test-token-12345");
        when(identityService.resolveOrCreateStudent(any())).thenReturn(mockStudent);
        when(identityService.isAuthenticatedRequest()).thenReturn(true);
    }

    @Test
    @DisplayName("GET /api/v1/student/dashboard returns 200 with summary metrics and token header")
    void testGetDashboardSummary() throws Exception {
        when(resumeAnalysisRepository.findAllByStudentOrderByCreatedAtDesc(mockStudent))
            .thenReturn(Collections.emptyList());
        when(roadmapRepository.findAllByStudentOrderByCreatedAtDesc(mockStudent))
            .thenReturn(Collections.emptyList());
        when(interviewSessionRepository.findAllByStudentOrderByCreatedAtDesc(mockStudent))
            .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/student/dashboard")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, mockStudent.getId().toString())
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .header("X-Student-Token", "test-token-12345"))
            .andExpect(status().isOk())
            .andExpect(header().doesNotExist("X-Student-Token"))
            .andExpect(jsonPath("$.studentToken").value(""))
            .andExpect(jsonPath("$.totalAnalyses").value(0))
            .andExpect(jsonPath("$.totalRoadmaps").value(0))
            .andExpect(jsonPath("$.totalInterviews").value(0));
    }

    @Test
    @DisplayName("GET /api/v1/student/analyses returns 200 with historical analysis records")
    void testGetAllAnalyses() throws Exception {
        ResumeAnalysisEntity analysis = new ResumeAnalysisEntity();
        analysis.setId(testId);
        analysis.setStudent(mockStudent);
        analysis.setRoleId("full-stack-developer");
        analysis.setRoleTitle("Full-Stack Developer");
        analysis.setOverallScore(85);
        analysis.setMatchStatus("Ready for Application");
        analysis.setSummary("High potential");
        analysis.setCreatedAt(Instant.now());

        when(resumeAnalysisRepository.findAllByStudentOrderByCreatedAtDesc(mockStudent))
            .thenReturn(List.of(analysis));

        mockMvc.perform(get("/api/v1/student/analyses")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, mockStudent.getId().toString())
                .header("X-Student-Token", "test-token-12345"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].roleId").value("full-stack-developer"))
            .andExpect(jsonPath("$[0].overallScore").value(85));
    }

    @Test
    @DisplayName("PUT /api/v1/student/roadmaps/{id}/milestones/{key} updates completion status")
    void testUpdateMilestoneStatus() throws Exception {
        RoadmapMilestoneEntity updatedMilestone = new RoadmapMilestoneEntity();
        updatedMilestone.setId(UUID.randomUUID());
        updatedMilestone.setMilestoneKey("m-1");
        updatedMilestone.setIsCompleted(true);
        updatedMilestone.setCompletedAt(Instant.now());

        when(persistenceService.updateMilestoneCompletion(eq(mockStudent), eq(testId), eq("m-1"), eq(true)))
            .thenReturn(updatedMilestone);

        UpdateMilestoneRequest req = new UpdateMilestoneRequest(true);

        mockMvc.perform(put("/api/v1/student/roadmaps/" + testId + "/milestones/m-1")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, mockStudent.getId().toString())
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .header("X-Student-Token", "test-token-12345"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.milestoneKey").value("m-1"))
            .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    @DisplayName("DELETE /api/v1/student/data deletes all user data and returns 200")
    void testDeleteAllData() throws Exception {
        doNothing().when(persistenceService).deleteAllStudentData(mockStudent);

        mockMvc.perform(delete("/api/v1/student/data")
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, mockStudent.getId().toString())
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .header("X-Student-Token", "test-token-12345"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.deleted").value(true));

        verify(persistenceService, times(1)).deleteAllStudentData(mockStudent);
    }
}

