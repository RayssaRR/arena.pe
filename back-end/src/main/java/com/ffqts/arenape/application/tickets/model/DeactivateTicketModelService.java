package com.ffqts.arenape.application.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.IDeactivateTicketModel;
import com.ffqts.arenape.infra.repositories.TicketModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeactivateTicketModelService implements IDeactivateTicketModel {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Override
    public void deactivate(UUID id) {
        TicketModel ticketModel = ticketModelRepository.findById(id).orElseThrow();
        ticketModel.setExpired(true);
        ticketModelRepository.save(ticketModel);
    }

}
