package com.ffqts.arenape.application.tickets.model;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.ICreateTicketModel;
import com.ffqts.arenape.infra.repositories.EventRepository;
import com.ffqts.arenape.infra.repositories.TicketModelRepository;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateTicketModelService implements ICreateTicketModel {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    @Transactional
    public TicketModel create(NewTicketModelForm form) {
        Event event = eventRepository.findById(form.eventId())
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        if (form.price() < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
        }

        TicketModel ticketModel = new TicketModel(
            event,
            form.ticketLocation(),
            form.price(),
            form.ticketsAvailable()
        );

        return ticketModelRepository.save(ticketModel);
    }

}
