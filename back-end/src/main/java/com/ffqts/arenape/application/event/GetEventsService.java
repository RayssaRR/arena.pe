package com.ffqts.arenape.application.event;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.services.event.IGetEvents;
import com.ffqts.arenape.infra.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GetEventsService implements IGetEvents {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public List<Event> getAllActive() {
        return eventRepository.findByActiveTrue();
    }

    @Override
    public List<Event> getAllWithDeleted() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> getByCategoryId(Long id) {
        return eventRepository.findByActiveTrueAndCategory_Id(id);
    }

    @Override
    public Event getById(String id) {
        return eventRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
    }
}
