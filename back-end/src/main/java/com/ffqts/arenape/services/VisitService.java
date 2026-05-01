package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.visit.NewVisitForm;
import com.ffqts.arenape.models.Shift;
import com.ffqts.arenape.models.Visit;
import com.ffqts.arenape.models.VisitBookingStatus;
import com.ffqts.arenape.repositories.VisitBookingRepository;
import com.ffqts.arenape.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VisitService {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private VisitBookingRepository visitBookingRepository;

    public Visit createVisit(NewVisitForm newVisitForm) {
        var visit = new Visit();
        visit.setDate(newVisitForm.date());
        visit.setShift(parseShift(newVisitForm.shift()));
        visit.setMaxVisitors(newVisitForm.maxVisitors());
        return visitRepository.save(visit);
    }

    public Visit updateVisit(Long id, NewVisitForm updatedVisitForm) {
        var visit = visitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visit não encontrada"));

        int confirmedBookings = visitBookingRepository.countByVisitAndStatus(visit, VisitBookingStatus.CONFIRMED);
        if (updatedVisitForm.maxVisitors() < confirmedBookings) {
            throw new IllegalArgumentException("maxVisitors não pode ser menor que o número de reservas confirmadas");
        }
        visit.setDate(updatedVisitForm.date());
        visit.setShift(parseShift(updatedVisitForm.shift()));
        visit.setMaxVisitors(updatedVisitForm.maxVisitors());
        return visitRepository.save(visit);
    }

    public void deleteVisit(Long id) {
        if (!visitRepository.existsById(id)) {
            throw new IllegalArgumentException("Visit não encontrada");
        }

        visitRepository.deleteById(id);
    }

    private Shift parseShift(String shift) {
        try {
            return Shift.valueOf(shift.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Shift inválido. Use MORNING ou AFTERNOON");
        }
    }


}
