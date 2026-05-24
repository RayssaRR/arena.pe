package com.ffqts.arenape.models.event;

public enum EventAvailability {
    AVAILABLE("Disponível"),
    UNAVAILABLE("Indisponível");

    private final String displayName;

    EventAvailability(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

