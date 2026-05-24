package com.ffqts.arenape.models.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ffqts.arenape.models.BaseEntity;
import com.ffqts.arenape.models.user.User;
import com.ffqts.arenape.models.ticket.UserTicket;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @NotBlank(message = "Título é obrigatório")
    @Size(min = 3, max = 150, message = "Título deve ter entre 3 e 150 caracteres")
    private String title;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 10, max = 1000, message = "Descrição deve ter entre 10 e 1000 caracteres")
    private String description;

    @NotNull(message = "Data do evento é obrigatória")
    @Future(message = "Data do evento deve ser no futuro")
    private LocalDateTime eventDate;

    @NotNull(message = "Status é obrigatório")
    private EventStatus status;

    @NotBlank(message = "URL da imagem é obrigatória")
    @Size(min = 5, max = 500, message = "URL da imagem deve ter entre 5 e 500 caracteres")
    private String imageUrl;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Criador do evento é obrigatório")
    private User creator;

    @ManyToOne
    @Nullable
    private Category category;

    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserTicket> userTickets = new ArrayList<>();

    public Event() {
    }

    public Event(
        String title,
        String description,
        LocalDateTime eventDate,
        User creator,
        String imageUrl,
        Category category
    ) {
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.creator = creator;
        this.imageUrl = imageUrl;
        this.category = category;
        this.status = EventStatus.UPCOMING;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getCreator() {
        return creator;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<UserTicket> getUserTickets() {
        return userTickets;
    }

    public void setUserTickets(List<UserTicket> userTickets) {
        this.userTickets = userTickets;
    }
}
