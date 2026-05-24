package com.ffqts.arenape.controllers.dto.ticket;

import java.util.List;

public record PagedUserTicketsDTO(
    List<UserTicketResponseDTO> content,
    Integer currentPage,
    Integer pageSize,
    Long totalElements,
    Integer totalPages,
    Boolean isLast
) {}
