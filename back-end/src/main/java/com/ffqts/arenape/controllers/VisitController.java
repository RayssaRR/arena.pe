package com.ffqts.arenape.controllers;

import com.ffqts.arenape.models.User;
import com.ffqts.arenape.services.VisitBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/visits")
public class VisitController {

    @Autowired
    private VisitBookingService service;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/book")
    public ResponseEntity<?> book(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        var booking = service.book(id, user);
        return ResponseEntity.status(201).body(booking);
    }
}