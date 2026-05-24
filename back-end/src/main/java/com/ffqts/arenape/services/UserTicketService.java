package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.ticket.PagedUserTicketsDTO;
import com.ffqts.arenape.controllers.dto.ticket.UserTicketResponseDTO;
import com.ffqts.arenape.models.ticket.UserTicket;
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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserTicketService {

    @Autowired
    private UserTicketRepository userTicketRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Retorna todos os tickets de um usuário com paginação, filtro e ordenação.
     * 
     * @param userEmail email do usuário
     * @param page número da página (começando em 0)
     * @param pageSize quantidade de registros por página
     * @param sortBy campo para ordenação (createdAt, eventTitle, price)
     * @param sortDirection direção da ordenação (asc ou desc)
     * @param filterByValidity filtro por validade (null = todos, true = válidos, false = cancelados)
     * @return PagedUserTicketsDTO com tickets paginados
     */
    public PagedUserTicketsDTO getUserTickets(
            String userEmail,
            Integer page,
            Integer pageSize,
            String sortBy,
            String sortDirection,
            Boolean filterByValidity
    ) {
        // Validar parâmetros
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

        // Buscar usuário
        User user = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Criar ordenação
        Sort.Direction direction = "asc".equals(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        // Buscar tickets com filtro de validade se fornecido
        Page<UserTicket> userTicketsPage;
        if (filterByValidity != null) {
            userTicketsPage = userTicketRepository.findByUser_IdAndIsValid(user.getId(), filterByValidity, pageable);
        } else {
            userTicketsPage = userTicketRepository.findByUser_Id(user.getId(), pageable);
        }

        // Converter para DTO
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

    /**
     * Converte um UserTicket para UserTicketResponseDTO
     */
    private UserTicketResponseDTO convertToDTO(UserTicket ticket) {
        return new UserTicketResponseDTO(
                ticket.getId().toString(),
                ticket.getEvent().getTitle(),
                ticket.getEvent().getId().toString(),
                ticket.getTicketModel().getTitle(),
                ticket.getTicketModel().getPrice(),
                ticket.getTicketModel().getTicketLocation().toString(),
                ticket.getIsValid(),
                ticket.getCreatedAt()
        );
    }

    /**
     * Retorna um ticket específico por ID.
     * Apenas o dono do ticket ou um administrador pode acessar.
     * 
     * @param ticketId ID do ticket
     * @param userEmail email do usuário que solicita
     * @return UserTicketResponseDTO com os dados do ticket
     * @throws IllegalArgumentException se ticket não existir ou sem permissão
     */
    public UserTicketResponseDTO getTicketById(UUID ticketId, String userEmail) {
        UserTicket ticket = userTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket não encontrado"));

        User requester = userRepository.findUserByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Validar autorização: apenas o dono do ticket ou admin pode acessar
        boolean isOwner = ticket.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Você não tem permissão para acessar este ticket");
        }

        return convertToDTO(ticket);
    }
}
