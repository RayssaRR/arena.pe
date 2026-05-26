export const TICKET_LOCATIONS = [
  { value: "INFERIOR_NORTE",  label: "Inferior Norte",  capacity: 2500  },
  { value: "INFERIOR_SUL",    label: "Inferior Sul",    capacity: 2500  },
  { value: "INFERIOR_LESTE",  label: "Inferior Leste",  capacity: 4000  },
  { value: "INFERIOR_OESTE",  label: "Inferior Oeste",  capacity: 4000  },
  { value: "SUPERIOR_NORTE",  label: "Superior Norte",  capacity: 4500  },
  { value: "SUPERIOR_SUL",    label: "Superior Sul",    capacity: 4500  },
  { value: "SUPERIOR_LESTE",  label: "Superior Leste",  capacity: 8000  },
  { value: "SUPERIOR_OESTE",  label: "Superior Oeste",  capacity: 8000  },
  { value: "DECK_PREMIUM",    label: "Deck Premium",    capacity: 2500  },
  { value: "GRAMADO",        label: "Gramado",        capacity: 12000 },
] as const

export const LOCATION_LABELS: Record<string, string> = Object.fromEntries(
  TICKET_LOCATIONS.map((l) => [l.value, l.label])
)

export const LOCATION_CAPACITY: Record<string, number> = Object.fromEntries(
  TICKET_LOCATIONS.map((l) => [l.value, l.capacity])
)

export const TOTAL_CAPACITY = 45500