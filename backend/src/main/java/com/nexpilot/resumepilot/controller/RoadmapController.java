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

    public RoadmapController(
        RoadmapGenerationService roadmapGenerationService,
        RoleRegistry roleRegistry
    ) {
        this.roadmapGenerationService = roadmapGenerationService;
        this.roleRegistry = roleRegistry;
    }

    @PostMapping("/generate")
    public ResponseEntity<PersonalizedRoadmapResponse> generateRoadmap(
        @Valid @RequestBody RoadmapGenerationRequest request
    ) {
        log.info("Received roadmap generation request for roleId: {}", request.roleId());

        // Validate that role exists in registry
        roleRegistry.getRole(request.roleId());

        PersonalizedRoadmapResponse response = roadmapGenerationService.generateRoadmap(request);

        log.info("Generated roadmap for roleId: {}, totalMilestones: {}, totalHours: {}",
            request.roleId(), response.milestones().size(), response.totalEstimatedHours());

        return ResponseEntity.ok(response);
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

