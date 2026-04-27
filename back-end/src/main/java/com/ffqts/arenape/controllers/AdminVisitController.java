package com.ffqts.arenape.controllers;

import com.ffqts.arenape.models.Visit;
import com.ffqts.arenape.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/admin/visits")
public class AdminVisitController {

    @Autowired
    private VisitRepository repository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Visit create(@RequestBody Visit visit) {
        return repository.save(visit);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Visit update(@PathVariable Long id, @RequestBody Visit updated) {
        var visit = repository.findById(id).orElseThrow();

        visit.setDate(updated.getDate());
        visit.setMaxVisitors(updated.getMaxVisitors());
        visit.setShift(updated.getShift());

        return repository.save(visit);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}