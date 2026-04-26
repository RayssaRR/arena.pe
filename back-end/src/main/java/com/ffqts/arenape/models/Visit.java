package com.ffqts.arenape.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "visits")
public class Visit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    private int maxVisitors;

    private int currentBookings;

    @JsonIgnore
    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitBooking> bookings = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public int getMaxVisitors() {
        return maxVisitors;
    }

    public void setMaxVisitors(int maxVisitors) {
        this.maxVisitors = maxVisitors;
    }

    public int getCurrentBookings() {
        return currentBookings;
    }

    public void setCurrentBookings(int currentBookings) {
        this.currentBookings = currentBookings;
    }

    public List<VisitBooking> getBookings() {
        return bookings;
    }

    public void setBookings(List<VisitBooking> bookings) {
        this.bookings = bookings;
    }

}
