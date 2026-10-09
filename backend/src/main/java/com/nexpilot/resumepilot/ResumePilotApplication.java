package com.nexpilot.resumepilot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
@EnableScheduling
public class ResumePilotApplication {

    private static final Logger log = LoggerFactory.getLogger(ResumePilotApplication.class);

    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(ResumePilotApplication.class, args);
    }

    private static void loadDotenv() {
        String[] candidatePaths = {
            ".env",
            "../.env",
            "backend/.env",
            ".env.local",
            "../.env.local"
        };

        for (String pathStr : candidatePaths) {
            File file = new File(pathStr);
            if (file.exists() && file.isFile()) {
                log.info("Loading environment variables from {}", file.getAbsolutePath());
                try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String val = line.substring(eqIdx + 1).trim();
                            if ((val.startsWith("\"") && val.endsWith("\"")) ||
                                (val.startsWith("'") && val.endsWith("'"))) {
                                val = val.substring(1, val.length() - 1);
                            }
                            if (!val.isEmpty()) {
                                if (System.getProperty(key) == null && System.getenv(key) == null) {
                                    System.setProperty(key, val);
                                }
                                if ("GEMINI_API_KEY".equalsIgnoreCase(key) && System.getProperty("gemini.api.key") == null) {
                                    System.setProperty("gemini.api.key", val);
                                } else if ("GEMINI_MODEL".equalsIgnoreCase(key) && System.getProperty("gemini.model") == null) {
                                    System.setProperty("gemini.model", val);
                                } else if ("SERVER_PORT".equalsIgnoreCase(key) && System.getProperty("server.port") == null) {
                                    System.setProperty("server.port", val);
                                } else if ("CORS_ALLOWED_ORIGINS".equalsIgnoreCase(key) && System.getProperty("cors.allowed-origins") == null) {
                                    System.setProperty("cors.allowed-origins", val);
                                } else if (("DB_URL".equalsIgnoreCase(key) || "SPRING_DATASOURCE_URL".equalsIgnoreCase(key)) && System.getProperty("spring.datasource.url") == null) {
                                    System.setProperty("spring.datasource.url", val);
                                } else if (("DB_USERNAME".equalsIgnoreCase(key) || "SPRING_DATASOURCE_USERNAME".equalsIgnoreCase(key)) && System.getProperty("spring.datasource.username") == null) {
                                    System.setProperty("spring.datasource.username", val);
                                } else if (("DB_PASSWORD".equalsIgnoreCase(key) || "SPRING_DATASOURCE_PASSWORD".equalsIgnoreCase(key)) && System.getProperty("spring.datasource.password") == null) {
                                    System.setProperty("spring.datasource.password", val);
                                }
                            }
                        }
                    }
                } catch (IOException e) {
                    log.warn("Failed to read {}: {}", pathStr, e.getMessage());
                }
            }
        }

        configureDatabaseFallback();
    }

    private static void configureDatabaseFallback() {
        String customUrl = System.getProperty("spring.datasource.url", System.getenv("DB_URL"));
        if (customUrl == null) {
            customUrl = System.getenv("SPRING_DATASOURCE_URL");
        }

        // If no custom URL is provided or it targets default localhost:5432, check availability
        if (customUrl == null || customUrl.contains("localhost:5432") || customUrl.contains("127.0.0.1:5432")) {
            boolean pgAvailable = isPortReachable("localhost", 5432, 300);
            if (!pgAvailable) {
                if (isProductionEnvironment()) {
                    throw new IllegalStateException("PostgreSQL is unavailable. Production startup will not use the in-memory H2 fallback.");
                }
                log.info("PostgreSQL service not detected on localhost:5432. Enabling resilient in-memory database with PostgreSQL compatibility.");
                System.setProperty("spring.datasource.url", "jdbc:h2:mem:preppilot;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH;DB_CLOSE_DELAY=-1");
                System.setProperty("spring.datasource.driver-class-name", "org.h2.Driver");
                System.setProperty("spring.datasource.username", "sa");
                System.setProperty("spring.datasource.password", "");
                System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.H2Dialect");
            } else {
                log.info("Detected active PostgreSQL service on localhost:5432.");
            }
        } else {
            log.info("Configured custom database datasource URL.");
        }
    }

    private static boolean isProductionEnvironment() {
        String profiles = System.getProperty("spring.profiles.active", System.getenv("SPRING_PROFILES_ACTIVE"));
        String appEnvironment = System.getProperty("APP_ENV", System.getenv("APP_ENV"));
        return "production".equalsIgnoreCase(appEnvironment)
            || (profiles != null && java.util.Arrays.stream(profiles.split(","))
                .map(String::trim)
                .anyMatch(profile -> "prod".equalsIgnoreCase(profile) || "production".equalsIgnoreCase(profile)));
    }

    private static boolean isPortReachable(String host, int port, int timeoutMs) {
        try (java.net.Socket socket = new java.net.Socket()) {
            socket.connect(new java.net.InetSocketAddress(host, port), timeoutMs);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
