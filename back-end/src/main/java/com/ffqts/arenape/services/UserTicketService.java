package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.event.PagedUserEventsDTO;
import com.ffqts.arenape.controllers.dto.event.UserEventResponseDTO;
import com.ffqts.arenape.controllers.dto.ticket.ConsumeTicketResponseDTO;
import com.ffqts.arenape.controllers.dto.ticket.PagedUserTicketsDTO;
import com.ffqts.arenape.controllers.dto.ticket.UserTicketResponseDTO;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.models.ticket.UserTicket;
import com.ffqts.arenape.models.ticket.TicketStatus;
import com.ffqts.arenape.models.user.Role;
import com.ffqts.arenape.models.user.User;
import com.ffqts.arenape.repositories.UserRepository;
import com.ffqts.arenape.repositories.UserTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserTicketService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private UserRepository userRepository;

    public PagedUserTicketsDTO getUserTickets(
            String userEmail,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortDirection,
            Boolean filterByValidity
    ) {
        page = page != null && page >= 0 ? page : 0;
        pageSize = pageSize != null && pageSize > 0 ? pageSize : 10;
        sortBy = (sortBy == null || sortBy.isBlank()) ? "createdAt" : sortBy;
        sortDirection = (sortDirection == null || sortDirection.isBlank()) ? "desc" : sortDirection.toLowerCase();

        if (!List.of("createdAt", "eventTitle", "price").contains(sortBy)) {
            throw new IllegalArgumentException("Campo de ordenação inválido. Use 'createdAt', 'eventTitle' ou 'price'");
        }

        if (!List.of("asc", "desc").contains(sortDirection)) {
            throw new IllegalArgumentException("Direção de ordenação inválida. Use 'asc' ou 'desc'");
        }

        User user = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Sort.Direction direction = "asc".equals(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        Page<UserTicket> userTicketsPage;
        if (filterByValidity != null) {
            TicketStatus statusFilter = filterByValidity ? TicketStatus.VALIDO : TicketStatus.CANCELADO;
            userTicketsPage = userTicketRepository.findByUser_IdAndStatus(user.getId(), statusFilter, pageable);
        } else {
            userTicketsPage = userTicketRepository.findByUser_Id(user.getId(), pageable);
        }

        List<UserTicketResponseDTO> content = userTicketsPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PagedUserTicketsDTO(
                content,
                userTicketsPage.getNumber(),
                userTicketsPage.getSize(),
                userTicketsPage.getTotalElements(),
                userTicketsPage.getTotalPages(),
                userTicketsPage.isLast()
        );
    }

    private UserTicketResponseDTO convertToDTO(UserTicket ticket) {
        return new UserTicketResponseDTO(
                ticket.getId().toString(),
                ticket.getEvent().getTitle(),
                ticket.getEvent().getId().toString(),
                ticket.getEvent().getEventDate(),
                ticket.getEvent().getStatus(),
                ticket.getTicketModel().getPrice(),
                ticket.getTicketModel().getTicketLocation().toString(),
                ticket.getStatus(),
                ticket.getCreatedAt()
        );
    }

    public UserTicketResponseDTO getTicketById(UUID ticketId, String userEmail) {
        UserTicket ticket = userTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));

        User requester = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        boolean isOwner = ticket.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Você não tem permissão para acessar este ticket");
        }

        return convertToDTO(ticket);
    }

    public ConsumeTicketResponseDTO getTicketByIdForAdmin(UUID ticketId) {
        UserTicket ticket = userTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));
        return new ConsumeTicketResponseDTO(
                ticket.getId().toString(),
                ticket.getEvent().getEventDate(),
                ticket.getUser().getName(),
                ticket.getStatus(),
                ticket.getCreatedAt()
        );
    }

    public PagedUserEventsDTO getUserPurchasedEvents(
            String userEmail,
            Integer page,
            Integer pageSize
    ) {
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
                .map(this::convertEventToDTO)
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

    private UserEventResponseDTO convertEventToDTO(Event event) {
        return new UserEventResponseDTO(
                event.getId().toString(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getEventDate(),
                event.getStatus(),
                event.getImageUrl()
        );
    }

    public PagedUserTicketsDTO getUserTicketsByEvent(
            String userEmail,
            String eventId,
            Integer page,
            Integer pageSize
    ) {
        page = page != null && page >= 0 ? page : 0;
        pageSize = pageSize != null && pageSize > 0 ? pageSize : 10;

        User user = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<UserTicket> userTicketsPage = userTicketRepository.findByUser_IdAndEvent_Id(
                user.getId(),
                UUID.fromString(eventId),
                pageable
        );

        List<UserTicketResponseDTO> content = userTicketsPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PagedUserTicketsDTO(
                content,
                userTicketsPage.getNumber(),
                userTicketsPage.getSize(),
                userTicketsPage.getTotalElements(),
                userTicketsPage.getTotalPages(),
                userTicketsPage.isLast()
        );
    }
}
