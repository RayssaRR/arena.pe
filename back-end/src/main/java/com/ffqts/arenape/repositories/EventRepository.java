package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.Event;
import com.ffqts.arenape.models.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<Event> findByTitle(String title);

    @Query("""
        SELECT e FROM Event e 
        WHERE (:title IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%')))
            AND (:status IS NULL OR e.status = :status)
            AND (:categoryId IS NULL OR e.category.id = :categoryId)
            AND (:date IS NULL OR CAST(e.eventDate AS date) = :date)
        ORDER BY 
            CASE WHEN :orderBy = 'eventDate' AND :direction = 'asc' THEN e.eventDate END ASC,
            CASE WHEN :orderBy = 'eventDate' AND :direction = 'desc' THEN e.eventDate END ASC,
            CASE WHEN :orderBy = 'title' AND :direction = 'asc' THEN e.title END ASC,
            CASE WHEN :orderBy = 'title' AND :direction = 'desc' THEN e.title END ASC,
            CASE WHEN :orderBy = 'popularity' AND :direction = 'asc' THEN e.ticketsSold END ASC,
            CASE WHEN :orderBy = 'popularity' AND :direction = 'desc' THEN e.ticketsSold END ASC,
            e.eventDate ASC
    """)
    List<Event> findWithFilters(
            @Param("title") String title,
            @Param("status") EventStatus status,
            @Param("categoryId") Long categoryId,
            @Param("date") LocalDate date,
            @Param("orderBy") String orderBy,
            @Param("direction") String direction
    );
}
