package com.ffqts.arenape.domain.services.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;

import java.util.List;
import java.util.UUID;

public interface IGetTicketModels {
    TicketModel getById(UUID id);
    List<TicketModel> getByEventId(UUID eventId);
    List<TicketModel> getAll();
}
