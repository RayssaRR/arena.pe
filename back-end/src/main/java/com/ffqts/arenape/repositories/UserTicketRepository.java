package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.ticket.UserTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserTicketRepository extends JpaRepository<UserTicket, UUID> {
    int countByEvent_Id(UUID eventId);
    int countByTicketModel_Id(UUID ticketModelId);
    List<UserTicket> findByEvent_Id(UUID eventId);
    Page<UserTicket> findByUser_Id(UUID userId, Pageable pageable);
    Page<UserTicket> findByUser_IdAndIsValid(UUID userId, boolean isValid, Pageable pageable);
}
