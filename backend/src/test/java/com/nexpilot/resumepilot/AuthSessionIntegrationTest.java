package com.nexpilot.resumepilot;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.profiles.active=prod",
    "spring.datasource.url=jdbc:h2:mem:authsession;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.flyway.enabled=true",
    "cors.allowed-origins=https://prep-pilot-gules.vercel.app"
})
class AuthSessionIntegrationTest {
    private static final String ORIGIN = "https://prep-pilot-gules.vercel.app";

    @LocalServerPort int port;
    @Autowired TestRestTemplate http;

    private String url(String path) { return "http://localhost:" + port + path; }

    @Test
    void productionCsrfCookieAndCrossOriginPreflightAreBrowserCompatible() {
        ResponseEntity<JsonNode> csrf = csrf(null);
        assertEquals(HttpStatus.OK, csrf.getStatusCode());
        assertNotNull(csrf.getBody());
        assertTrue(csrf.getBody().path("token").isTextual());

        String cookie = cookie(csrf, null);
        assertNotNull(cookie);
        ResponseEntity<JsonNode> anonymousSession = session(cookie);
        assertEquals(HttpStatus.UNAUTHORIZED, anonymousSession.getStatusCode());
        String setCookie = csrf.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertNotNull(setCookie);
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("Secure"));
        assertTrue(setCookie.contains("SameSite=None"));
        assertEquals(ORIGIN, csrf.getHeaders().getFirst(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
        assertEquals("true", csrf.getHeaders().getFirst(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Origin", ORIGIN);
        headers.set("Access-Control-Request-Method", "POST");
        headers.set("Access-Control-Request-Headers", "content-type,x-csrf-token");
        ResponseEntity<String> preflight = http.exchange(
            url("/api/v1/auth/login"), HttpMethod.OPTIONS, new HttpEntity<>(headers), String.class);
        assertTrue(preflight.getStatusCode().is2xxSuccessful());
        assertEquals(ORIGIN, preflight.getHeaders().getFirst(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
        assertEquals("true", preflight.getHeaders().getFirst(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS));
        assertTrue(String.join(",", preflight.getHeaders().getAccessControlAllowHeaders()).toLowerCase().contains("x-csrf-token"));
    }

    @Test
    void signupRestoresSessionAndExistingAccountCanLogIn() {
        String email = "session-test-" + UUID.randomUUID() + "@example.com";
        String password = "A-secure-test-password-123";

        ResponseEntity<JsonNode> initialCsrf = csrf(null);
        String cookie = cookie(initialCsrf, null);
        assertNotNull(cookie);

        ResponseEntity<JsonNode> repeatedCsrf = csrf(cookie);
        assertEquals(HttpStatus.OK, repeatedCsrf.getStatusCode());
        assertEquals(initialCsrf.getBody().path("token").asText(), repeatedCsrf.getBody().path("token").asText(),
            "The token returned for the same session must remain the token accepted by registration.");

        HttpHeaders registerHeaders = jsonHeaders(cookie, initialCsrf.getBody().path("token").asText());
        String registerBody = "{\"name\":\"Session Test\",\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
        ResponseEntity<JsonNode> registered = http.exchange(
            url("/api/v1/auth/register"), HttpMethod.POST, new HttpEntity<>(registerBody, registerHeaders), JsonNode.class);
        assertEquals(HttpStatus.CREATED, registered.getStatusCode());
        cookie = cookie(registered, cookie);
        assertEquals(email, registered.getBody().path("email").asText());

        ResponseEntity<JsonNode> restored = session(cookie);
        assertEquals(HttpStatus.OK, restored.getStatusCode());
        assertEquals(email, restored.getBody().path("email").asText());

        ResponseEntity<JsonNode> loginCsrf = csrf(cookie);
        cookie = cookie(loginCsrf, cookie);
        HttpHeaders loginHeaders = jsonHeaders(cookie, loginCsrf.getBody().path("token").asText());
        String loginBody = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
        ResponseEntity<JsonNode> loggedIn = http.exchange(
            url("/api/v1/auth/login"), HttpMethod.POST, new HttpEntity<>(loginBody, loginHeaders), JsonNode.class);
        assertEquals(HttpStatus.OK, loggedIn.getStatusCode());
        cookie = cookie(loggedIn, cookie);
        assertEquals(email, session(cookie).getBody().path("email").asText());
    }

    private ResponseEntity<JsonNode> csrf(String cookie) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Origin", ORIGIN);
        if (cookie != null) headers.set(HttpHeaders.COOKIE, cookie);
        return http.exchange(url("/api/v1/auth/csrf"), HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
    }

    private ResponseEntity<JsonNode> session(String cookie) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.COOKIE, cookie);
        return http.exchange(url("/api/v1/auth/session"), HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
    }

    private HttpHeaders jsonHeaders(String cookie, String csrfToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set(HttpHeaders.COOKIE, cookie);
        headers.set("X-CSRF-Token", csrfToken);
        return headers;
    }

    private String cookie(ResponseEntity<?> response, String previous) {
        String setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        if (setCookie == null) return previous;
        return setCookie.substring(0, setCookie.indexOf(';'));
    }
}
