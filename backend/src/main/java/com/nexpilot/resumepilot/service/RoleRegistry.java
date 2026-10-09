package com.nexpilot.resumepilot.service;

import com.nexpilot.resumepilot.exception.UnsupportedRoleException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Component
public class RoleRegistry {

    public record RoleMetadata(
        String id,
        String title,
        String category,
        String evaluationFocus,
        String expectedCompetencies
    ) {}

    private final Map<String, RoleMetadata> roles;

    public RoleRegistry() {
        Map<String, RoleMetadata> map = new LinkedHashMap<>();

        map.put("full-stack-developer", new RoleMetadata(
            "full-stack-developer",
            "Full-Stack Developer",
            "Software Engineering",
            "End-to-end web architecture, reactive frontend state, REST/GraphQL APIs, relational & NoSQL datastores, CI/CD, and Docker containerization.",
            "React, TypeScript, Node.js, Spring Boot, PostgreSQL, Docker, Redis, RESTful APIs, Git, Unit Testing"
        ));

        map.put("java-developer", new RoleMetadata(
            "java-developer",
            "Java Developer",
            "Enterprise Engineering",
            "Enterprise backend systems, JVM internals, Spring Boot 3, Hibernate/JPA, transaction management, concurrency/multithreading, message brokers (Kafka/RabbitMQ), and SQL query performance.",
            "Java 17/21, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL/MySQL, JUnit 5, Kafka, Docker, Maven/Gradle, Microservices"
        ));

        map.put("data-analyst", new RoleMetadata(
            "data-analyst",
            "Data Analyst",
            "Data & Analytics",
            "Exploratory data analysis, SQL window functions, statistical hypothesis testing, A/B testing, business dashboards (Tableau/PowerBI), and data pipelines.",
            "SQL, Python (Pandas, NumPy), Tableau, PowerBI, Excel, A/B Testing, ETL, Data Visualization, Business Metrics"
        ));

        map.put("ml-engineer", new RoleMetadata(
            "ml-engineer",
            "Machine Learning Engineer",
            "Artificial Intelligence",
            "Model training, feature engineering, evaluation metrics (F1, precision, recall), vector search/RAG pipelines, MLOps, inference APIs (FastAPI), and PyTorch/TensorFlow.",
            "Python, PyTorch, Scikit-Learn, Hugging Face, ChromaDB/Pinecone, FastAPI, Docker, MLflow, ONNX"
        ));

        map.put("frontend-developer", new RoleMetadata(
            "frontend-developer",
            "Frontend Developer",
            "User Interface Engineering",
            "Modern component architecture, web performance & Core Web Vitals, accessibility (WCAG AA), responsive design, TypeScript, state management, and automated UI testing.",
            "TypeScript, React, Next.js, Tailwind CSS, HTML5, CSS3, Vite, WCAG AA, Jest/Playwright"
        ));

        map.put("backend-developer", new RoleMetadata(
            "backend-developer",
            "Backend Developer",
            "Server & Systems Engineering",
            "High-throughput APIs, database indexing, caching strategies (Redis), asynchronous task workers, OAuth2/JWT security, and microservices architecture.",
            "Node.js/Go/Java, PostgreSQL, Redis, Docker, REST/gRPC, Kafka, System Design, Database Indexing"
        ));

        map.put("cybersecurity-analyst", new RoleMetadata(
            "cybersecurity-analyst",
            "Cybersecurity Analyst",
            "Information Security",
            "Threat modeling, SIEM log monitoring (Splunk/ELK), MITRE ATT&CK framework mapping, vulnerability assessments (Nessus/OWASP), incident response, and network protocol inspection.",
            "Network Security, Wireshark, SIEM (Splunk), OWASP Top 10, NIST Framework, Linux, Python/Bash, CompTIA Security+"
        ));

        this.roles = Collections.unmodifiableMap(map);
    }

    public RoleMetadata getRole(String roleId) {
        if (roleId == null || !roles.containsKey(roleId.trim().toLowerCase())) {
            throw new UnsupportedRoleException(
                "Unsupported roleId '" + roleId + "'. Supported roles are: " + String.join(", ", roles.keySet())
            );
        }
        return roles.get(roleId.trim().toLowerCase());
    }

    public boolean isValidRole(String roleId) {
        return roleId != null && roles.containsKey(roleId.trim().toLowerCase());
    }

    public Set<String> getSupportedRoleIds() {
        return roles.keySet();
    }
}

