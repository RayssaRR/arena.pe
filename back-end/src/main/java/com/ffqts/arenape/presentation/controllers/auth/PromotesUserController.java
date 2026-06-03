package com.ffqts.arenape.presentation.controllers.auth;

import com.ffqts.arenape.domain.services.auth.IPromotesUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class PromotesUserController {

    @Autowired
    private IPromotesUser service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/promote")
    public void promoteUser(@RequestParam String email) {
        service.promotes(email);
    }

}
