package com.ffqts.arenape.infra.repositories;

import com.ffqts.arenape.domain.models.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<Event> findByTitle(String title);
    List<Event> findByActiveTrue();
    List<Event> findByActiveTrueAndCategory_Id(Long categoryId);
}
