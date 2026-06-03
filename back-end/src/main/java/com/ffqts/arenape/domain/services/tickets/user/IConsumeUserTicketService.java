package com.ffqts.arenape.domain.services.tickets.user;

import com.ffqts.arenape.domain.models.ticket.UserTicket;

public interface IConsumeUserTicketService {
    UserTicket consume(String ticketId);
}
