package com.ffqts.arenape.domain.services.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;

import java.util.UUID;

public interface IUpdateTicketModel {
    TicketModel update(UUID id, NewTicketModelForm form);
}
