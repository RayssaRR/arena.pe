package com.ffqts.arenape.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = RoleEnum.CUSTOMER;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Nome não pode ficar vazio")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email não pode ficar vazio")
    @Email(message = "Email inválido")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Senha não pode ficar vazia")
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleEnum role;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> createdEvents;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public UUID getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public RoleEnum getRole() {
        return role;
    }
    public void setRole(RoleEnum role) { this.role = role; }
    public List<Event> getCreatedEvents() { return createdEvents; }
    public void setCreatedEvents(List<Event> createdEvents) { this.createdEvents = createdEvents; }
}