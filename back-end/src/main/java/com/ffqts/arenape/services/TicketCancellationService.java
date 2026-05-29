package com.ffqts.arenape.services;

import com.ffqts.arenape.models.ticket.UserTicket;
import com.ffqts.arenape.models.ticket.TicketStatus;
import com.ffqts.arenape.models.user.Role;
import com.ffqts.arenape.models.user.User;
import com.ffqts.arenape.repositories.UserRepository;
import com.ffqts.arenape.repositories.UserTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TicketCancellationService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private UserRepository userRepository;

    public void cancelTicket(UUID ticketId, String requesterEmail) {
        UserTicket ticket = userTicketRepository.findById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));

        User requester = userRepository.findUserByEmail(requesterEmail)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        boolean isOwner = ticket.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Você não tem permissão para cancelar este ticket");
        }

        ticket.setStatus(TicketStatus.CANCELADO);
        userTicketRepository.save(ticket);
    }

    public boolean isTicketValid(UUID ticketId) {
        return userTicketRepository.findById(ticketId)
            .map(ticket -> ticket.getStatus() == TicketStatus.VALIDO)
            .orElse(false);
    }
}
