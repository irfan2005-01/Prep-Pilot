package com.nexpilot.resumepilot.service;

import com.nexpilot.resumepilot.dto.FreeResourceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Component
public class FreeResourceCatalog {

    private static final Logger log = LoggerFactory.getLogger(FreeResourceCatalog.class);

    private static final Set<String> ALLOWED_DOMAINS = Set.of(
        "developer.mozilla.org",
        "freecodecamp.org",
        "docs.python.org",
        "docs.oracle.com",
        "spring.io",
        "react.dev",
        "typescriptlang.org",
        "postgresql.org",
        "sqlbolt.com",
        "kaggle.com",
        "owasp.org",
        "roadmap.sh",
        "fastapi.tiangolo.com",
        "pytorch.org",
        "scikit-learn.org",
        "docs.docker.com",
        "docker-curriculum.com",
        "git-scm.com",
        "redis.io",
        "kafka.apache.org",
        "learn.microsoft.com",
        "tableau.com",
        "www.wireshark.org",
        "cs50.harvard.edu"
    );

    private final Map<String, List<FreeResourceDto>> curatedCatalog;

    public FreeResourceCatalog() {
        Map<String, List<FreeResourceDto>> map = new LinkedHashMap<>();

        // SQL & Databases
        map.put("sql", List.of(
            new FreeResourceDto(
                "SQLBolt — Interactive Lessons & Practical Exercises",
                "https://sqlbolt.com/",
                "SQLBolt",
                "SQL",
                "100% Free",
                "Interactive Course"
            ),
            new FreeResourceDto(
                "PostgreSQL Tutorial for Beginners & Developers",
                "https://www.postgresql.org/docs/current/tutorial.html",
                "PostgreSQL Global Development Group",
                "SQL",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Relational Database Certification (PostgreSQL & Bash)",
                "https://www.freecodecamp.org/learn/relational-database/",
                "FreeCodeCamp",
                "SQL",
                "100% Free",
                "Interactive Course"
            )
        ));

        // Python
        map.put("python", List.of(
            new FreeResourceDto(
                "The Python Official Tutorial (v3.12+)",
                "https://docs.python.org/3/tutorial/",
                "Python Software Foundation",
                "Python",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Scientific Computing with Python (Data Structures & Algorithms)",
                "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
                "FreeCodeCamp",
                "Python",
                "100% Free",
                "Interactive Course"
            )
        ));

        // React
        map.put("react", List.of(
            new FreeResourceDto(
                "React Documentation — Quick Start & Deep Dive",
                "https://react.dev/learn",
                "React Core Team",
                "React",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Front End Development Libraries — React",
                "https://www.freecodecamp.org/learn/front-end-development-libraries/",
                "FreeCodeCamp",
                "React",
                "100% Free",
                "Interactive Course"
            )
        ));

        // TypeScript
        map.put("typescript", List.of(
            new FreeResourceDto(
                "TypeScript Handbook for Programmers",
                "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html",
                "Microsoft TypeScript",
                "TypeScript",
                "100% Free",
                "Documentation"
            )
        ));

        // JavaScript & Web Standards
        map.put("javascript", List.of(
            new FreeResourceDto(
                "MDN JavaScript Guide & Reference",
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                "MDN Web Docs",
                "JavaScript",
                "100% Free",
                "Documentation"
            )
        ));

        // Java & Spring Boot
        map.put("java", List.of(
            new FreeResourceDto(
                "Oracle Java Tutorials: Core Language & Concurrency",
                "https://docs.oracle.com/javase/tutorial/",
                "Oracle",
                "Java",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Building a RESTful Web Service with Spring Boot",
                "https://spring.io/guides/gs/rest-service/",
                "Spring by VMware",
                "Spring Boot",
                "100% Free",
                "Tutorial"
            )
        ));
        map.put("spring boot", List.of(
            new FreeResourceDto(
                "Spring Boot Getting Started & Architecture Guide",
                "https://spring.io/guides/gs/rest-service/",
                "Spring by VMware",
                "Spring Boot",
                "100% Free",
                "Tutorial"
            ),
            new FreeResourceDto(
                "Accessing Data with MySQL and Spring Data JPA",
                "https://spring.io/guides/gs/accessing-data-mysql/",
                "Spring by VMware",
                "Spring Data JPA",
                "100% Free",
                "Tutorial"
            )
        ));

        // Tableau & PowerBI & Data Analytics
        map.put("tableau", List.of(
            new FreeResourceDto(
                "Tableau Public Free Video Tutorials & Projects",
                "https://www.tableau.com/learn/training/2022-1",
                "Salesforce Tableau",
                "Tableau",
                "100% Free",
                "Video Guide"
            ),
            new FreeResourceDto(
                "Kaggle Data Visualization Course (Seaborn & Dashboards)",
                "https://www.kaggle.com/learn/data-visualization",
                "Kaggle",
                "Data Visualization",
                "100% Free",
                "Interactive Course"
            )
        ));
        map.put("powerbi", List.of(
            new FreeResourceDto(
                "Microsoft Learn: Get Started with Power BI for Analytics",
                "https://learn.microsoft.com/en-us/training/powerplatform/power-bi",
                "Microsoft Learn",
                "PowerBI",
                "100% Free",
                "Tutorial"
            )
        ));
        map.put("data analysis", List.of(
            new FreeResourceDto(
                "Kaggle Pandas & Data Manipulation",
                "https://www.kaggle.com/learn/pandas",
                "Kaggle",
                "Pandas",
                "100% Free",
                "Interactive Course"
            ),
            new FreeResourceDto(
                "Data Analysis with Python Certification",
                "https://www.freecodecamp.org/learn/data-analysis-with-python/",
                "FreeCodeCamp",
                "Data Analysis",
                "100% Free",
                "Interactive Course"
            )
        ));

        // Machine Learning & AI
        map.put("machine learning", List.of(
            new FreeResourceDto(
                "Scikit-Learn Official Machine Learning Tutorials",
                "https://scikit-learn.org/stable/tutorial/index.html",
                "Scikit-Learn Consortium",
                "Machine Learning",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Deep Learning with PyTorch: 60-Minute Blitz",
                "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
                "PyTorch Foundation",
                "PyTorch",
                "100% Free",
                "Tutorial"
            ),
            new FreeResourceDto(
                "Machine Learning with Python Certification",
                "https://www.freecodecamp.org/learn/machine-learning-with-python/",
                "FreeCodeCamp",
                "Machine Learning",
                "100% Free",
                "Interactive Course"
            )
        ));
        map.put("pytorch", List.of(
            new FreeResourceDto(
                "PyTorch Official Tutorials & Model Building",
                "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
                "PyTorch Foundation",
                "PyTorch",
                "100% Free",
                "Tutorial"
            )
        ));

        // Docker & DevOps
        map.put("docker", List.of(
            new FreeResourceDto(
                "Docker Curriculum — Step-by-Step Hands-On Guide",
                "https://docker-curriculum.com/",
                "Docker Curriculum",
                "Docker",
                "100% Free",
                "Tutorial"
            ),
            new FreeResourceDto(
                "Docker Official Get Started Documentation",
                "https://docs.docker.com/get-started/",
                "Docker Inc.",
                "Docker",
                "100% Free",
                "Documentation"
            )
        ));

        // Cybersecurity
        map.put("cybersecurity", List.of(
            new FreeResourceDto(
                "OWASP Top 10 Web Application Security Risks",
                "https://owasp.org/www-project-top-ten/",
                "OWASP Foundation",
                "Web Security",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Wireshark Official User's Guide to Packet Analysis",
                "https://www.wireshark.org/docs/wsug_html_chunked/",
                "Wireshark Foundation",
                "Network Analysis",
                "100% Free",
                "Documentation"
            ),
            new FreeResourceDto(
                "Information Security Certification (Penetration Testing)",
                "https://www.freecodecamp.org/learn/information-security/",
                "FreeCodeCamp",
                "Security",
                "100% Free",
                "Interactive Course"
            )
        ));

        // Git & Architecture
        map.put("git", List.of(
            new FreeResourceDto(
                "Pro Git Official Book (2nd Edition)",
                "https://git-scm.com/book/en/v2",
                "Git Community",
                "Git",
                "100% Free",
                "Documentation"
            )
        ));

        this.curatedCatalog = Collections.unmodifiableMap(map);
    }

    public boolean isDomainAllowed(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        try {
            URI uri = URI.create(url.trim());
            if (!"https".equalsIgnoreCase(uri.getScheme())) {
                return false;
            }
            String host = uri.getHost();
            if (host == null) {
                return false;
            }
            String lowerHost = host.toLowerCase(Locale.ROOT);
            for (String allowed : ALLOWED_DOMAINS) {
                if (lowerHost.equals(allowed) || lowerHost.endsWith("." + allowed)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public List<FreeResourceDto> findResourcesForSkill(String skill) {
        if (skill == null || skill.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String normalized = skill.trim().toLowerCase(Locale.ROOT);

        for (Map.Entry<String, List<FreeResourceDto>> entry : curatedCatalog.entrySet()) {
            if (normalized.contains(entry.getKey()) || entry.getKey().contains(normalized)) {
                return entry.getValue();
            }
        }
        return Collections.emptyList();
    }

    /**
     * Enriches model-proposed resources or replaces invalid URLs with curated, verified entries.
     */
    public List<FreeResourceDto> enrichResources(List<String> skillsCovered, List<FreeResourceDto> candidateResources) {
        List<FreeResourceDto> result = new ArrayList<>();

        if (candidateResources != null) {
            for (FreeResourceDto res : candidateResources) {
                if (res != null && isDomainAllowed(res.url())) {
                    result.add(new FreeResourceDto(
                        res.title() != null ? res.title() : "Official Guide",
                        res.url(),
                        res.provider() != null ? res.provider() : "Official Documentation",
                        res.skillCovered() != null ? res.skillCovered() : (skillsCovered != null && !skillsCovered.isEmpty() ? skillsCovered.get(0) : "General"),
                        "100% Free",
                        res.type() != null ? res.type() : "Tutorial"
                    ));
                }
            }
        }

        // If candidate list had no valid allowlisted URLs, or has fewer than 2, enrich from curated catalog
        if (result.size() < 2 && skillsCovered != null) {
            for (String skill : skillsCovered) {
                List<FreeResourceDto> matches = findResourcesForSkill(skill);
                for (FreeResourceDto match : matches) {
                    boolean alreadyPresent = result.stream().anyMatch(r -> r.url().equalsIgnoreCase(match.url()));
                    if (!alreadyPresent) {
                        result.add(match);
                    }
                    if (result.size() >= 3) break;
                }
                if (result.size() >= 3) break;
            }
        }

        // Guaranteed fallback if still empty: add FreeCodeCamp or MDN
        if (result.isEmpty()) {
            result.add(new FreeResourceDto(
                "FreeCodeCamp Core Technical Curriculum",
                "https://www.freecodecamp.org/learn/",
                "FreeCodeCamp",
                skillsCovered != null && !skillsCovered.isEmpty() ? skillsCovered.get(0) : "Software Engineering",
                "100% Free",
                "Interactive Course"
            ));
        }

        return result;
    }

    public Set<String> getAllowedDomains() {
        return ALLOWED_DOMAINS;
    }
}

