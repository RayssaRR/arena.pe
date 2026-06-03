package com.ffqts.arenape.presentation.dto.event;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.models.event.EventStatus;

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
