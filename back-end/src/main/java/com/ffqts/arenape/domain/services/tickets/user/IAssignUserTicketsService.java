package com.ffqts.arenape.domain.services.tickets.user;

import java.util.UUID;

public interface IAssignUserTicketsService {
    void assign(UUID ticketModelId, Integer quantity, String userEmail);
}
