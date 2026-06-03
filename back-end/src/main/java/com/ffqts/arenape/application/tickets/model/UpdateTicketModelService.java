package com.ffqts.arenape.application.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.IUpdateTicketModel;
import com.ffqts.arenape.infra.repositories.TicketModelRepository;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateTicketModelService implements IUpdateTicketModel {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Override
    public TicketModel update(UUID id, NewTicketModelForm form) {
        TicketModel ticketModel = ticketModelRepository.getReferenceById(id);

        if (ticketModel.getPrice() == form.price()) {
            return ticketModel;
        }

        if (form.price() < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo");
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

}
