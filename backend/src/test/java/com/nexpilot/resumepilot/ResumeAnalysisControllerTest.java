package com.nexpilot.resumepilot;

import com.nexpilot.resumepilot.controller.ResumeAnalysisController;
import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.exception.GlobalExceptionHandler;
import com.nexpilot.resumepilot.service.GeminiAnalysisService;
import com.nexpilot.resumepilot.service.ResumeExtractionService;
import com.nexpilot.resumepilot.service.RoleRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeAnalysisController.class)
@Import({GlobalExceptionHandler.class, RoleRegistry.class})
public class ResumeAnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResumeExtractionService extractionService;

    @MockBean
    private GeminiAnalysisService geminiAnalysisService;

    @MockBean
    private com.nexpilot.resumepilot.service.StudentIdentityService identityService;

    @MockBean
    private com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService;

    private ResumeAnalysisResponse mockResponse;

    @BeforeEach
    void setUp() {
        org.mockito.Mockito.doNothing().when(identityService).requireAuthenticatedRequest();
        when(identityService.resolveOrCreateStudent(any()))
            .thenReturn(new com.nexpilot.resumepilot.model.StudentEntity(java.util.UUID.randomUUID(), "test-student-token"));
        ScoreCategoriesDto categories = new ScoreCategoriesDto(
            new ScoreCategoryDto("Role Keyword Match", 85, 35, "Strong match", "excellent"),
            new ScoreCategoryDto("Impact & Quantification", 80, 30, "Strong metrics", "good"),
            new ScoreCategoryDto("ATS Parsability & Format", 90, 20, "Clean layout", "excellent"),
            new ScoreCategoryDto("Structural Integrity", 75, 15, "Good sections", "good")
        );
        ScoreBreakdownDto score = new ScoreBreakdownDto(83, "Ready for Application", categories);

        mockResponse = new ResumeAnalysisResponse(
            "full-stack-developer",
            "Full-Stack Developer",
            "alex_resume.pdf",
            "Oct 09, 2026 · 14:00 UTC",
            false,
            score,
            List.of(new ResumeStrengthDto("str-1", "React & Node Stack", "Solid fullstack skills", "Skills", "React, Node.js")),
            new KeywordAnalysisDto(
                List.of(new MatchedKeywordDto("React", 4, "essential")),
                List.of(new MissingKeywordDto("GraphQL", "essential", "Required by 70% of roles", "Add under APIs"))
            ),
            List.of(new SectionIssueDto("sec-1", "Work Experience", "improvement", "Add metrics", "Missing metrics", "Add numbers")),
            List.of(new BulletImprovementDto("b-1", "Projects", "Built app", "Architected app for 10k users", "Much better", "Google XYZ (Accomplished X, measured by Y, by doing Z)"))
        );
    }

    @Test
    void testSuccessfulResumeAnalysisEndpoint() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "alex_resume.pdf",
            "application/pdf",
            "%PDF-1.4 Mock content bytes...".getBytes()
        );

        when(extractionService.extractText(any()))
            .thenReturn(new ResumeExtractionService.ExtractedResume(
                "Extracted text content for Alex...",
                "alex_resume.pdf",
                "pdf",
                1200,
                210
            ));

        when(geminiAnalysisService.analyzeResume(any(), any(), eq("alex_resume.pdf")))
            .thenReturn(mockResponse);

        mockMvc.perform(multipart("/api/v1/resumes/analyze")
                .file(file)
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .param("roleId", "full-stack-developer"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.roleId").value("full-stack-developer"))
            .andExpect(jsonPath("$.roleTitle").value("Full-Stack Developer"))
            .andExpect(jsonPath("$.fileName").value("alex_resume.pdf"))
            .andExpect(jsonPath("$.isDemoSample").value(false))
            .andExpect(jsonPath("$.score.overall").value(83))
            .andExpect(jsonPath("$.score.verdict").value("Ready for Application"))
            .andExpect(jsonPath("$.strengths[0].title").value("React & Node Stack"))
            .andExpect(jsonPath("$.keywords.matchedKeywords[0].keyword").value("React"))
            .andExpect(jsonPath("$.keywords.missingKeywords[0].keyword").value("GraphQL"));
    }

    @Test
    void testInvalidRoleIdReturnsBadRequest() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "resume.pdf",
            "application/pdf",
            "%PDF-1.4 Mock content...".getBytes()
        );

        mockMvc.perform(multipart("/api/v1/resumes/analyze")
                .file(file)
                .sessionAttr(com.nexpilot.resumepilot.controller.AuthController.STUDENT_ID, "test-account")
                .sessionAttr("csrf", "test-csrf").header("X-CSRF-Token", "test-csrf")
                .param("roleId", "quantum-teleportation-engineer"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("INVALID_ROLE"))
            .andExpect(jsonPath("$.error").value("Invalid Target Role"));
    }

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/resumes/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"))
            .andExpect(jsonPath("$.service").value("Prep Pilot Resume Analysis Engine"));
    }
}

