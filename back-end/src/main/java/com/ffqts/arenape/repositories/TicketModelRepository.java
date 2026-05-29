package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.ticket.TicketModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketModelRepository extends JpaRepository<TicketModel, UUID> {
    List<TicketModel> findByEvent_Id(UUID eventId);
    List<TicketModel> findByExpiredFalseAndEvent_Id(UUID eventId);
}
