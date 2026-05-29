package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.event.PagedUserEventsDTO;
import com.ffqts.arenape.controllers.dto.reservation.NewReservationForm;
import com.ffqts.arenape.controllers.dto.ticket.PagedUserTicketsDTO;
import com.ffqts.arenape.controllers.dto.ticket.TicketCancellationResponseDTO;
import com.ffqts.arenape.controllers.utils.GetEmailFromTokenRequest;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.models.ticket.TicketStatus;
import com.ffqts.arenape.services.ReservationService;
import com.ffqts.arenape.services.TicketCancellationService;
import com.ffqts.arenape.services.UserTicketService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private TicketCancellationService ticketCancellationService;

    @Autowired
    private UserTicketService userTicketService;

    @PostMapping
    public ResponseEntity<TicketModel> createReservation(
        @RequestBody NewReservationForm form,
        HttpServletRequest req
    ) {
        var email = GetEmailFromTokenRequest.get(req);
        reservationService.assignTickets(form, email);
        return ResponseEntity.status(201).build();
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<?> cancelTicket(
        @PathVariable String ticketId,
        HttpServletRequest req
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            ticketCancellationService.cancelTicket(UUID.fromString(ticketId), email);
            return ResponseEntity.ok(new TicketCancellationResponseDTO(
                "Ticket cancelado com sucesso",
                ticketId,
                "CANCELED"
            ));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("permissão")) {
                return ResponseEntity.status(403).body(new TicketCancellationResponseDTO(
                    e.getMessage(),
                    ticketId,
                    "FORBIDDEN"
                ));
            }
            return ResponseEntity.badRequest().body(new TicketCancellationResponseDTO(
                e.getMessage(),
                ticketId,
                "ERROR"
            ));
        }
    }

    @GetMapping
    public ResponseEntity<PagedUserTicketsDTO> getUserTickets(
        HttpServletRequest req,
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer pageSize,
        @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
        @RequestParam(required = false, defaultValue = "desc") String sortDirection,
        @RequestParam(required = false) Boolean filterByValidity
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            PagedUserTicketsDTO result = userTicketService.getUserTickets(
                email,
                page,
                pageSize,
                sortBy,
                sortDirection,
                filterByValidity
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getTicketById(
        @PathVariable String ticketId,
        HttpServletRequest req
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            var ticket = userTicketService.getTicketById(UUID.fromString(ticketId), email);
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("permissão")) {
                return ResponseEntity.status(403).body(new TicketCancellationResponseDTO(
                    e.getMessage(),
                    ticketId,
                    "FORBIDDEN"
                ));
            }
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/events/purchased")
    public ResponseEntity<PagedUserEventsDTO> getUserPurchasedEvents(
        HttpServletRequest req,
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer pageSize
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            PagedUserEventsDTO result = userTicketService.getUserPurchasedEvents(
                email,
                page,
                pageSize
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/events/{eventId}/tickets")
    public ResponseEntity<PagedUserTicketsDTO> getUserTicketsByEvent(
        @PathVariable String eventId,
        HttpServletRequest req,
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer pageSize
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            PagedUserTicketsDTO result = userTicketService.getUserTicketsByEvent(
                email,
                eventId,
                page,
                pageSize
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/tickets/{ticketId}/consume")
    public ResponseEntity<?> consumeTicket(@PathVariable String ticketId) {
        var userTicket = reservationService.consumeTicket(ticketId);
        boolean isValid = userTicket.getStatus() == TicketStatus.RESGATADO;
        return ResponseEntity.ok(isValid);
    }


}