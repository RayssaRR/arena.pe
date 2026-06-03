package com.ffqts.arenape.infra.repositories;

import com.ffqts.arenape.domain.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    UserDetails findByEmail(String email);
    Optional<User> findUserByEmail(String email);
}