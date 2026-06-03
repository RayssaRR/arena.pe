package com.ffqts.arenape.application.tickets.user;

import com.ffqts.arenape.domain.models.ticket.TicketStatus;
import com.ffqts.arenape.domain.models.ticket.UserTicket;
import com.ffqts.arenape.domain.models.user.Role;
import com.ffqts.arenape.domain.models.user.User;
import com.ffqts.arenape.domain.services.tickets.user.ICancelUserTicketService;
import com.ffqts.arenape.infra.repositories.UserRepository;
import com.ffqts.arenape.infra.repositories.UserTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CancelUserTicketService implements ICancelUserTicketService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void cancel(UUID ticketId, String requesterEmail) {
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

}
