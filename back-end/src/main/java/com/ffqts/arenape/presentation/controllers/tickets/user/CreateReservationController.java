package com.ffqts.arenape.presentation.controllers.tickets.user;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.user.IAssignUserTicketsService;
import com.ffqts.arenape.presentation.dto.reservation.NewReservationForm;
import com.ffqts.arenape.presentation.utils.GetEmailFromTokenRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/ticket")
public class CreateReservationController {

    @Autowired
    private IAssignUserTicketsService service;

    @PostMapping
    public ResponseEntity<TicketModel> createReservation(@RequestBody NewReservationForm form, HttpServletRequest req) {
        var email = GetEmailFromTokenRequest.get(req);
        service.assign(form.ticketModelId(), form.quantity(), email);
        return ResponseEntity.status(201).build();
    }

}
