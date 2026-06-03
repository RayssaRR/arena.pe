package com.ffqts.arenape.domain.services.event;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.presentation.dto.event.NewTicketSector;

import java.time.LocalDateTime;
import java.util.List;

public interface ICreateEvent {
    Event create(
        String title,
        String description,
        LocalDateTime eventDate,
        String imageUrl,
        Long categoryId,
        List<NewTicketSector> tickets,
        String creatorEmail
    );
}
