package com.ffqts.arenape.domain.services.event;

import com.ffqts.arenape.presentation.dto.event.PagedUserEventsDTO;

public interface IGetUserPurchasedEventsService {
    PagedUserEventsDTO get(
        String userEmail,
        Integer page,
        Integer pageSize
    );
}
