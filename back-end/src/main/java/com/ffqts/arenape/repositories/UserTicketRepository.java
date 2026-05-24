package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.ticket.UserTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserTicketRepository extends JpaRepository<UserTicket, UUID> {
    int countByEvent_Id(UUID eventId);
    int countByTicketModel_Id(UUID ticketModelId);
}
