package com.ffqts.arenape.controllers.dto.event;

import com.ffqts.arenape.models.event.Category;
import com.ffqts.arenape.models.event.EventStatus;

import java.time.LocalDateTime;
import java.util.List;

public record EventResponseDTO(
    String id,
    String title,
    String description,
    LocalDateTime eventDate,
    int capacity,
    int ticketsSold,
    EventStatus status,
    String imageUrl,
    Category category,
    List<TicketSectorDTO> ticketSectors
) {}
