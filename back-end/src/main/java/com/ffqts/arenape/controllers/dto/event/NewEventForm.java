package com.ffqts.arenape.controllers.dto.event;

import com.ffqts.arenape.models.event.EventStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record NewEventForm(
    @NotBlank(message = "Titulo não pode ficar em branco")
    String title,

    @NotBlank(message = "Descricao não pode ficar em branco")
    String description,

    @NotBlank(message = "Data não pode ficar em branco")
    LocalDateTime eventDate,

    @Positive(message = "Capacidade deve ser maior que 0")
    Integer capacity,

    @NotBlank(message = "Url da imagem não pode ficar em branco")
    String imageUrl,

    @PositiveOrZero(message = "Id da categoria deve ser um número positivo ou zero")
    Long categoryId
) {
}
