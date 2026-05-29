package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.reservation.NewReservationForm;
import com.ffqts.arenape.models.event.EventStatus;
import com.ffqts.arenape.models.ticket.TicketStatus;
import com.ffqts.arenape.models.ticket.UserTicket;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.TicketModelRepository;
import com.ffqts.arenape.repositories.UserRepository;
import com.ffqts.arenape.repositories.UserTicketRepository;
import jakarta.transaction.Transactional;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void assignTickets(NewReservationForm form, String userEmail) {

        var user = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        var ticketModel = ticketModelRepository.findById(form.ticketModelId())
                .orElseThrow(() -> new IllegalArgumentException("Modelo de ingresso não encontrado"));

        var event = eventRepository.findById(ticketModel.getEvent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new IllegalArgumentException("Reservas só podem ser feitas para eventos com status UPCOMING");
        }

        if (form.quantity() <= 0) {
            throw new IllegalArgumentException("A quantidade de ingressos deve ser maior que zero");
        }

        int disponivel = ticketModel.getTicketsAvailable() - userTicketRepository.countByTicketModel_Id(ticketModel.getId());
        if (form.quantity() > disponivel) {
            throw new IllegalArgumentException(
                    "Quantidade solicitada (" + form.quantity() + ") excede as vagas disponíveis (" + disponivel + ")"
            );
        }

        for (int i = 0; i < form.quantity(); i++) {
            var userTicket = new UserTicket(user, ticketModel, event);
            userTicketRepository.save(userTicket);

            ticketModel.setTicketsSold(ticketModel.getTicketsSold() + 1);
            ticketModelRepository.save(ticketModel);
        }

    }

    public UserTicket consumeTicket(String ticketId) {
        var userTicket = userTicketRepository.findById(UUID.fromString(ticketId))
                .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));

        if (userTicket.getStatus() != TicketStatus.VALIDO) {
            throw new IllegalArgumentException("Ticket inválido ou já consumido");
        }

        userTicket.setStatus(TicketStatus.RESGATADO);
        return userTicketRepository.save(userTicket);
    }
}
