package com.ffqts.arenape.models.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ffqts.arenape.models.BaseEntity;
import com.ffqts.arenape.models.user.User;
import com.ffqts.arenape.models.ticket.UserTicket;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

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

    private String title;
    private String description;
    private LocalDateTime eventDate;
    private Integer capacity;
    private EventStatus status;
    private String imageUrl;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
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
        Integer capacity,
        User creator,
        String imageUrl,
        Category category
    ) {
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.capacity = capacity;
        this.status = EventStatus.UPCOMING;
        this.creator = creator;
        this.imageUrl = imageUrl;
        this.category = category;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
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
