package com.ffqts.arenape.models.ticket;

import com.ffqts.arenape.models.BaseEntity;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.user.User;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "user_tickets")
public class UserTicket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    private TicketModel ticketModel;

    public UserTicket() {}

    public UserTicket(User user, TicketModel ticketModel, Event event) {
        this.user = user;
        this.event = event;
        this.ticketModel = ticketModel;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public TicketModel getTicketModel() { return ticketModel; }
    public void setTicketModel(TicketModel ticketModel) { this.ticketModel = ticketModel; }
    public void setUser(User user) { this.user = user; }

}
