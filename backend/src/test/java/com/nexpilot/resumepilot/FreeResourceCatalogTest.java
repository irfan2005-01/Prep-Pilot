package com.nexpilot.resumepilot;

import com.nexpilot.resumepilot.dto.FreeResourceDto;
import com.nexpilot.resumepilot.service.FreeResourceCatalog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FreeResourceCatalogTest {

    private FreeResourceCatalog catalog;

    @BeforeEach
    void setUp() {
        catalog = new FreeResourceCatalog();
    }

    @Test
    void shouldAllowVerifiedDomains() {
        assertTrue(catalog.isDomainAllowed("https://developer.mozilla.org/en-US/docs/Web/JavaScript"));
        assertTrue(catalog.isDomainAllowed("https://www.freecodecamp.org/learn/"));
        assertTrue(catalog.isDomainAllowed("https://docs.python.org/3/tutorial/"));
        assertTrue(catalog.isDomainAllowed("https://spring.io/guides/gs/rest-service/"));
        assertTrue(catalog.isDomainAllowed("https://react.dev/learn"));
        assertTrue(catalog.isDomainAllowed("https://sqlbolt.com/"));
        assertTrue(catalog.isDomainAllowed("https://owasp.org/www-project-top-ten/"));
    }

    @Test
    void shouldRejectUntrustedOrInsecureDomains() {
        assertFalse(catalog.isDomainAllowed("http://developer.mozilla.org/")); // Non-HTTPS
        assertFalse(catalog.isDomainAllowed("https://sketchy-paid-courses.com/learn"));
        assertFalse(catalog.isDomainAllowed("https://phishing-site.org/docs"));
        assertFalse(catalog.isDomainAllowed(null));
        assertFalse(catalog.isDomainAllowed(""));
    }

    @Test
    void shouldFindCuratedResourcesForKnownSkills() {
        List<FreeResourceDto> sqlResources = catalog.findResourcesForSkill("SQL");
        assertFalse(sqlResources.isEmpty());
        assertTrue(sqlResources.stream().anyMatch(r -> r.url().contains("sqlbolt") || r.url().contains("postgresql")));

        List<FreeResourceDto> pythonResources = catalog.findResourcesForSkill("Python");
        assertFalse(pythonResources.isEmpty());
        assertTrue(pythonResources.stream().anyMatch(r -> r.url().contains("docs.python.org")));
    }

    @Test
    void shouldEnrichAndFilterCandidateResources() {
        List<FreeResourceDto> candidates = List.of(
            new FreeResourceDto("Fake Paid Course", "https://untrusted-paid.com/course", "Fake", "SQL", "Free", "Tutorial"),
            new FreeResourceDto("Valid MDN Guide", "https://developer.mozilla.org/en-US/docs/Web", "MDN", "Web", "100% Free", "Documentation")
        );

        List<FreeResourceDto> enriched = catalog.enrichResources(List.of("SQL"), candidates);
        assertNotNull(enriched);
        assertFalse(enriched.isEmpty());

        // Must NOT contain the untrusted-paid.com URL
        assertTrue(enriched.stream().noneMatch(r -> r.url().contains("untrusted-paid.com")));
        // Must contain valid allowlisted domains
        assertTrue(enriched.stream().allMatch(r -> catalog.isDomainAllowed(r.url())));
    }
}

