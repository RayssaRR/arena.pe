package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.reservation.NewReservationForm;
import com.ffqts.arenape.controllers.utils.GetEmailFromTokenRequest;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.services.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<TicketModel> createReservation(
        @RequestBody NewReservationForm form,
        HttpServletRequest req
    ) {
        var email = GetEmailFromTokenRequest.get(req);
        reservationService.assignTickets(form, email);
        return ResponseEntity.status(201).build();
    }
}