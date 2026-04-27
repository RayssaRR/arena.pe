package com.ffqts.arenape.controllers;

import com.ffqts.arenape.config.JwtUtil;
import com.ffqts.arenape.controllers.dto.reservation.NewReservationForm;
import com.ffqts.arenape.models.Reservation;
import com.ffqts.arenape.services.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @RequestBody NewReservationForm form,
            HttpServletRequest req
    ) {
        var email = getEmailFromTokenRequest(req);
        var reservation = reservationService.createReservation(form, email);
        return ResponseEntity.status(201).body(reservation);
    }

    private String getEmailFromTokenRequest(HttpServletRequest req) {
        String token = req.getHeader("Authorization");
        String actualToken = token.replace("Bearer ", "");
        return JwtUtil.validate(actualToken);
    }
}