package com.ffqts.arenape.domain.models.ticket;

import com.ffqts.arenape.domain.models.BaseEntity;
import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.models.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.UUID;

@Entity
@Table(name = "user_tickets")
public class UserTicket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @NotNull(message = "Usuário é obrigatório")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @NotNull(message = "Evento é obrigatório")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Modelo de ticket é obrigatório")
    private TicketModel ticketModel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    public UserTicket() {}

    public UserTicket(User user, TicketModel ticketModel, Event event) {
        this.user = user;
        this.event = event;
        this.ticketModel = ticketModel;
        this.status = TicketStatus.VALIDO;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public TicketModel getTicketModel() { return ticketModel; }
    public void setTicketModel(TicketModel ticketModel) { this.ticketModel = ticketModel; }
    public void setUser(User user) { this.user = user; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

}
