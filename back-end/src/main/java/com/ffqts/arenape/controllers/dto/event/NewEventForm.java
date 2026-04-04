package com.ffqts.arenape.controllers.dto.event;

import com.ffqts.arenape.models.EventStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record NewEventForm(
    String title,
    String description,
    LocalDateTime eventDate,
    Integer capacity,
    EventStatus status,
    String imageUrl
//    Long categoryId
) {
}
