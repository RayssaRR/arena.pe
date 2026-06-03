package com.ffqts.arenape.application.event;

import com.ffqts.arenape.application.utils.ConvertToDTO;
import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.models.ticket.UserTicket;
import com.ffqts.arenape.domain.models.user.User;
import com.ffqts.arenape.domain.services.event.IGetUserPurchasedEventsService;
import com.ffqts.arenape.infra.repositories.UserRepository;
import com.ffqts.arenape.infra.repositories.UserTicketRepository;
import com.ffqts.arenape.presentation.dto.event.PagedUserEventsDTO;
import com.ffqts.arenape.presentation.dto.event.UserEventResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GetUserPurchasedEventsService implements IGetUserPurchasedEventsService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PagedUserEventsDTO get(String userEmail, Integer page, Integer pageSize) {
        page = page != null && page >= 0 ? page : 0;
        pageSize = pageSize != null && pageSize > 0 ? pageSize : 10;

        User user = userRepository.findUserByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        List<UserTicket> allUserTickets = userTicketRepository.findByUser_Id(user.getId(), Pageable.unpaged()).getContent();

        Map<UUID, Event> uniqueEvents = new LinkedHashMap<>();
        for (UserTicket ticket : allUserTickets) {
            uniqueEvents.putIfAbsent(ticket.getEvent().getId(), ticket.getEvent());
        }

        List<UserEventResponseDTO> sortedEvents = uniqueEvents.values().stream()
            .sorted((e1, e2) -> e2.getEventDate().compareTo(e1.getEventDate()))
            .map(ConvertToDTO::eventToDTO)
            .collect(Collectors.toList());

        int start = page * pageSize;
        int end = Math.min(start + pageSize, sortedEvents.size());
        List<UserEventResponseDTO> pageContent = sortedEvents.subList(start, end);

        long totalElements = sortedEvents.size();
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        boolean isLast = page >= totalPages - 1 || totalPages == 0;

        return new PagedUserEventsDTO(
            pageContent,
            page,
            pageSize,
            totalElements,
            totalPages,
            isLast
        );
    }

}
