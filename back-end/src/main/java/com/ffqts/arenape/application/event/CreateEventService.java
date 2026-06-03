package com.ffqts.arenape.application.event;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.services.event.ICreateEvent;
import com.ffqts.arenape.domain.services.tickets.model.ICreateTicketModel;
import com.ffqts.arenape.infra.repositories.CategoryRepository;
import com.ffqts.arenape.infra.repositories.EventRepository;
import com.ffqts.arenape.infra.repositories.UserRepository;
import com.ffqts.arenape.presentation.dto.event.NewTicketSector;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CreateEventService implements ICreateEvent {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ICreateTicketModel createTicketModelService;

    @Override
    public Event create(String title, String description, LocalDateTime eventDate, String imageUrl, Long categoryId, List<NewTicketSector> tickets, String creatorEmail) {
        if (eventRepository.findByTitle(title).isPresent()) {
            throw new IllegalArgumentException("Evento com esse título já existe");
        }

        if (eventDate.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do evento não pode ser no passado");
        }

        var creator = userRepository.findUserByEmail(creatorEmail)
            .orElseThrow(() -> new IllegalArgumentException("Organizador não encontrado"));

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        Event newEvent = new Event(
            title,
            description,
            eventDate,
            creator,
            imageUrl,
            category
        );

        Event savedEvent = eventRepository.save(newEvent);

        for (NewTicketSector ticketSector : tickets) {
            var ticketModelForm = new NewTicketModelForm(
            savedEvent.getId(),
            ticketSector.location(),
            ticketSector.price(),
            ticketSector.ticketsAvailable()
            );
            createTicketModelService.create(ticketModelForm);
        }

        return savedEvent;
    }
}
