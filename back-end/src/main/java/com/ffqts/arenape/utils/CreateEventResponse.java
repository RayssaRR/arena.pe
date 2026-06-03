package com.ffqts.arenape.utils;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.infra.repositories.TicketModelRepository;
import com.ffqts.arenape.infra.repositories.UserTicketRepository;
import com.ffqts.arenape.presentation.dto.event.EventResponseDTO;
import com.ffqts.arenape.presentation.dto.event.TicketSectorDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CreateEventResponse {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private UserTicketRepository userTicketRepository;

    public EventResponseDTO create(Event event) {
        List<TicketModel> ticketModels = ticketModelRepository.findByExpiredFalseAndEvent_Id(event.getId());
        int totalCapacity = ticketModels.stream()
            .mapToInt(TicketModel::getTicketsAvailable)
            .sum();

        int totalTicketsSold = userTicketRepository.countByEvent_Id(event.getId());

        List<TicketSectorDTO> sectors = ticketModels.stream()
            .map(tm -> new TicketSectorDTO(
            tm.getId().toString(),
            tm.getTicketLocation(),
            tm.getPrice(),
            tm.getTicketsAvailable(),
            tm.getTicketsSold()
            ))
            .toList();

        return new EventResponseDTO(
            event.getId().toString(),
            event.getTitle(),
            event.getDescription(),
            event.getEventDate(),
            totalCapacity,
            totalTicketsSold,
            event.getStatus(),
            event.isActive(),
            event.getImageUrl(),
            event.getCategory(),
            sectors
        );
    }

}
