package com.ffqts.arenape.controllers.dto.visit;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record NewVisitForm(
    @NotNull LocalDateTime date,
    @NotNull String shift,
    @Positive int maxVisitors
) {
}
