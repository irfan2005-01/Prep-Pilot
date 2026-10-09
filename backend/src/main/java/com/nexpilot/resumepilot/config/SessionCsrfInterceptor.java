package com.nexpilot.resumepilot.config;

import com.nexpilot.resumepilot.controller.AuthController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Component
public class SessionCsrfInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
        HttpSession session = request.getSession(false);
        boolean authenticated = session != null && session.getAttribute(AuthController.STUDENT_ID) instanceof String;
        if (requiresAuthentication(request.getRequestURI()) && !authenticated) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        if (isSafe(request.getMethod()) || !authenticated) return true;
        String expected = (String) session.getAttribute("csrf");
        String provided = request.getHeader("X-CSRF-Token");
        if (expected != null && provided != null && MessageDigest.isEqual(
            expected.getBytes(StandardCharsets.UTF_8), provided.getBytes(StandardCharsets.UTF_8))) return true;
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        return false;
    }

    private boolean requiresAuthentication(String path) {
        return path.startsWith("/api/v1/student/")
            || "/api/v1/resumes/analyze".equals(path)
            || "/api/v1/roadmaps/generate".equals(path)
            || (path.startsWith("/api/v1/interviews/") && !"/api/v1/interviews/health".equals(path));
    }

    private boolean isSafe(String method) {
        return "GET".equalsIgnoreCase(method) || "HEAD".equalsIgnoreCase(method) || "TRACE".equalsIgnoreCase(method);
    }
}
