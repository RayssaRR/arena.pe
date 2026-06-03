package com.ffqts.arenape.application.event;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.services.event.IUpdateEvent;
import com.ffqts.arenape.infra.repositories.CategoryRepository;
import com.ffqts.arenape.infra.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UpdateEventService implements IUpdateEvent {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Event update(
        String title,
        String description,
        LocalDateTime eventDate,
        String imageUrl,
        Long categoryId,
        String eventId
    ) {
        var currentEvent = eventRepository.findById(UUID.fromString(eventId))
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        currentEvent.setTitle(title);
        currentEvent.setDescription(description);
        currentEvent.setEventDate(eventDate);
        currentEvent.setImageUrl(imageUrl);

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        currentEvent.setCategory(category);

        return eventRepository.save(currentEvent);
    }

}
