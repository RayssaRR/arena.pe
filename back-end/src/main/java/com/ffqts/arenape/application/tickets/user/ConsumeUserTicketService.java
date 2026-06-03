package com.ffqts.arenape.application.tickets.user;

import com.ffqts.arenape.domain.models.ticket.TicketStatus;
import com.ffqts.arenape.domain.models.ticket.UserTicket;
import com.ffqts.arenape.domain.services.tickets.user.IConsumeUserTicketService;
import com.ffqts.arenape.infra.repositories.UserTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ConsumeUserTicketService implements IConsumeUserTicketService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Override
    public UserTicket consume(String ticketId) {
        var userTicket = userTicketRepository.findById(UUID.fromString(ticketId))
            .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));

        if (userTicket.getStatus() != TicketStatus.VALIDO) {
            throw new IllegalArgumentException("Ticket inválido ou já consumido");
        }

        userTicket.setStatus(TicketStatus.RESGATADO);
        return userTicketRepository.save(userTicket);
    }

}
