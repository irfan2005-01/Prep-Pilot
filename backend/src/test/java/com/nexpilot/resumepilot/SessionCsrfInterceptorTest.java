package com.nexpilot.resumepilot;

import com.nexpilot.resumepilot.config.SessionCsrfInterceptor;
import com.nexpilot.resumepilot.controller.AuthController;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class SessionCsrfInterceptorTest {
    private final SessionCsrfInterceptor interceptor = new SessionCsrfInterceptor();

    @Test
    void anonymousCannotAnalyzeResumeEvenWithStudentToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/resumes/analyze");
        request.addHeader("X-Student-Token", "attacker-controlled-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertFalse(interceptor.preHandle(request, response, new Object()));
        assertEquals(401, response.getStatus());
    }

    @Test
    void anonymousCannotReadStudentHistory() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/student/analyses");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertFalse(interceptor.preHandle(request, response, new Object()));
        assertEquals(401, response.getStatus());
    }

    @Test
    void authenticatedMutationStillRequiresCsrfToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/roadmaps/generate");
        request.getSession(true).setAttribute(AuthController.STUDENT_ID, "account-id");
        request.getSession().setAttribute("csrf", "expected-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertFalse(interceptor.preHandle(request, response, new Object()));
        assertEquals(403, response.getStatus());
    }
}
