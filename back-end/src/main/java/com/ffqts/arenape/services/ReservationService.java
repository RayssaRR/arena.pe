package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.reservation.NewReservationForm;
import com.ffqts.arenape.models.EventStatus;
import com.ffqts.arenape.models.Reservation;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.ReservationRepository;
import com.ffqts.arenape.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Reservation createReservation(NewReservationForm form, String userEmail) {

        var user = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        var event = eventRepository.findById(form.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new IllegalArgumentException("Reservas só podem ser feitas para eventos com status UPCOMING");
        }

        if (form.quantity() <= 0) {
            throw new IllegalArgumentException("A quantidade de ingressos deve ser maior que zero");
        }


        int disponivel = event.getCapacity() - event.getTicketsSold();
        if (form.quantity() > disponivel) {
            throw new IllegalArgumentException(
                    "Quantidade solicitada (" + form.quantity() + ") excede as vagas disponíveis (" + disponivel + ")"
            );
        }

        event.setTicketsSold(event.getTicketsSold() + form.quantity());
        eventRepository.save(event);

        var reservation = new Reservation(event, user, form.quantity());
        return reservationRepository.save(reservation);
    }
}
