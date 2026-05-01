package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.visit.NewVisitForm;
import com.ffqts.arenape.controllers.utils.GetEmailFromTokenRequest;
import com.ffqts.arenape.models.Visit;
import com.ffqts.arenape.services.VisitBookingService;
import com.ffqts.arenape.services.VisitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/visits")
public class VisitController {

    @Autowired
    private VisitBookingService visitBookingService;

    @Autowired
    private VisitService visitService;

    @PostMapping("/{id}/book")
    public ResponseEntity<?> book(@PathVariable("id") Long visitId, HttpServletRequest req) {
        var userEmail = GetEmailFromTokenRequest.get(req);
        var booking = visitBookingService.book(visitId, userEmail);
        return ResponseEntity.status(201).body(booking);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public Visit create(@RequestBody NewVisitForm newVisitForm) {
        return visitService.createVisit(newVisitForm);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody NewVisitForm updated) {
        return ResponseEntity.ok(visitService.updateVisit(id, updated));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        visitService.deleteVisit(id);
    }

}