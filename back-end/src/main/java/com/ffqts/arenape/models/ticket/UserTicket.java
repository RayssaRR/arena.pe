package com.ffqts.arenape.models.ticket;

import com.ffqts.arenape.models.BaseEntity;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.user.User;
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

    private boolean isValid;

    public UserTicket() {}

    public UserTicket(User user, TicketModel ticketModel, Event event) {
        this.user = user;
        this.event = event;
        this.ticketModel = ticketModel;
        this.isValid = true;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public TicketModel getTicketModel() { return ticketModel; }
    public void setTicketModel(TicketModel ticketModel) { this.ticketModel = ticketModel; }
    public void setUser(User user) { this.user = user; }
    public boolean getIsValid() { return isValid; }
    public void setIsValid(boolean isValid) { this.isValid = isValid; }

}
