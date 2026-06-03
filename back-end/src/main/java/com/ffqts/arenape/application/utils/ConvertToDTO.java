package com.ffqts.arenape.application.utils;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.models.ticket.UserTicket;
import com.ffqts.arenape.presentation.dto.event.UserEventResponseDTO;
import com.ffqts.arenape.presentation.dto.ticket.UserTicketResponseDTO;

public class ConvertToDTO {

    public static UserTicketResponseDTO userTicketToDTO(UserTicket ticket) {
        return new UserTicketResponseDTO(
            ticket.getId().toString(),
            ticket.getEvent().getTitle(),
            ticket.getEvent().getId().toString(),
            ticket.getEvent().getEventDate(),
            ticket.getEvent().getStatus(),
            ticket.getTicketModel().getPrice(),
            ticket.getTicketModel().getTicketLocation().toString(),
            ticket.getStatus(),
            ticket.getCreatedAt()
        );
    }

    public static UserEventResponseDTO eventToDTO(Event event) {
        return new UserEventResponseDTO(
        event.getId().toString(),
        event.getTitle(),
        event.getDescription(),
        event.getCategory(),
        event.getEventDate(),
        event.getStatus(),
        event.getImageUrl()
        );
    }
}
