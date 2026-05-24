package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.user.User;
import com.ffqts.arenape.models.visit.Visit;
import com.ffqts.arenape.models.visit.VisitBooking;
import com.ffqts.arenape.models.visit.VisitBookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitBookingRepository extends JpaRepository<VisitBooking, Long> {

    int countByVisitAndStatus(Visit visit, VisitBookingStatus status);

    boolean existsByUserAndVisit(User user, Visit visit);
}