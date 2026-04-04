package com.ffqts.arenape.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseEntity {

    @Column(updatable = false)//como se comporta no banco
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist//vai ser exeutado automaticamente antes do objeto ser salvo automaticamente no banco
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate//ajusta a data da última modificação
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}