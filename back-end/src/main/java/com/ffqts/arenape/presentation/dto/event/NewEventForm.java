package com.ffqts.arenape.presentation.dto.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;
import java.util.List;

public record NewEventForm(
    @NotBlank(message = "Titulo não pode ficar em branco")
    String title,

    @NotBlank(message = "Descricao não pode ficar em branco")
    String description,

    @NotBlank(message = "Data não pode ficar em branco")
    LocalDateTime eventDate,

    String imageUrl,

    @PositiveOrZero(message = "Id da categoria deve ser um número positivo ou zero")
    Long categoryId,

    List<NewTicketSector> tickets
) {
}
