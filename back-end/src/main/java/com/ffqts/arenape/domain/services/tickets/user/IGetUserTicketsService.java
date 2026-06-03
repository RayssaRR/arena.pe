package com.ffqts.arenape.domain.services.tickets.user;

import com.ffqts.arenape.presentation.dto.ticket.ConsumeTicketResponseDTO;
import com.ffqts.arenape.presentation.dto.ticket.PagedUserTicketsDTO;
import com.ffqts.arenape.presentation.dto.ticket.UserTicketResponseDTO;

import java.util.UUID;

public interface IGetUserTicketsService {
    PagedUserTicketsDTO getUserTicketsPaginated(
        String userEmail,
        Integer page,
        Integer pageSize,
        String sortBy,
        String sortDirection,
        Boolean filterByValidity
    );

    UserTicketResponseDTO getByIdForUser(UUID ticketId, String userEmail);

    ConsumeTicketResponseDTO getByIdForAdmin(UUID ticketId);

    PagedUserTicketsDTO getByEventPaginated(
        String userEmail,
        String eventId,
        Integer page,
        Integer pageSize
    );
}
