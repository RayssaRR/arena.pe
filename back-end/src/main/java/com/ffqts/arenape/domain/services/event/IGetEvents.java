package com.ffqts.arenape.domain.services.event;

import com.ffqts.arenape.domain.models.event.Event;

import java.util.List;

public interface IGetEvents {
    List<Event> getAllActive();
    List<Event> getAllWithDeleted();
    List<Event> getByCategoryId(Long id);
    Event getById(String id);
}
