package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.visit.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitRepository extends JpaRepository<Visit, Long> {
}