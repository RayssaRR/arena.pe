package com.ffqts.arenape.controllers.dto.event;

import com.ffqts.arenape.models.event.Category;
import com.ffqts.arenape.models.event.EventStatus;

import java.time.LocalDateTime;

public record UserEventResponseDTO(
    String id,
    String title,
    String description,
    Category category,
    LocalDateTime eventDate,
    EventStatus status,
    String imageUrl
) {}
