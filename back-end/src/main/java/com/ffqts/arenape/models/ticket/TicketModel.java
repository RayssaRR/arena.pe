package com.ffqts.arenape.models.ticket;

import com.ffqts.arenape.models.BaseEntity;
import com.ffqts.arenape.models.event.Event;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.UUID;

@Entity
@Table(name = "ticket_models")
public class TicketModel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @NotNull(message = "Event é obrigatório")
    private Event event;

    @NotNull(message = "Localização do ticket é obrigatória")
    @Enumerated(EnumType.STRING)
    private TicketLocation ticketLocation;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que 0")
    private double price;

    @NotNull(message = "Quantidade de tickets é obrigatória")
    @Min(value = 1, message = "Deve haver pelo menos 1 ticket disponível")
    private int ticketsAvailable;

    public TicketModel() {}
    public TicketModel(Event event, TicketLocation ticketLocation, double price, int ticketsAvailable) {
        this.event = event;
        this.ticketLocation = ticketLocation;
        this.price = price;
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

    public int getTicketsAvailable() {
        return ticketsAvailable;
    }

    public void setTicketsAvailable(int ticketsAvailable) {
        this.ticketsAvailable = ticketsAvailable;
    }
}
