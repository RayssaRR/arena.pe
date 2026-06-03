package com.ffqts.arenape.presentation.controllers.event;

import com.ffqts.arenape.domain.services.event.IDeleteEvent;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/events")
public class DeleteEventController {

    @Autowired
    private IDeleteEvent service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventById(@PathVariable String id, HttpServletRequest req) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
