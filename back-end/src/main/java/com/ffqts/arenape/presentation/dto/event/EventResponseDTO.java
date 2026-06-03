package com.ffqts.arenape.presentation.dto.event;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.models.event.EventStatus;

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
    boolean isActive,
    String imageUrl,
    Category category,
    List<TicketSectorDTO> ticketSectors
) {}
