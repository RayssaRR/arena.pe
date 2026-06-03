package com.ffqts.arenape.domain.services.tickets.user;

import java.util.UUID;

public interface ICancelUserTicketService {
    void cancel(UUID ticketId, String requesterEmail);
}
