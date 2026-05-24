package com.ffqts.arenape.models.ticket;

import com.ffqts.arenape.models.BaseEntity;
import com.ffqts.arenape.models.event.Event;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "ticket_models")
public class TicketModel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Event event;
    private String title;

    @Enumerated(EnumType.STRING)
    private TicketLocation ticketLocation;

    private double price;
    private String description;
    private int ticketsAvailable;

    public TicketModel() {}
    public TicketModel(Event event, String title, TicketLocation ticketLocation, double price, String description,
                       int ticketsAvailable) {
        this.event = event;
        this.title = title;
        this.ticketLocation = ticketLocation;
        this.price = price;
        this.description = description;
        this.ticketsAvailable = ticketsAvailable;
    }

    public UUID getId() {
        return id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public TicketLocation getTicketLocation() {
        return ticketLocation;
    }

    public void setTicketLocation(TicketLocation ticketLocation) {
        this.ticketLocation = ticketLocation;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getTicketsAvailable() {
        return ticketsAvailable;
    }

    public void setTicketsAvailable(int ticketsAvailable) {
        this.ticketsAvailable = ticketsAvailable;
    }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }
}
