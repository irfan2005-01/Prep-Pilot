package com.nexpilot.resumepilot.controller;

import com.nexpilot.resumepilot.dto.*;
import com.nexpilot.resumepilot.model.*;
import com.nexpilot.resumepilot.repository.*;
import com.nexpilot.resumepilot.service.StudentIdentityService;
import com.nexpilot.resumepilot.service.StudentPersistenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/student")
public class StudentDashboardController {

    private static final Logger log = LoggerFactory.getLogger(StudentDashboardController.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy - HH:mm 'UTC'").withZone(ZoneId.of("UTC"));

    private final StudentIdentityService identityService;
    private final StudentPersistenceService persistenceService;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapMilestoneRepository milestoneRepository;
    private final InterviewSessionRepository interviewSessionRepository;

    public StudentDashboardController(
        StudentIdentityService identityService,
        StudentPersistenceService persistenceService,
        ResumeAnalysisRepository resumeAnalysisRepository,
        RoadmapRepository roadmapRepository,
        RoadmapMilestoneRepository milestoneRepository,
        InterviewSessionRepository interviewSessionRepository
    ) {
        this.identityService = identityService;
        this.persistenceService = persistenceService;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.roadmapRepository = roadmapRepository;
        this.milestoneRepository = milestoneRepository;
        this.interviewSessionRepository = interviewSessionRepository;
    }

    private HttpHeaders createTokenHeaders(StudentEntity student) {
        HttpHeaders headers = new HttpHeaders();
        if (!identityService.isAuthenticatedRequest()) {
            headers.set("X-Student-Token", student.getStudentToken());
            headers.set("Access-Control-Expose-Headers", "X-Student-Token");
        }
        return headers;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        log.info("Fetching student dashboard summary");

        // 1. Resume Analyses stats
        List<ResumeAnalysisEntity> analyses = resumeAnalysisRepository.findAllByStudentOrderByCreatedAtDesc(student);
        long totalAnalyses = analyses.size();
        Integer latestAtsScore = null;
        String latestRoleTarget = null;
        if (!analyses.isEmpty()) {
            latestAtsScore = analyses.get(0).getOverallScore();
            latestRoleTarget = analyses.get(0).getRoleTitle();
        }

        List<ResumeAnalysisHistoryItemDto> recentAnalyses = analyses.stream()
            .limit(5)
            .map(a -> new ResumeAnalysisHistoryItemDto(
                a.getId(),
                a.getRoleId(),
                a.getRoleTitle(),
                a.getOverallScore(),
                a.getMatchStatus(),
                a.getSummary(),
                DATE_FMT.format(a.getCreatedAt())
            ))
            .collect(Collectors.toList());

        // 2. Roadmaps stats
        List<RoadmapEntity> roadmaps = roadmapRepository.findAllByStudentOrderByCreatedAtDesc(student);
        long totalRoadmaps = roadmaps.size();
        long totalMilestones = 0;
        long completedMilestones = 0;

        List<RoadmapHistoryItemDto> recentRoadmaps = new ArrayList<>();
        for (RoadmapEntity r : roadmaps) {
            List<RoadmapMilestoneEntity> milestones = milestoneRepository.findAllByRoadmapOrderByMilestoneOrderAsc(r);
            long rTotal = milestones.size();
            long rCompleted = milestones.stream().filter(m -> Boolean.TRUE.equals(m.getIsCompleted())).count();
            int progress = rTotal > 0 ? (int) Math.round(((double) rCompleted / rTotal) * 100.0) : 0;

            totalMilestones += rTotal;
            completedMilestones += rCompleted;

            if (recentRoadmaps.size() < 5) {
                recentRoadmaps.add(new RoadmapHistoryItemDto(
                    r.getId(),
                    r.getRoleId(),
                    r.getRoleTitle(),
                    r.getTotalEstimatedHours(),
                    r.getTotalWeeks(),
                    (int) rTotal,
                    rCompleted,
                    progress,
                    DATE_FMT.format(r.getCreatedAt())
                ));
            }
        }

        int roadmapProgressPercentage = totalMilestones > 0
            ? (int) Math.round(((double) completedMilestones / totalMilestones) * 100.0)
            : 0;

        // 3. Interview stats
        List<InterviewSessionEntity> sessions = interviewSessionRepository.findAllByStudentOrderByCreatedAtDesc(student);
        long totalInterviews = sessions.stream().filter(s -> Boolean.TRUE.equals(s.getIsFinished())).count();

        Integer averageInterviewScore = null;
        List<Integer> finishedScores = sessions.stream()
            .filter(s -> Boolean.TRUE.equals(s.getIsFinished()) && s.getOverallScore() != null)
            .map(InterviewSessionEntity::getOverallScore)
            .toList();

        if (!finishedScores.isEmpty()) {
            double avg = finishedScores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            averageInterviewScore = (int) Math.round(avg);
        }

        List<InterviewHistoryItemDto> recentInterviews = sessions.stream()
            .limit(5)
            .map(s -> new InterviewHistoryItemDto(
                s.getId(),
                s.getSessionId(),
                s.getRoleId(),
                s.getRoleTitle(),
                s.getInterviewType(),
                s.getDifficulty(),
                s.getTotalQuestions(),
                s.getAnsweredCount(),
                s.getOverallScore(),
                s.getStatus(),
                Boolean.TRUE.equals(s.getIsFinished()),
                DATE_FMT.format(s.getCreatedAt())
            ))
            .collect(Collectors.toList());

        DashboardSummaryDto summary = new DashboardSummaryDto(
            identityService.isAuthenticatedRequest() ? "" : student.getStudentToken(),
            student.getName() != null ? student.getName() : "Candidate",
            DATE_FMT.format(student.getCreatedAt()),
            totalAnalyses,
            latestAtsScore,
            latestRoleTarget,
            totalRoadmaps,
            totalMilestones,
            completedMilestones,
            roadmapProgressPercentage,
            totalInterviews,
            averageInterviewScore,
            recentAnalyses,
            recentRoadmaps,
            recentInterviews
        );

        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(summary);
    }

    // ==================== RESUME ANALYSES ====================

    @GetMapping("/analyses")
    public ResponseEntity<List<ResumeAnalysisHistoryItemDto>> getAllAnalyses(
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        List<ResumeAnalysisEntity> entities = resumeAnalysisRepository.findAllByStudentOrderByCreatedAtDesc(student);

        List<ResumeAnalysisHistoryItemDto> items = entities.stream()
            .map(a -> new ResumeAnalysisHistoryItemDto(
                a.getId(),
                a.getRoleId(),
                a.getRoleTitle(),
                a.getOverallScore(),
                a.getMatchStatus(),
                a.getSummary(),
                DATE_FMT.format(a.getCreatedAt())
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(items);
    }

    @GetMapping("/analyses/{id}")
    public ResponseEntity<ResumeAnalysisResponse> getAnalysisById(
        @PathVariable UUID id,
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        ResumeAnalysisEntity entity = resumeAnalysisRepository.findByIdAndStudent(id, student)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume analysis not found or not owned by student"));

        ResumeAnalysisResponse response = persistenceService.reconstructResumeAnalysis(entity);
        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(response);
    }

    // ==================== LEARNING ROADMAPS ====================

    @GetMapping("/roadmaps")
    public ResponseEntity<List<RoadmapHistoryItemDto>> getAllRoadmaps(
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        List<RoadmapEntity> roadmaps = roadmapRepository.findAllByStudentOrderByCreatedAtDesc(student);

        List<RoadmapHistoryItemDto> items = roadmaps.stream()
            .map(r -> {
                List<RoadmapMilestoneEntity> milestones = milestoneRepository.findAllByRoadmapOrderByMilestoneOrderAsc(r);
                long completed = milestones.stream().filter(m -> Boolean.TRUE.equals(m.getIsCompleted())).count();
                int progress = !milestones.isEmpty() ? (int) Math.round(((double) completed / milestones.size()) * 100.0) : 0;
                return new RoadmapHistoryItemDto(
                    r.getId(),
                    r.getRoleId(),
                    r.getRoleTitle(),
                    r.getTotalEstimatedHours(),
                    r.getTotalWeeks(),
                    milestones.size(),
                    completed,
                    progress,
                    DATE_FMT.format(r.getCreatedAt())
                );
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(items);
    }

    @GetMapping("/roadmaps/{id}")
    public ResponseEntity<Map<String, Object>> getRoadmapById(
        @PathVariable UUID id,
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        RoadmapEntity entity = roadmapRepository.findByIdAndStudent(id, student)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roadmap not found or not owned by student"));

        PersonalizedRoadmapResponse roadmap = persistenceService.reconstructRoadmap(entity);
        List<RoadmapMilestoneEntity> milestones = milestoneRepository.findAllByRoadmapOrderByMilestoneOrderAsc(entity);
        Map<String, Boolean> milestoneCompletion = milestones.stream()
            .collect(Collectors.toMap(RoadmapMilestoneEntity::getMilestoneKey, m -> Boolean.TRUE.equals(m.getIsCompleted()), (a, b) -> b));

        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(Map.of(
                "roadmapId", entity.getId(),
                "roadmap", roadmap,
                "milestoneCompletion", milestoneCompletion
            ));
    }

    @PutMapping("/roadmaps/{id}/milestones/{milestoneKey}")
    public ResponseEntity<Map<String, Object>> updateMilestoneStatus(
        @PathVariable UUID id,
        @PathVariable String milestoneKey,
        @RequestBody UpdateMilestoneRequest request,
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        try {
            RoadmapMilestoneEntity updated = persistenceService.updateMilestoneCompletion(student, id, milestoneKey, request.completed());
            return ResponseEntity.ok()
                .headers(createTokenHeaders(student))
                .body(Map.of(
                    "milestoneKey", updated.getMilestoneKey(),
                    "completed", updated.getIsCompleted(),
                    "completedAt", updated.getCompletedAt() != null ? updated.getCompletedAt().toString() : ""
                ));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // ==================== INTERVIEW SESSIONS ====================

    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewHistoryItemDto>> getAllInterviews(
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        List<InterviewSessionEntity> sessions = interviewSessionRepository.findAllByStudentOrderByCreatedAtDesc(student);

        List<InterviewHistoryItemDto> items = sessions.stream()
            .map(s -> new InterviewHistoryItemDto(
                s.getId(),
                s.getSessionId(),
                s.getRoleId(),
                s.getRoleTitle(),
                s.getInterviewType(),
                s.getDifficulty(),
                s.getTotalQuestions(),
                s.getAnsweredCount(),
                s.getOverallScore(),
                s.getStatus(),
                Boolean.TRUE.equals(s.getIsFinished()),
                DATE_FMT.format(s.getCreatedAt())
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(items);
    }

    @GetMapping("/interviews/{sessionId}")
    public ResponseEntity<InterviewSummaryResponse> getInterviewBySessionId(
        @PathVariable String sessionId,
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        InterviewSessionEntity session = interviewSessionRepository.findBySessionIdAndStudent(sessionId, student)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview session not found or not owned by student"));

        InterviewSummaryResponse summary = persistenceService.reconstructInterviewSummary(session);
        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(summary);
    }

    // ==================== DATA DELETION ====================

    @DeleteMapping("/data")
    public ResponseEntity<Map<String, Object>> deleteAllData(
        @RequestHeader(value = "X-Student-Token", required = false) String tokenHeader
    ) {
        StudentEntity student = identityService.resolveOrCreateStudent(tokenHeader);
        persistenceService.deleteAllStudentData(student);
        return ResponseEntity.ok()
            .headers(createTokenHeaders(student))
            .body(Map.of(
                "deleted", true,
                "message", "All historical candidate data has been permanently deleted from Prep Pilot."
            ));
    }
}

