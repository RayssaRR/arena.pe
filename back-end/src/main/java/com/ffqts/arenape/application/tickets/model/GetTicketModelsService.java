package com.ffqts.arenape.application.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.IGetTicketModels;
import com.ffqts.arenape.infra.repositories.EventRepository;
import com.ffqts.arenape.infra.repositories.TicketModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GetTicketModelsService implements IGetTicketModels {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public TicketModel getById(UUID id) {
        return ticketModelRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Modelo de ticket não encontrado"));
    }

    @Override
    public List<TicketModel> getByEventId(UUID eventId) {
        eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        return ticketModelRepository.findByExpiredFalseAndEvent_Id(eventId);
    }

    @Override
    public List<TicketModel> getAll() {
        return ticketModelRepository.findAll();
    }

}
