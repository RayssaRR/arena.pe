package com.ffqts.arenape.presentation.utils;

import com.ffqts.arenape.infra.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

public class GetEmailFromTokenRequest {
    public static String get(HttpServletRequest req) {
        String token = req.getHeader("Authorization");
        String actualToken = token.replace("Bearer ", "");
        return JwtUtil.validate(actualToken);
    }
}
