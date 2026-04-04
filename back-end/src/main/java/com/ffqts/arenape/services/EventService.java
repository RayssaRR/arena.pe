package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.models.Category;
import com.ffqts.arenape.models.Event;
import com.ffqts.arenape.models.RoleEnum;
import com.ffqts.arenape.models.User;
import com.ffqts.arenape.repositories.CategoryRepository;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;
    private CategoryRepository categoryRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(NewEventForm newEventForm, String userEmail) {
        if (eventRepository.findByTitle(newEventForm.title()).isPresent()) {
            throw new IllegalArgumentException("Evento com esse título já existe");
        }

        User organizer = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Organizador não encontrado"));

        if (organizer.getRole() == RoleEnum.CUSTOMER ) {
            throw new IllegalArgumentException("Usuário não tem permissão para criar eventos");
        }

//        Category category = categoryRepository.findById(newEventForm.categoryId())
//                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        Event newEvent = new Event(
            newEventForm.title(),
            newEventForm.description(),
            newEventForm.eventDate(),
            newEventForm.capacity(),
            organizer
        );

        return eventRepository.save(newEvent);
    }

    Event updateEvent() {
        // Lógica para atualizar um evento
        return new Event();
    }

    void deleteEvent() {
        // Lógica para deletar um evento
    }
}
