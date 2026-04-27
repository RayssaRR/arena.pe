package com.ffqts.arenape.services;

import com.ffqts.arenape.models.*;
import com.ffqts.arenape.repositories.VisitBookingRepository;
import com.ffqts.arenape.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class VisitBookingService {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private VisitBookingRepository bookingRepository;

    @Transactional
    public VisitBooking book(Long visitId, User user) {

        var visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new IllegalArgumentException("Visit not found"));

        int total = bookingRepository.countByVisitAndStatus(
                visit,
                VisitBookingStatus.CONFIRMED
        );

        if (total >= visit.getMaxVisitors()) {
            throw new IllegalArgumentException("Visit is full");
        }

        boolean alreadyBooked = bookingRepository.existsByUserAndVisit(user, visit);

        if (alreadyBooked) {
            throw new IllegalArgumentException("User already booked this visit");
        }

        VisitBooking booking = new VisitBooking();
        booking.setUser(user);
        booking.setVisit(visit);
        booking.setStatus(VisitBookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }
}