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

    @NotBlank(message = "Título não pode estar vazio")
    @Size(min = 3, max = 100, message = "Título deve ter entre 3 e 100 caracteres")
    private String title;

    @NotNull(message = "Localização do ticket é obrigatória")
    @Enumerated(EnumType.STRING)
    private TicketLocation ticketLocation;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que 0")
    private double price;

    @NotBlank(message = "Descrição não pode estar vazia")
    @Size(min = 5, max = 500, message = "Descrição deve ter entre 5 e 500 caracteres")
    private String description;

    @NotNull(message = "Quantidade de tickets é obrigatória")
    @Min(value = 1, message = "Deve haver pelo menos 1 ticket disponível")
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
