package com.nexpilot.resumepilot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
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
                                }
                            }
                        }
                    }
                } catch (IOException e) {
                    log.warn("Failed to read {}: {}", pathStr, e.getMessage());
                }
            }
        }
    }
}
