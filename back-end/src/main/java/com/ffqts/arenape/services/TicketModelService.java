package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.ticket.NewTicketModelForm;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.TicketModelRepository;

import jakarta.transaction.Transactional;

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

    @Transactional
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
            form.ticketLocation(),
            form.price(),
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

        return ticketModelRepository.findByExpiredFalseAndEvent_Id(eventId);
    }

    public List<TicketModel> getAllTicketModels() {
        return ticketModelRepository.findAll();
    }

    @Transactional
    public TicketModel updateTicketModel(UUID id, NewTicketModelForm form) {
        TicketModel ticketModel = getTicketModelById(id);

        if (ticketModel == null) {
            throw new IllegalArgumentException("Modelo de ticket não encontrado");
        }

        if (ticketModel.getPrice() == form.price()) {
            return ticketModel;
        }

        if (form.price() < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }

        if (form.ticketsAvailable() < 0) {
            throw new IllegalArgumentException("Quantidade de tickets não pode ser negativa");
        }

        if (ticketModel.getTicketsSold() == 0) {
          ticketModel.setPrice(form.price());
          return ticketModelRepository.save(ticketModel);
        }

        TicketModel newTicketModel = new TicketModel(
            ticketModel.getEvent(),
            form.ticketLocation(),
            form.price(),
            form.ticketsAvailable()
        );

        ticketModel.setExpired(true);

        ticketModelRepository.save(ticketModel);
        return ticketModelRepository.save(newTicketModel);
    }

    @Transactional
    public void deleteTicketModel(UUID id) {
        TicketModel ticketModel = getTicketModelById(id);
        ticketModel.setExpired(true);
        ticketModelRepository.save(ticketModel);
    }
}

