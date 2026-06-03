package com.ffqts.arenape.domain.services.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;

public interface ICreateTicketModel {
    TicketModel create(NewTicketModelForm form);
}
