package com.nexpilot.resumepilot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexpilot.resumepilot.dto.CapstoneProjectDto;
import com.nexpilot.resumepilot.dto.FreeResourceDto;
import com.nexpilot.resumepilot.dto.PersonalizedRoadmapResponse;
import com.nexpilot.resumepilot.dto.RoadmapGenerationRequest;
import com.nexpilot.resumepilot.dto.RoadmapMilestoneDto;
import com.nexpilot.resumepilot.dto.SkillGapDto;
import com.nexpilot.resumepilot.exception.GeminiServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RoadmapGenerationService {

    private static final Logger log = LoggerFactory.getLogger(RoadmapGenerationService.class);

    private static final String GEMINI_API_URL_TEMPLATE =
        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final RoleRegistry roleRegistry;
    private final FreeResourceCatalog resourceCatalog;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-3-flash-preview}")
    private String modelName;

    public RoadmapGenerationService(
        RestClient restClient,
        ObjectMapper objectMapper,
        RoleRegistry roleRegistry,
        FreeResourceCatalog resourceCatalog
    ) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.roleRegistry = roleRegistry;
        this.resourceCatalog = resourceCatalog;
    }

    public PersonalizedRoadmapResponse generateRoadmap(RoadmapGenerationRequest request) {
        if (apiKey == null || apiKey.trim().isBlank() || "your_gemini_api_key_here".equals(apiKey.trim())) {
            throw new GeminiServiceException(
                "Gemini API key is not configured on the backend server. Please set the GEMINI_API_KEY environment variable.",
                "MISSING_API_KEY",
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }

        RoleRegistry.RoleMetadata role = roleRegistry.getRole(request.roleId());
        String prompt = buildRoadmapPrompt(request, role);

        PersonalizedRoadmapResponse response = null;
        for (int attempt = 1; attempt <= 2; attempt++) {
            try {
                String rawJson = callGeminiApi(prompt);
                response = parseAndEnrichRoadmap(rawJson, role, request);
                break;
            } catch (InvalidRoadmapResponseException e) {
                log.warn("Attempt {} failed to parse Gemini roadmap JSON: {}. Retrying...", attempt, e.getMessage());
                if (attempt == 2) {
                    throw new GeminiServiceException(
                        "AI roadmap generation returned an unparseable response after retry.",
                        "MALFORMED_AI_RESPONSE",
                        HttpStatus.BAD_GATEWAY
                    );
                }
            }
        }

        return response;
    }

    private String callGeminiApi(String prompt) {
        String activeModel = (this.modelName != null && !this.modelName.isBlank()) ? this.modelName.trim() : "gemini-3-flash-preview";
        String endpointUrl = String.format(GEMINI_API_URL_TEMPLATE, activeModel, apiKey);

        Map<String, Object> requestPayload = Map.of(
            "contents", List.of(
                Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", prompt))
                )
            ),
            "generationConfig", Map.of(
                "response_mime_type", "application/json",
                "temperature", 0.3
            )
        );

        try {
            byte[] responseBytes = restClient.post()
                .uri(endpointUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON, MediaType.ALL)
                .body(requestPayload)
                .retrieve()
                .toEntity(byte[].class)
                .getBody();

            if (responseBytes == null || responseBytes.length == 0) {
                throw new InvalidRoadmapResponseException("Empty response payload received from Gemini API.");
            }

            String responseBody = new String(responseBytes, StandardCharsets.UTF_8);
            return extractTextContentFromGeminiResponse(responseBody);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                log.error("Gemini API rate limit or quota exceeded");
                throw new GeminiServiceException(
                    "Gemini API quota exceeded or rate limited. Please try again in a few moments.",
                    "QUOTA_EXCEEDED",
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                log.error("Gemini API authentication failed: {}", e.getStatusCode());
                throw new GeminiServiceException(
                    "Invalid Gemini API key or unauthorized access.",
                    "INVALID_API_KEY",
                    HttpStatus.UNAUTHORIZED
                );
            }
            if ((e.getStatusCode() == HttpStatus.NOT_FOUND || e.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE)
                    && !"gemini-3.1-flash-lite-preview".equals(activeModel)) {
                log.warn("Gemini model {} returned {}, falling back to gemini-3.1-flash-lite-preview...", activeModel, e.getStatusCode());
                this.modelName = "gemini-3.1-flash-lite-preview";
                return callGeminiApi(prompt);
            }
            log.error("Gemini API error HTTP {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new GeminiServiceException(
                "Gemini AI provider returned an error: " + e.getStatusCode() + " - " + e.getStatusText(),
                "AI_PROVIDER_ERROR",
                HttpStatus.BAD_GATEWAY
            );
        } catch (HttpServerErrorException e) {
            if (e.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE && !"gemini-3.1-flash-lite-preview".equals(activeModel)) {
                log.warn("Gemini model {} returned 503, falling back to gemini-3.1-flash-lite-preview...", activeModel);
                this.modelName = "gemini-3.1-flash-lite-preview";
                return callGeminiApi(prompt);
            }
            log.error("Gemini API server error HTTP {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new GeminiServiceException(
                "Gemini AI provider returned a server error: " + e.getStatusCode(),
                "AI_PROVIDER_ERROR",
                HttpStatus.BAD_GATEWAY
            );
        } catch (ResourceAccessException e) {
            log.error("Gemini API request timed out: {}", e.getMessage());
            if (!"gemini-3.1-flash-lite-preview".equals(activeModel)) {
                log.warn("Gemini model {} timed out, falling back to gemini-3.1-flash-lite-preview...", activeModel);
                this.modelName = "gemini-3.1-flash-lite-preview";
                return callGeminiApi(prompt);
            }
            throw new GeminiServiceException(
                "The roadmap generation service timed out waiting for the AI provider. Please try again.",
                "AI_TIMEOUT",
                HttpStatus.GATEWAY_TIMEOUT
            );
        } catch (GeminiServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error calling Gemini API for roadmap: {}", e.getMessage(), e);
            throw new GeminiServiceException(
                "Failed to communicate with AI roadmap service: " + e.getMessage(),
                "AI_COMMUNICATION_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private String extractTextContentFromGeminiResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    for (JsonNode part : parts) {
                        if (part.has("text") && !part.path("text").asText().isBlank()) {
                            return part.path("text").asText();
                        }
                    }
                }
            }
            throw new InvalidRoadmapResponseException("Candidates array or text content missing from Gemini response.");
        } catch (JsonProcessingException e) {
            throw new InvalidRoadmapResponseException("Could not parse Gemini API envelope JSON: " + e.getMessage());
        }
    }

    private PersonalizedRoadmapResponse parseAndEnrichRoadmap(
        String rawJson,
        RoleRegistry.RoleMetadata role,
        RoadmapGenerationRequest request
    ) {
        JsonNode root;
        try {
            String cleanJson = rawJson != null ? rawJson.trim() : "";
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7);
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.substring(3);
            }
            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            }
            cleanJson = cleanJson.trim();
            root = objectMapper.readTree(cleanJson);
        } catch (JsonProcessingException e) {
            throw new InvalidRoadmapResponseException("Model did not return valid JSON: " + e.getMessage());
        }

        if (!root.isObject()) {
            throw new InvalidRoadmapResponseException("Root JSON is not an object.");
        }

        // 1. Parse current strengths
        List<String> currentStrengths = new ArrayList<>();
        JsonNode strengthsNode = root.path("currentStrengths");
        if (strengthsNode.isArray() && !strengthsNode.isEmpty()) {
            for (JsonNode s : strengthsNode) {
                if (!s.asText().isBlank()) {
                    currentStrengths.add(s.asText().trim());
                }
            }
        }
        if (currentStrengths.isEmpty() && request.strengths() != null) {
            currentStrengths.addAll(request.strengths());
        }
        if (currentStrengths.isEmpty()) {
            currentStrengths.add("Core foundational programming concepts");
        }

        // 2. Parse prioritized skill gaps
        List<SkillGapDto> prioritizedGaps = new ArrayList<>();
        JsonNode gapsNode = root.path("prioritizedGaps");
        if (gapsNode.isArray() && !gapsNode.isEmpty()) {
            for (JsonNode g : gapsNode) {
                prioritizedGaps.add(new SkillGapDto(
                    g.path("skill").asText("Core Technical Skill"),
                    g.path("priority").asText("high"),
                    g.path("rationale").asText("Required for ATS pass and technical interview screening.")
                ));
            }
        }
        if (prioritizedGaps.isEmpty() && request.missingKeywords() != null) {
            for (String kw : request.missingKeywords()) {
                prioritizedGaps.add(new SkillGapDto(
                    kw,
                    "high",
                    "Critical keyword identified as missing from resume evaluation."
                ));
            }
        }

        // 3. Parse milestones & enrich with curated free resources
        List<RoadmapMilestoneDto> milestones = new ArrayList<>();
        JsonNode milestonesNode = root.path("milestones");
        int calculatedTotalHours = 0;

        if (milestonesNode.isArray() && !milestonesNode.isEmpty()) {
            int order = 1;
            for (JsonNode m : milestonesNode) {
                String id = m.path("id").asText("m-" + order);
                String title = m.path("title").asText("Milestone " + order);
                String objective = m.path("objective").asText("Master target competencies for " + role.title());
                
                List<String> skills = new ArrayList<>();
                JsonNode skillsNode = m.path("skillsCovered");
                if (skillsNode.isArray()) {
                    for (JsonNode sk : skillsNode) {
                        skills.add(sk.asText());
                    }
                }
                if (skills.isEmpty()) {
                    skills.add(role.title() + " Core Concepts");
                }

                int hours = Math.max(5, Math.min(60, m.path("estimatedHours").asInt(15)));
                calculatedTotalHours += hours;

                String difficulty = m.path("difficulty").asText(order <= 2 ? "beginner" : (order <= 4 ? "intermediate" : "advanced"));
                String exercise = m.path("practicalExercise").asText("Build a mini-project implementing the covered competencies.");
                String criteria = m.path("completionCriteria").asText("Pass all automated tests and push code to GitHub.");

                // Parse any candidate resources the model proposed
                List<FreeResourceDto> candidateResources = new ArrayList<>();
                JsonNode resNode = m.path("resources");
                if (resNode.isArray()) {
                    for (JsonNode r : resNode) {
                        candidateResources.add(new FreeResourceDto(
                            r.path("title").asText(),
                            r.path("url").asText(),
                            r.path("provider").asText(),
                            r.path("skillCovered").asText(),
                            "100% Free",
                            r.path("type").asText("Documentation")
                        ));
                    }
                }

                // Strictly validate against domain allowlist and enrich from verified catalog
                List<FreeResourceDto> enrichedResources = resourceCatalog.enrichResources(skills, candidateResources);

                milestones.add(new RoadmapMilestoneDto(
                    id,
                    order,
                    title,
                    objective,
                    skills,
                    hours,
                    difficulty,
                    enrichedResources,
                    exercise,
                    criteria
                ));
                order++;
            }
        }

        // 4. Parse Capstone Project
        JsonNode capstoneNode = root.path("capstoneProject");
        String capstoneTitle = capstoneNode.path("title").asText(role.title() + " Production Capstone Project");
        String capstoneDesc = capstoneNode.path("description").asText(
            "An end-to-end, deployment-ready project demonstrating full mastery of the targeted role competencies."
        );
        List<String> capstoneSkills = new ArrayList<>();
        JsonNode capSkillsNode = capstoneNode.path("skillsDemonstrated");
        if (capSkillsNode.isArray()) {
            for (JsonNode cs : capSkillsNode) {
                capstoneSkills.add(cs.asText());
            }
        }
        if (capstoneSkills.isEmpty()) {
            capstoneSkills.add(role.title());
        }

        List<String> capstoneDeliverables = new ArrayList<>();
        JsonNode delivNode = capstoneNode.path("deliverables");
        if (delivNode.isArray()) {
            for (JsonNode d : delivNode) {
                capstoneDeliverables.add(d.asText());
            }
        }
        if (capstoneDeliverables.isEmpty()) {
            capstoneDeliverables.add("Fully functional GitHub repository with comprehensive README");
            capstoneDeliverables.add("Deployed live demo or containerized Docker image");
            capstoneDeliverables.add("Automated test suite and architecture diagram");
        }

        int capstoneHours = Math.max(15, Math.min(50, capstoneNode.path("estimatedHours").asInt(25)));
        calculatedTotalHours += capstoneHours;

        CapstoneProjectDto capstoneProject = new CapstoneProjectDto(
            capstoneTitle,
            capstoneDesc,
            capstoneSkills,
            capstoneDeliverables,
            capstoneHours
        );

        int totalWeeks = Math.max(4, (int) Math.ceil((double) calculatedTotalHours / 12.0));

        String generatedAt = DateTimeFormatter.ofPattern("MMM dd, yyyy · HH:mm 'UTC'")
            .withZone(ZoneId.of("UTC"))
            .format(Instant.now());

        return new PersonalizedRoadmapResponse(
            role.id(),
            role.title(),
            generatedAt,
            false,
            calculatedTotalHours,
            totalWeeks,
            currentStrengths,
            prioritizedGaps,
            milestones,
            capstoneProject
        );
    }

    private String buildRoadmapPrompt(RoadmapGenerationRequest request, RoleRegistry.RoleMetadata role) {
        String strengthsStr = request.strengths() != null && !request.strengths().isEmpty()
            ? String.join(", ", request.strengths())
            : "Foundational technical background";

        String gapsStr = request.missingKeywords() != null && !request.missingKeywords().isEmpty()
            ? String.join(", ", request.missingKeywords())
            : role.expectedCompetencies();

        return """
            You are the Principal Technical Curriculum Architect for "Prep Pilot".
            Your task is to create a rigorous, personalized learning roadmap for a student targeting:
            Role: "%s" (%s).
            
            ROLE EXPECTED COMPETENCIES:
            %s
            
            CANDIDATE CURRENT PROFILE:
            <UNTRUSTED_CANDIDATE_PROFILE>
            Current Verified Strengths: %s
            Diagnosed Skill Gaps / Missing Keywords: %s
            Current ATS Benchmark Score: %s
            </UNTRUSTED_CANDIDATE_PROFILE>
            
            INSTRUCTIONS:
            1. Formulate a prioritized list of skill gaps that bridges the candidate from their current state to a job-ready level.
            2. Break the curriculum into 4 to 5 sequential learning milestones ordered logically (foundations -> intermediate frameworks -> advanced patterns/tools).
            3. Each milestone MUST have:
               - title, objective, 2-3 specific skills covered
               - estimatedHours (between 10 and 30 hours)
               - difficulty: "beginner", "intermediate", or "advanced"
               - a realistic, hands-on practicalExercise
               - clear completionCriteria
            4. Design a comprehensive, portfolio-worthy Capstone Project that integrates these skills into a showcase project recruiters value.
            
            OUTPUT FORMAT:
            Output raw JSON ONLY matching the exact schema below. No markdown fences.
            
            JSON SCHEMA:
            {
              "currentStrengths": ["<string>"],
              "prioritizedGaps": [
                {
                  "skill": "<string>",
                  "priority": "critical" | "high" | "medium",
                  "rationale": "<string>"
                }
              ],
              "milestones": [
                {
                  "id": "m-1",
                  "title": "<milestone title>",
                  "objective": "<clear learning goal>",
                  "skillsCovered": ["<skill1>", "<skill2>"],
                  "estimatedHours": <number>,
                  "difficulty": "beginner" | "intermediate" | "advanced",
                  "resources": [
                    {
                      "title": "<resource title>",
                      "url": "<verified HTTPS URL>",
                      "provider": "<FreeCodeCamp / MDN / Official Docs / etc.>",
                      "skillCovered": "<skill>",
                      "type": "Documentation" | "Interactive Course" | "Tutorial" | "Video Guide"
                    }
                  ],
                  "practicalExercise": "<actionable exercise>",
                  "completionCriteria": "<measurable criterion>"
                }
              ],
              "capstoneProject": {
                "title": "<capstone title>",
                "description": "<project description>",
                "skillsDemonstrated": ["<skill1>", "<skill2>"],
                "deliverables": ["<deliverable1>", "<deliverable2>"],
                "estimatedHours": <number>
              }
            }
            """.formatted(
                role.title(),
                role.category(),
                role.expectedCompetencies(),
                strengthsStr,
                gapsStr,
                request.currentScore() != null ? request.currentScore() : "Not specified"
            );
    }

    private static class InvalidRoadmapResponseException extends RuntimeException {
        public InvalidRoadmapResponseException(String message) {
            super(message);
        }
    }
}

