package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.ticket.NewTicketModelForm;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.TicketModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TicketModelService {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private EventRepository eventRepository;

    public TicketModel createTicketModel(NewTicketModelForm form) {
        Event event = eventRepository.findById(form.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        if (form.price() < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }

        if (form.ticketsAvailable() < 0) {
            throw new IllegalArgumentException("Quantidade de tickets não pode ser negativa");
        }

        TicketModel ticketModel = new TicketModel(
            event,
            form.title(),
            form.ticketLocation(),
            form.price(),
            form.description(),
            form.ticketsAvailable()
        );

        return ticketModelRepository.save(ticketModel);
    }

    public TicketModel getTicketModelById(UUID id) {
        return ticketModelRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Modelo de ticket não encontrado"));
    }

    public List<TicketModel> getTicketModelsByEventId(UUID eventId) {
        eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        return ticketModelRepository.findByEvent_Id(eventId);
    }

    public List<TicketModel> getAllTicketModels() {
        return ticketModelRepository.findAll();
    }

    public TicketModel updateTicketModel(UUID id, NewTicketModelForm form) {
        TicketModel ticketModel = getTicketModelById(id);

        if (form.price() < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }

        if (form.ticketsAvailable() < 0) {
            throw new IllegalArgumentException("Quantidade de tickets não pode ser negativa");
        }

        Event event = eventRepository.findById(form.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        ticketModel.setEvent(event);
        ticketModel.setTitle(form.title());
        ticketModel.setTicketLocation(form.ticketLocation());
        ticketModel.setPrice(form.price());
        ticketModel.setDescription(form.description());
        ticketModel.setTicketsAvailable(form.ticketsAvailable());

        return ticketModelRepository.save(ticketModel);
    }

    public void deleteTicketModel(UUID id) {
        TicketModel ticketModel = getTicketModelById(id);
        ticketModelRepository.delete(ticketModel);
    }
}

