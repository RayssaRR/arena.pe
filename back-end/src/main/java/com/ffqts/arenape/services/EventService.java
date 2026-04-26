package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.models.*;
import com.ffqts.arenape.repositories.CategoryRepository;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthService authService;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getFilteredEvents(
            String title,
            EventStatus status,
            Long categoryId,
            LocalDate date,
            String orderBy,
            String direction
    ) {
        String normalizedOrderBy = (orderBy == null || orderBy.isBlank()) ? "eventDate" : orderBy;
        String normalizedDirection = (direction == null || direction.isBlank()) ? "asc" : direction.toLowerCase();

        if (!List.of("eventDate", "title", "popularity").contains(normalizedOrderBy)) {
            throw new IllegalArgumentException("Ordenação inválida. Use 'eventDate', 'title' ou 'popularity'");
        }

        if (!normalizedDirection.equals("asc") && !normalizedDirection.equals("desc")) {
            throw new IllegalArgumentException("Direção inválida. Use 'asc' ou 'desc'");
        }

        if (categoryId != null) {
            categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        }

        List<Event> todos = eventRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        List<Event> toUpdate = new ArrayList<>();

        for (Event event : todos) {
            if (event.getStatus() == EventStatus.CANCELED) continue;

            EventStatus computed = now.isBefore(event.getEventDate())
                    ? EventStatus.UPCOMING
                    : EventStatus.COMPLETED;

            if (event.getStatus() != computed) {
                event.setStatus(computed);
                toUpdate.add(event);
            }
        }

        if (!toUpdate.isEmpty()) {
            eventRepository.saveAll(toUpdate);
        }

        return eventRepository.findWithFilters(
                title,
                status,
                categoryId,
                date,
                normalizedOrderBy,
                normalizedDirection
        );
    }

    public Event createEvent(NewEventForm newEventForm, String creatorEmail) {
        if (eventRepository.findByTitle(newEventForm.title()).isPresent()) {
            throw new IllegalArgumentException("Evento com esse título já existe");
        }

        var creator = userRepository.findUserByEmail(creatorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Organizador não encontrado"));

        Category category = categoryRepository.findById(newEventForm.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        Event newEvent = new Event(
            newEventForm.title(),
            newEventForm.description(),
            newEventForm.eventDate(),
            newEventForm.capacity(),
            creator,
            newEventForm.imageUrl(),
            category
        );

        return eventRepository.save(newEvent);
    }

    public Event updateEvent(NewEventForm updatedEvent, String eventId) {
        var currentEvent = eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
        updateEventData(updatedEvent, currentEvent);
        return currentEvent;
    }

    public void deleteEvent(String eventId, String creatorEmail) {
        var event = eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
        eventRepository.delete(event);
    }

    private void updateEventData(NewEventForm updatedEvent, Event currentEvent) {
        currentEvent.setTitle(updatedEvent.title());
        currentEvent.setDescription(updatedEvent.description());
        currentEvent.setEventDate(updatedEvent.eventDate());
        currentEvent.setCapacity(updatedEvent.capacity());
        currentEvent.setStatus(updatedEvent.status());
        currentEvent.setImageUrl(updatedEvent.imageUrl());
    }
}
