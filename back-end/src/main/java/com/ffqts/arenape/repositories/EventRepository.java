package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.event.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<Event> findByTitle(String title);
    List<Event> findByActiveTrue();
    List<Event> findByActiveTrueAndCategory_Id(Long categoryId);
}
