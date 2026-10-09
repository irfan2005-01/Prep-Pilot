package com.nexpilot.resumepilot.controller;

import com.nexpilot.resumepilot.dto.PersonalizedRoadmapResponse;
import com.nexpilot.resumepilot.dto.RoadmapGenerationRequest;
import com.nexpilot.resumepilot.service.RoadmapGenerationService;
import com.nexpilot.resumepilot.service.RoleRegistry;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/roadmaps")
public class RoadmapController {

    private static final Logger log = LoggerFactory.getLogger(RoadmapController.class);

    private final RoadmapGenerationService roadmapGenerationService;
    private final RoleRegistry roleRegistry;
    private final com.nexpilot.resumepilot.service.StudentIdentityService identityService;
    private final com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService;

    public RoadmapController(
        RoadmapGenerationService roadmapGenerationService,
        RoleRegistry roleRegistry,
        com.nexpilot.resumepilot.service.StudentIdentityService identityService,
        com.nexpilot.resumepilot.service.StudentPersistenceService persistenceService
    ) {
        this.roadmapGenerationService = roadmapGenerationService;
        this.roleRegistry = roleRegistry;
        this.identityService = identityService;
        this.persistenceService = persistenceService;
    }

    @PostMapping("/generate")
    public ResponseEntity<PersonalizedRoadmapResponse> generateRoadmap(
        @Valid @RequestBody RoadmapGenerationRequest request,
        @org.springframework.web.bind.annotation.RequestHeader(value = "X-Student-Token", required = false) String studentToken
    ) {
        identityService.requireAuthenticatedRequest();
        log.info("Received roadmap generation request for roleId: {}", request.roleId());

        // Validate that role exists in registry
        roleRegistry.getRole(request.roleId());

        PersonalizedRoadmapResponse response = roadmapGenerationService.generateRoadmap(request);

        // Resolve candidate profile & persist roadmap
        com.nexpilot.resumepilot.model.StudentEntity student = identityService.resolveOrCreateStudent(studentToken);
        java.util.UUID roadmapId = null;
        try {
            roadmapId = persistenceService.saveRoadmap(student, response).getId();
        } catch (Exception e) {
            log.error("Failed to persist generated roadmap: {}", e.getMessage());
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not save your learning plan. Please try again.", e);
        }

        log.info("Generated roadmap for roleId: {}, totalMilestones: {}, totalHours: {}",
            request.roleId(), response.milestones().size(), response.totalEstimatedHours());

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        if (!identityService.isAuthenticatedRequest()) {
            headers.set("X-Student-Token", student.getStudentToken());
            headers.set("Access-Control-Expose-Headers", "X-Student-Token");
        }
        if (roadmapId != null) headers.set("X-Roadmap-Id", roadmapId.toString());

        return ResponseEntity.ok()
            .headers(headers)
            .body(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Prep Pilot Roadmap Engine",
            "phase", "Phase 3: Personalized AI Learning Roadmaps",
            "supportedRoles", roleRegistry.getSupportedRoleIds(),
            "timestamp", Instant.now().toString()
        ));
    }
}

