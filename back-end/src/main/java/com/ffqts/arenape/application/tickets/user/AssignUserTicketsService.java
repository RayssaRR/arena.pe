package com.ffqts.arenape.application.tickets.user;

import com.ffqts.arenape.domain.models.event.EventStatus;
import com.ffqts.arenape.domain.models.ticket.UserTicket;
import com.ffqts.arenape.domain.services.tickets.user.IAssignUserTicketsService;
import com.ffqts.arenape.infra.repositories.EventRepository;
import com.ffqts.arenape.infra.repositories.TicketModelRepository;
import com.ffqts.arenape.infra.repositories.UserRepository;
import com.ffqts.arenape.infra.repositories.UserTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AssignUserTicketsService implements IAssignUserTicketsService {

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void assign(UUID ticketModelId, Integer quantity, String userEmail) {
        var user = userRepository.findUserByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        var ticketModel = ticketModelRepository.findById(ticketModelId)
            .orElseThrow(() -> new IllegalArgumentException("Modelo de ingresso não encontrado"));

        var event = eventRepository.findById(ticketModel.getEvent().getId())
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new IllegalArgumentException("Reservas só podem ser feitas para eventos com status UPCOMING");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("A quantidade de ingressos deve ser maior que zero");
        }

        int disponivel = ticketModel.getTicketsAvailable() - userTicketRepository.countByTicketModel_Id(ticketModel.getId());
        if (quantity > disponivel) {
            throw new IllegalArgumentException(
            "Quantidade solicitada (" + quantity + ") excede as vagas disponíveis (" + disponivel + ")"
            );
        }

        for (int i = 0; i < quantity; i++) {
            var userTicket = new UserTicket(user, ticketModel, event);
            userTicketRepository.save(userTicket);

            ticketModel.setTicketsSold(ticketModel.getTicketsSold() + 1);
            ticketModelRepository.save(ticketModel);
        }
    }

}
