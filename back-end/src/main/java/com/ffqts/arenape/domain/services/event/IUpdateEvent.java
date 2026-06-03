package com.ffqts.arenape.domain.services.event;

import com.ffqts.arenape.domain.models.event.Event;

import java.time.LocalDateTime;

public interface IUpdateEvent {
    Event update(
        String title,
        String description,
        LocalDateTime eventDate,
        String imageUrl,
        Long categoryId,
        String eventId
    );
}
