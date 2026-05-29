package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.event.EventResponseDTO;
import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.controllers.dto.event.TicketSectorDTO;
import com.ffqts.arenape.controllers.dto.ticket.NewTicketModelForm;
import com.ffqts.arenape.models.event.Category;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.event.EventStatus;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.repositories.CategoryRepository;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.TicketModelRepository;
import com.ffqts.arenape.repositories.UserRepository;
import com.ffqts.arenape.repositories.UserTicketRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private TicketModelService ticketModelService;

    public List<Event> getAllEvents() { return eventRepository.findByActiveTrue(); }

    public List<EventResponseDTO> getAllEventsWithDeleted() { 
      return eventRepository.findAll().stream()
            .sorted((e1, e2) -> e2.getCreatedAt().compareTo(e1.getCreatedAt()))
            .map(this::convertEventToResponseDTO)
            .toList();
    }

    public List<EventResponseDTO> getAllEventsWithDetails() {
        return eventRepository.findByActiveTrue().stream()
            .map(this::convertEventToResponseDTO)
            .toList();
    }

    private EventResponseDTO convertEventToResponseDTO(Event event) {
        List<TicketModel> ticketModels = ticketModelRepository.findByExpiredFalseAndEvent_Id(event.getId());
        int totalCapacity = ticketModels.stream()
            .mapToInt(TicketModel::getTicketsAvailable)
            .sum();
        
        int totalTicketsSold = userTicketRepository.countByEvent_Id(event.getId());
        
        List<TicketSectorDTO> sectors = ticketModels.stream()
            .map(tm -> new TicketSectorDTO(
                tm.getId().toString(),
                tm.getTicketLocation(),
                tm.getPrice(),
                tm.getTicketsAvailable(),
                tm.getTicketsSold()
            ))
            .toList();
        
        return new EventResponseDTO(
            event.getId().toString(),
            event.getTitle(),
            event.getDescription(),
            event.getEventDate(),
            totalCapacity,
            totalTicketsSold,
            event.getStatus(),
            event.isActive(),
            event.getImageUrl(),
            event.getCategory(),
            sectors
        );
    }

    public List<EventResponseDTO> getFilteredEventsWithDetails(
            Long categoryId
    ) {
        List<Event> filteredEvents = eventRepository.findByActiveTrueAndCategory_Id(categoryId);
        return filteredEvents.stream()
            .map(this::convertEventToResponseDTO)
            .toList();
    }

    public Event getEventById(String eventId) {
        return eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
    }

    public EventResponseDTO getEventByIdWithDetails(String eventId) {
        Event event = getEventById(eventId);
        return convertEventToResponseDTO(event);
    }

    @Transactional
    public Event createEvent(NewEventForm newEventForm, String creatorEmail) {
        if (eventRepository.findByTitle(newEventForm.title()).isPresent()) {
            throw new IllegalArgumentException("Evento com esse título já existe");
        }

        if (newEventForm.eventDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do evento não pode ser no passado");
        }

        var creator = userRepository.findUserByEmail(creatorEmail)
            .orElseThrow(() -> new IllegalArgumentException("Organizador não encontrado"));

        Category category = categoryRepository.findById(newEventForm.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        Event newEvent = new Event(
            newEventForm.title(),
            newEventForm.description(),
            newEventForm.eventDate(),
            creator,
            newEventForm.imageUrl(),
            category
        );

        Event savedEvent = eventRepository.save(newEvent);

        for (int i = 0; i < newEventForm.tickets().size(); i++) {
            var ticketSector = newEventForm.tickets().get(i);
            var ticketModelForm = new NewTicketModelForm(
                savedEvent.getId(),
                ticketSector.location(),
                ticketSector.price(),
                ticketSector.ticketsAvailable()
            );
            ticketModelService.createTicketModel(ticketModelForm);
        }

        return savedEvent;
    }

    public Event updateEvent(NewEventForm updatedEvent, String eventId) {
        var currentEvent = eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
        updateEventData(updatedEvent, currentEvent);
        return eventRepository.save(currentEvent);
    }

    @Transactional
    public void deleteEvent(String eventId) {
        var event = eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
        event.setActive(false);
        eventRepository.save(event);
    }

    @Transactional
    private void updateEventData(NewEventForm updatedEvent, Event currentEvent) {
        currentEvent.setTitle(updatedEvent.title());
        currentEvent.setDescription(updatedEvent.description());
        currentEvent.setEventDate(updatedEvent.eventDate());
        currentEvent.setImageUrl(updatedEvent.imageUrl());
        
        Category category = categoryRepository.findById(updatedEvent.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        currentEvent.setCategory(category);
    }
}

