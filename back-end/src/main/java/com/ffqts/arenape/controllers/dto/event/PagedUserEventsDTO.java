package com.ffqts.arenape.controllers.dto.event;

import java.util.List;

public record PagedUserEventsDTO(
    List<UserEventResponseDTO> content,
    Integer currentPage,
    Integer pageSize,
    Long totalElements,
    Integer totalPages,
    Boolean isLast
) {}
