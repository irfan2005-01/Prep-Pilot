package com.nexpilot.resumepilot.controller;

import com.nexpilot.resumepilot.dto.ResumeAnalysisResponse;
import com.nexpilot.resumepilot.service.GeminiAnalysisService;
import com.nexpilot.resumepilot.service.ResumeExtractionService;
import com.nexpilot.resumepilot.service.RoleRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeAnalysisController {

    private static final Logger log = LoggerFactory.getLogger(ResumeAnalysisController.class);

    private final ResumeExtractionService extractionService;
    private final GeminiAnalysisService geminiAnalysisService;
    private final RoleRegistry roleRegistry;
    private final com.nexpilot.resumepilot.service.StudentIdentityService identityService;
    private final com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService;

    public ResumeAnalysisController(
        ResumeExtractionService extractionService,
        GeminiAnalysisService geminiAnalysisService,
        RoleRegistry roleRegistry,
        com.nexpilot.resumepilot.service.StudentIdentityService identityService,
        com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService
    ) {
        this.extractionService = extractionService;
        this.geminiAnalysisService = geminiAnalysisService;
        this.roleRegistry = roleRegistry;
        this.identityService = identityService;
        this.persistenceService = persistenceService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
        @RequestParam("file") MultipartFile file,
        @RequestParam("roleId") String roleId,
        @org.springframework.web.bind.annotation.RequestHeader(value = "X-Student-Token", required = false) String studentToken
    ) {
        identityService.requireAuthenticatedRequest();
        log.info("Received resume analysis request: roleId={}, originalFilename={}", roleId, file.getOriginalFilename());

        // 1. Validate target role
        RoleRegistry.RoleMetadata role = roleRegistry.getRole(roleId);

        // 2. Validate and extract document text (PDF / DOCX)
        ResumeExtractionService.ExtractedResume extracted = extractionService.extractText(file);

        // 3. Perform AI analysis using Gemini
        ResumeAnalysisResponse response = geminiAnalysisService.analyzeResume(
            extracted.text(),
            role,
            extracted.originalFilename()
        );

        // 4. Resolve candidate profile & persist analysis
        com.nexpilot.resumepilot.model.StudentEntity student = identityService.resolveOrCreateStudent(studentToken);
        try {
            persistenceService.saveResumeAnalysis(student, response);
        } catch (Exception e) {
            log.error("Non-fatal: failed to persist resume analysis for student: {}", e.getMessage());
        }

        log.info("Completed resume analysis: roleId={}, calculatedScore={}", roleId, response.score().overall());

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        if (!identityService.isAuthenticatedRequest()) {
            headers.set("X-Student-Token", student.getStudentToken());
            headers.set("Access-Control-Expose-Headers", "X-Student-Token");
        }

        return ResponseEntity.ok()
            .headers(headers)
            .body(response);
    }

    @org.springframework.web.bind.annotation.GetMapping("/health")
    public ResponseEntity<java.util.Map<String, Object>> health() {
        return ResponseEntity.ok(java.util.Map.of(
            "status", "UP",
            "service", "Prep Pilot Resume Analysis Engine"
        ));
    }
}

