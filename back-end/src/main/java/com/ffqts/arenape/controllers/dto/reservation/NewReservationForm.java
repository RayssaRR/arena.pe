package com.ffqts.arenape.controllers.dto.reservation;

import java.util.UUID;

public record NewReservationForm(
        UUID eventId,
        Integer quantity
) {}
