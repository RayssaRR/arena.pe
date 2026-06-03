package com.ffqts.arenape.application.event;

import com.ffqts.arenape.domain.services.event.IDeleteEvent;
import com.ffqts.arenape.infra.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteEventService implements IDeleteEvent {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public void delete(String eventId) {
        var event = eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
        event.setActive(false);
        eventRepository.save(event);
    }

}
