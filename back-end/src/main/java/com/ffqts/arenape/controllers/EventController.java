package com.ffqts.arenape.controllers;

import com.ffqts.arenape.config.JwtUtil;
import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.models.Event;
import com.ffqts.arenape.repositories.UserRepository;
import com.ffqts.arenape.services.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public void createEvent(@RequestBody NewEventForm newEventForm, HttpServletRequest req) {
        String token = req.getHeader("Authorization");
        String actualToken = token.replace("Bearer ", "");
        String email = JwtUtil.validate(actualToken);
        eventService.createEvent(newEventForm, email);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

}
