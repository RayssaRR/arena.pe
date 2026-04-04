package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    UserDetails findByEmail(String email);
    Optional<User> findUserByEmail(String email);
}