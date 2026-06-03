package com.ffqts.arenape.application.tickets.user;

import com.ffqts.arenape.application.utils.ConvertToDTO;
import com.ffqts.arenape.domain.models.ticket.TicketStatus;
import com.ffqts.arenape.domain.models.ticket.UserTicket;
import com.ffqts.arenape.domain.models.user.Role;
import com.ffqts.arenape.domain.models.user.User;
import com.ffqts.arenape.domain.services.tickets.user.IGetUserTicketsService;
import com.ffqts.arenape.infra.repositories.UserRepository;
import com.ffqts.arenape.infra.repositories.UserTicketRepository;
import com.ffqts.arenape.presentation.dto.ticket.ConsumeTicketResponseDTO;
import com.ffqts.arenape.presentation.dto.ticket.PagedUserTicketsDTO;
import com.ffqts.arenape.presentation.dto.ticket.UserTicketResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GetUserTicketsService implements IGetUserTicketsService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PagedUserTicketsDTO getUserTicketsPaginated(String userEmail, Integer page, Integer pageSize, String sortBy, String sortDirection, Boolean filterByValidity) {
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
        .map(ConvertToDTO::userTicketToDTO)
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

    @Override
    public UserTicketResponseDTO getByIdForUser(UUID ticketId, String userEmail) {
        UserTicket ticket = userTicketRepository.findById(ticketId)
            .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));

        User requester = userRepository.findUserByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        boolean isOwner = ticket.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Você não tem permissão para acessar este ticket");
        }

        return ConvertToDTO.userTicketToDTO(ticket);
    }

    @Override
    public ConsumeTicketResponseDTO getByIdForAdmin(UUID ticketId) {
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

    @Override
    public PagedUserTicketsDTO getByEventPaginated(String userEmail, String eventId, Integer page, Integer pageSize) {
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
            .map(ConvertToDTO::userTicketToDTO)
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
