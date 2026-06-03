package com.ffqts.arenape.presentation.dto.event;

import java.util.List;

public record PagedUserEventsDTO(
    List<UserEventResponseDTO> content,
    Integer currentPage,
    Integer pageSize,
    Long totalElements,
    Integer totalPages,
    Boolean isLast
) {}
