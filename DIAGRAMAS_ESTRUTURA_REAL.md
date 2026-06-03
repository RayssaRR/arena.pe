# Diagramas & Estrutura - Arena.PE (Implementado)

## 1. DIAGRAMA DE BOUNDED CONTEXTS

```mermaid
graph TB
    subgraph EMC["Event Management Context"]
        E["📌 Event Aggregate<br/>(Event.java)"]
        CS["Services:<br/>CreateEventService<br/>UpdateEventService<br/>GetEventsService"]
        IS["Interfaces:<br/>ICreateEvent"]
    end
    
    subgraph TSC["Ticket Sales Context"]
        TM["📌 TicketModel Aggregate<br/>(TicketModel.java)"]
        TCS["Services:<br/>CreateTicketModelService<br/>UpdateTicketModelService<br/>GetTicketModelsService"]
        TIS["Interfaces:<br/>ICreateTicketModel"]
    end
    
    subgraph TRC["Ticket Redemption Context"]
        UT["📌 UserTicket Aggregate<br/>(UserTicket.java)"]
        TRS["Services:<br/>AssignUserTicketsService<br/>ConsumeUserTicketService<br/>CancelUserTicketService"]
        TRIS["Interfaces:<br/>IAssignUserTickets<br/>IConsumeUserTicket<br/>ICancelUserTicket"]
    end
    
    subgraph UMC["User Management Context"]
        U["📌 User Aggregate<br/>(User.java)"]
        US["Services:<br/>AuthenticationService<br/>RegisterService"]
        UIS["Interfaces:<br/>IAuthService"]
    end
    
    E -->|FK: creator| U
    E -.->|FK: category| C["Category Aggregate"]
    E -->|composition| TM
    E -->|composition| UT
    
    TM -->|FK: event| E
    TM -->|composition| UT
    
    UT -->|FK: user| U
    UT -->|FK: event| E
    UT -->|FK: ticketModel| TM
    
    U -->|composition| E
    U -->|composition| UT
    
    style EMC fill:#c8e6c9
    style TSC fill:#c8e6c9
    style TRC fill:#bbdefb
    style UMC fill:#fff9c4
    
    classDef agregado fill:#2e7d32,stroke:#1b5e20,color:#fff
    class E TM UT U agregado
```

---

## 2. LISTA DE AGREGADOS COM INVARIANTES

### Agregado 1: EVENT

```
╔════════════════════════════════════════════════════════╗
║          AGREGADO: EVENT                              ║
╠════════════════════════════════════════════════════════╣
║ ID        : UUID                                       ║
║ title     : String                                    ║
║ description : String                                  ║
║ eventDate : LocalDateTime                             ║
║ status    : EventStatus (enum)                        ║
║ imageUrl  : String                                    ║
║ creator   : User (FK)                                 ║
║ category  : Category (FK)                             ║
║ active    : Boolean                                   ║
║ userTickets : List<UserTicket> (composição)           ║
╠════════════════════════════════════════════════════════╣
║ INVARIANTES:                                          ║
╠════════════════════════════════════════════════════════╣
║ I1  | @NotBlank: title ≠ null                         ║
║ I2  | @Size(min=3, max=150): length(title)           ║
║ I3  | @NotBlank: description ≠ null                  ║
║ I4  | @Size(min=10, max=1000): length(description)   ║
║ I5  | @NotNull: eventDate ≠ null                     ║
║ I6  | @Future: eventDate > LocalDateTime.now()       ║
║ I7  | @NotNull: status ∈ {UPCOMING, ONGOING,         ║
║      COMPLETED, CANCELED}                             ║
║ I8  | @NotBlank: imageUrl ≠ null                     ║
║ I9  | @Size(min=5, max=500): length(imageUrl)        ║
║ I10 | @NotNull: creator ≠ null (FK constraint)       ║
║ I11 | title é UNIQUE (@Column unique=true)           ║
║ I12 | active=true ↔ status=UPCOMING                  ║
╠════════════════════════════════════════════════════════╣
║ REGRAS DE NEGÓCIO:                                    ║
╠════════════════════════════════════════════════════════╣
║ RN1 | Só usuário autenticado pode criar evento        ║
║ RN2 | status UPCOMING = tickets podem ser vendidos    ║
║ RN3 | status COMPLETED/CANCELED = sem mais vendas     ║
║ RN4 | Cancelado → todos UserTickets devem ser         ║
║      marcados CANCELADO (responsabilidade aplicação) ║
║ RN5 | Cada evento precisa ≥1 TicketModel (lógica    ║
║      na aplicação)                                    ║
╚════════════════════════════════════════════════════════╝
```

**Classe**: `back-end/src/main/java/com/ffqts/arenape/domain/models/event/Event.java`

---

### Agregado 2: TICKET MODEL

```
╔════════════════════════════════════════════════════════╗
║       AGREGADO: TICKET MODEL                          ║
╠════════════════════════════════════════════════════════╣
║ ID            : UUID                                  ║
║ event         : Event (FK)                            ║
║ ticketLocation : TicketLocation (enum)                ║
║ price         : Double                                ║
║ ticketsAvailable : Integer                            ║
║ ticketsSold   : Integer                               ║
║ expired       : Boolean                               ║
║ userTickets   : List<UserTicket> (composição)         ║
╠════════════════════════════════════════════════════════╣
║ INVARIANTES:                                          ║
╠════════════════════════════════════════════════════════╣
║ I1  | @NotNull: event ≠ null (FK)                    ║
║ I2  | @NotNull: ticketLocation ∈ {PISTA, VIP,        ║
║      CAMAROTE}                                        ║
║ I3  | @NotNull: price ≠ null                         ║
║ I4  | @DecimalMin(0.0, exclusive): price > 0         ║
║ I5  | @NotNull: ticketsAvailable ≠ null              ║
║ I6  | @Min(1): ticketsAvailable ≥ 1                  ║
║ I7  | @NotNull: ticketsSold ≠ null                   ║
║ I8  | @Min(0): ticketsSold ≥ 0                       ║
║ I9  | ticketsSold ≤ ticketsAvailable (lógica BD)     ║
║ I10 | Per evento: ticketLocation UNIQUE              ║
║ I11 | expired=false → pode vender                    ║
║ I12 | expired=true → sem venda nova                  ║
╠════════════════════════════════════════════════════════╣
║ REGRAS DE NEGÓCIO:                                    ║
╠════════════════════════════════════════════════════════╣
║ RN1 | Não vende mais tickets que ticketsAvailable     ║
║ RN2 | Cada setor (location) = 1 linha BD por evento  ║
║ RN3 | Uma vez ticketsSold > 0 → price NÃO muda      ║
║ RN4 | Só criado quando event.status = UPCOMING       ║
║ RN5 | ticketsAvailable - ticketsSold = realmente     ║
║      disponível                                       ║
║ RN6 | Quando ticketsSold = ticketsAvailable →        ║
║      setor SOLD OUT                                  ║
╚════════════════════════════════════════════════════════╝
```

**Classe**: `back-end/src/main/java/com/ffqts/arenape/domain/models/ticket/TicketModel.java`

---

### Agregado 3: USER TICKET

```
╔════════════════════════════════════════════════════════╗
║       AGREGADO: USER TICKET                           ║
╠════════════════════════════════════════════════════════╣
║ ID          : UUID                                    ║
║ user        : User (FK)                               ║
║ event       : Event (FK)                              ║
║ ticketModel : TicketModel (FK)                        ║
║ status      : TicketStatus (enum)                     ║
║ createdAt   : LocalDateTime                           ║
║ updatedAt   : LocalDateTime                           ║
╠════════════════════════════════════════════════════════╣
║ INVARIANTES:                                          ║
╠════════════════════════════════════════════════════════╣
║ I1  | @NotNull: user ≠ null (FK)                     ║
║ I2  | @NotNull: event ≠ null (FK)                    ║
║ I3  | @NotNull: ticketModel ≠ null (FK)              ║
║ I4  | @NotNull: status ≠ null                        ║
║ I5  | status ∈ {VALIDO, RESGATADO, CANCELADO,        ║
║      EXPIRADO}                                        ║
║ I6  | status.inicial = VALIDO                        ║
║ I7  | Transições permitidas (lógica aplicação):      ║
║      VALIDO → RESGATADO                              ║
║      VALIDO → CANCELADO                              ║
║      VALIDO → EXPIRADO                               ║
║      (outros: terminal/sem mudança)                  ║
║ I8  | RESGATADO → terminal (sem mudança)             ║
║ I9  | CANCELADO → terminal (sem mudança)             ║
║ I10 | EXPIRADO → terminal (sem mudança)              ║
║ I11 | @CreationTimestamp: createdAt (auto)           ║
║ I12 | @UpdateTimestamp: updatedAt (auto)             ║
║ I13 | createdAt ≤ updatedAt (sempre)                 ║
╠════════════════════════════════════════════════════════╣
║ REGRAS DE NEGÓCIO:                                    ║
╠════════════════════════════════════════════════════════╣
║ RN1 | Um UserTicket resgatado SÓ UMA VEZ              ║
║ RN2 | Um UserTicket cancelado SÓ UMA VEZ              ║
║ RN3 | Apenas owner (user) OU ADMIN podem cancelar    ║
║ RN4 | Cancelamento → devolução de dinheiro            ║
║      (lógica em CancelUserTicketService)              ║
║ RN5 | Ticket expirado = após evento terminou          ║
║ RN6 | Não pode transferir para outro user             ║
║ RN7 | Auditoria: createdAt/updatedAt rastreiam tudo  ║
║ RN8 | Event.status=UPCOMING necessário para compra    ║
║      (validado em AssignUserTicketsService)           ║
╚════════════════════════════════════════════════════════╝
```

**Classe**: `back-end/src/main/java/com/ffqts/arenape/domain/models/ticket/UserTicket.java`

---

### Agregado 4: USER

```
╔════════════════════════════════════════════════════════╗
║          AGREGADO: USER                               ║
╠════════════════════════════════════════════════════════╣
║ ID             : UUID                                 ║
║ name           : String                               ║
║ email          : String                               ║
║ password       : String (hashed)                      ║
║ role           : Role (enum)                          ║
║ createdAt      : LocalDateTime                        ║
║ updatedAt      : LocalDateTime                        ║
║ createdEvents  : List<Event> (composição)             ║
║ userTickets    : List<UserTicket> (composição)        ║
╠════════════════════════════════════════════════════════╣
║ INVARIANTES:                                          ║
╠════════════════════════════════════════════════════════╣
║ I1  | @NotBlank: name ≠ null                          ║
║ I2  | @Column(nullable=false): name NOT NULL          ║
║ I3  | @NotBlank: email ≠ null                         ║
║ I4  | @Email: email é válido                          ║
║ I5  | @Column(unique=true): email é UNIQUE            ║
║ I6  | @NotBlank: password ≠ null                      ║
║ I7  | password é HASHED (Spring Security)             ║
║ I8  | @NotNull: role ≠ null                           ║
║ I9  | role ∈ {CUSTOMER, ADMIN}                        ║
║ I10 | Um user = exatamente UM role                    ║
║ I11 | @CreationTimestamp: createdAt (auto)            ║
║ I12 | @UpdateTimestamp: updatedAt (auto)              ║
║ I13 | createdAt ≤ updatedAt (sempre)                  ║
║ I14 | Implementa UserDetails (Spring Security)        ║
╠════════════════════════════════════════════════════════╣
║ REGRAS DE NEGÓCIO:                                    ║
╠════════════════════════════════════════════════════════╣
║ RN1 | Novo user criado com role = CUSTOMER            ║
║ RN2 | Apenas ADMIN promove outro a ADMIN              ║
║ RN3 | ADMIN: pode cancelar tickets de qualquer um     ║
║      (validado em CancelUserTicketService)            ║
║ RN4 | CUSTOMER: pode cancelar só seus tickets         ║
║ RN5 | Password protegida (BCrypt hash)                ║
║ RN6 | Login necessário para comprar tickets           ║
║ RN7 | Email unique garante identidade                 ║
║ RN8 | createdEvents: eventos criados pelo user        ║
║ RN9 | userTickets: ingressos que usuário possui       ║
╚════════════════════════════════════════════════════════╝
```

**Classe**: `back-end/src/main/java/com/ffqts/arenape/domain/models/user/User.java`

---

## 3. TABELA DE DOMAIN EVENTS

### Nota: Events Não Implementados

⚠️ **Importante**: O projeto Arena.PE **NÃO possui Domain Events publicação** implementados atualmente.

Os eventos abaixo são **eventos de negócio que ocorrem**, mas **não há sistema de event publishing/subscribing** no código. As ações são executadas de forma síncrona nos Services.

```
┌──────────────────────────────────────────────────────────────┐
│              EVENTOS DE NEGÓCIO (Conceituais)                │
├──────────────────────────────────────────────────────────────┤
│ # | Evento                | Quando Ocorre      | Atores       │
├──────────────────────────────────────────────────────────────┤
│ 1 | EventCreatedEvent     | Evento é criado    | EventService │
│   │                       | (POST /api/events) │              │
│   │                       | Resultado: Event   │              │
│   │                       | salvo no BD        │              │
│   │                       │                    │              │
│ 2 | TicketModelCreated    | TicketModel criado │ Ticket Model │
│   │ Event                 | (junto com evento  │ Service      │
│   │                       │ ou separadamente)  │              │
│   │                       │ Resultado: Setor  │              │
│   │                       | criado no BD       │              │
│   │                       │                    │              │
│ 3 | TicketPurchasedEvent  | Usuário compra     │ Assign User  │
│   │ (AssignUserTicket)    | ticket             │ Tickets      │
│   │                       | (POST /api/tickets/│ Service      │
│   │                       │ purchase)          │              │
│   │                       │ Resultado: User    │              │
│   │                       | Tickets criados    │              │
│   │                       │ & ticketsSold++    │              │
│   │                       │                    │              │
│ 4 | TicketRedeemedEvent   | Ticket é validado/ │ Consume User │
│   │ (ConsumeUserTicket)   | resgatado no dia   │ Ticket       │
│   │                       | do evento          │ Service      │
│   │                       | (POST /api/tickets/│              │
│   │                       │ consume/{id})      │              │
│   │                       │ Resultado: status  │              │
│   │                       | = RESGATADO        │              │
│   │                       │                    │              │
│ 5 | TicketCancelledEvent  | Ticket cancelado   │ Cancel User  │
│   │                       | (POST /api/tickets/│ Ticket       │
│   │                       │ {id}/cancel)       │ Service      │
│   │                       │ Resultado: status  │              │
│   │                       | = CANCELADO &      │              │
│   │                       | reembolso          │              │
└──────────────────────────────────────────────────────────────┘
```

### Por Que Não Há Event Publishing?

```
O projeto segue Clean Architecture mas ainda não implementa:
  ✗ ApplicationEventPublisher (Spring Events)
  ✗ @EventListener decorators
  ✗ DomainEventPublisher abstração
  ✗ Event queue/message broker (RabbitMQ, Kafka)

O que existe:
  ✓ Lógica é executada de forma síncrona nos Services
  ✓ Transações garantem atomicidade
  ✓ Mas sem pub/sub desacoplado
```

---

## 4. ESTRUTURA DE PASTAS - CLEAN ARCHITECTURE

### 4.1 Árvore Completa (Implementada)

```
arena-pe-backend/
│
├── pom.xml                                    # Maven config
├── docker-compose.yml                         # Docker setup
│
└── src/main/java/com/ffqts/arenape/
    │
    ├── 🎯 presentation/                      # CAMADA DE APRESENTAÇÃO
    │   ├── controllers/
    │   │   ├── EventController.java          # REST: /api/events
    │   │   ├── TicketController.java         # REST: /api/tickets
    │   │   ├── UserController.java           # REST: /api/users, /api/auth
    │   │   └── ReservationController.java    # REST: /api/reservations
    │   │
    │   ├── dto/
    │   │   ├── event/
    │   │   │   ├── NewEventForm.java
    │   │   │   ├── EventResponseDTO.java
    │   │   │   ├── TicketSectorDTO.java
    │   │   │   ├── NewTicketSector.java
    │   │   │   ├── UserEventResponseDTO.java
    │   │   │   ├── PagedUserEventsDTO.java
    │   │   │   └── CreateEventResponse.java
    │   │   │
    │   │   ├── ticket/
    │   │   │   ├── NewTicketModelForm.java
    │   │   │   ├── UserTicketResponseDTO.java
    │   │   │   ├── ConsumeTicketResponseDTO.java
    │   │   │   ├── TicketCancellationResponseDTO.java
    │   │   │   ├── PagedUserTicketsDTO.java
    │   │   │   └── NewTicketModelForm.java
    │   │   │
    │   │   ├── reservation/
    │   │   │   └── NewReservationForm.java
    │   │   │
    │   │   ├── user/
    │   │   │   ├── RegisterForm.java
    │   │   │   ├── LoginRequest.java
    │   │   │   ├── LoginResponse.java
    │   │   │   └── UserResponse.java
    │   │   │
    │   │   ├── statistics/
    │   │   │   ├── EventStatisticsDTO.java
    │   │   │   ├── TicketSalesPeriodDTO.java
    │   │   │   └── WeeklySalesDTO.java
    │   │   │
    │   │   └── common/
    │   │       └── (padrão HTTP responses)
    │   │
    │   ├── utils/
    │   │   ├── CreateEventResponse.java
    │   │   └── (error handlers)
    │   │
    │   └── mappers/ (se existentes, mapeiam DTO ↔ Entity)
    │
    │
    ├── 🧠 application/                       # CAMADA DE APLICAÇÃO
    │   ├── event/
    │   │   ├── CreateEventService.java       # USE CASE: Criar evento
    │   │   ├── UpdateEventService.java       # USE CASE: Atualizar evento
    │   │   ├── GetEventsService.java         # USE CASE: Listar eventos
    │   │   ├── GetUserPurchasedEventsService.java # USE CASE
    │   │   └── DeleteEventService.java       # USE CASE: Deletar evento
    │   │
    │   ├── tickets/
    │   │   ├── model/
    │   │   │   ├── CreateTicketModelService.java      # USE CASE
    │   │   │   ├── UpdateTicketModelService.java      # USE CASE
    │   │   │   ├── GetTicketModelsService.java        # USE CASE
    │   │   │   └── DeactivateTicketModelService.java  # USE CASE
    │   │   │
    │   │   └── user/
    │   │       ├── AssignUserTicketsService.java   # USE CASE: Comprar
    │   │       ├── ConsumeUserTicketService.java   # USE CASE: Resgatar
    │   │       ├── CancelUserTicketService.java    # USE CASE: Cancelar
    │   │       └── GetUserTicketsService.java      # USE CASE: Listar
    │   │
    │   ├── auth/
    │   │   ├── AuthenticationService.java   # USE CASE: Login
    │   │   ├── TokenService.java            # USE CASE: Token JWT
    │   │   └── PasswordEncoderService.java  # USE CASE: Hash password
    │   │
    │   ├── category/
    │   │   ├── CreateCategoryService.java   # USE CASE
    │   │   ├── GetCategoryService.java      # USE CASE
    │   │   └── ListCategoriesService.java   # USE CASE
    │   │
    │   ├── statistics/
    │   │   ├── CalculateEventStatisticsService.java
    │   │   ├── CalculateTicketSalesService.java
    │   │   └── GenerateReportService.java
    │   │
    │   └── utils/
    │       └── ValidationService.java       # Utilitários
    │
    │
    ├── 👑 domain/                            # CAMADA DE DOMÍNIO
    │   ├── models/
    │   │   ├── BaseEntity.java              # Superclass (createdAt, updatedAt)
    │   │   │
    │   │   ├── event/
    │   │   │   ├── Event.java               # ★ AGREGADO RAIZ
    │   │   │   ├── EventStatus.java         # enum: UPCOMING, ONGOING, ...
    │   │   │   └── Category.java            # ENTIDADE
    │   │   │
    │   │   ├── ticket/
    │   │   │   ├── TicketModel.java         # ★ AGREGADO RAIZ
    │   │   │   ├── UserTicket.java          # ★ AGREGADO RAIZ
    │   │   │   ├── TicketStatus.java        # enum: VALIDO, RESGATADO, ...
    │   │   │   └── TicketLocation.java      # enum: PISTA, VIP, CAMAROTE
    │   │   │
    │   │   └── user/
    │   │       ├── User.java                # ★ AGREGADO RAIZ
    │   │       └── Role.java                # enum: CUSTOMER, ADMIN
    │   │
    │   ├── services/ (INTERFACES - Contratos)
    │   │   ├── event/
    │   │   │   └── ICreateEvent.java        # Interface
    │   │   │
    │   │   ├── tickets/
    │   │   │   ├── model/
    │   │   │   │   └── ICreateTicketModel.java
    │   │   │   │
    │   │   │   └── user/
    │   │   │       ├── IAssignUserTicketsService.java
    │   │   │       ├── IConsumeUserTicketService.java
    │   │   │       └── ICancelUserTicketService.java
    │   │   │
    │   │   ├── category/
    │   │   │   └── ICategoryService.java
    │   │   │
    │   │   └── auth/
    │   │       └── IAuthService.java
    │   │
    │   └── repositories/ (INTERFACES - Abstrações)
    │       ├── IEventRepository.java
    │       ├── ITicketModelRepository.java
    │       ├── IUserTicketRepository.java
    │       ├── IUserRepository.java
    │       └── ICategoryRepository.java
    │
    │
    └── 🔧 infrastructure/                   # CAMADA DE INFRAESTRUTURA
        ├── repositories/                   # IMPLEMENTAÇÕES (Spring Data JPA)
        │   ├── EventRepository.java        # extends JpaRepository
        │   ├── TicketModelRepository.java  # extends JpaRepository
        │   ├── UserTicketRepository.java   # extends JpaRepository
        │   ├── UserRepository.java         # extends JpaRepository
        │   └── CategoryRepository.java     # extends JpaRepository
        │
        ├── security/
        │   ├── SecurityFilter.java         # Filtra requisições (JWT)
        │   ├── SecurityConfig.java         # Spring Security config
        │   ├── JwtTokenProvider.java       # Gera/valida JWT
        │   └── PasswordEncoder.java        # BCrypt
        │
        └── (PostgreSQL via application.properties)
```

### 4.2 Convenção de Nomes

```
APRESENTAÇÃO:
  📄 *Form.java              = DTO para entrada (POST/PUT)
  📄 *ResponseDTO.java       = DTO para saída
  📄 *Controller.java        = REST Controller

APLICAÇÃO:
  📄 *Service.java           = Use Case (orquestra)
  📄 I*Service.java          = Interface de contrato (domain)

DOMÍNIO:
  📄 *.java (@Entity)        = Entidades do domínio
  📄 *Status.java            = Enum de status
  📄 I*Service.java          = Interface de domínio

INFRAESTRUTURA:
  📄 *Repository.java        = Implementação JPA
```

---

## 5. EXEMPLO DE FLUXO COMPLETO (Create Event)

```
┌─────────────────────────────────────────────────────────────┐
│ [1] HTTP REQUEST (PRESENTATION)                             │
│                                                              │
│ POST /api/events                                            │
│ {                                                            │
│   "title": "Show XYZ",                                      │
│   "description": "Descrição do evento...",                  │
│   "eventDate": "2024-10-15T14:00:00",                       │
│   "imageUrl": "https://...",                                │
│   "categoryId": 1,                                          │
│   "ticketSectors": [                                        │
│     { "location": "PISTA", "price": 100.00, ... }           │
│   ]                                                          │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│ [2] EventController (PRESENTATION)                          │
│                                                              │
│ @PostMapping("/events")                                     │
│ public CreateEventResponse create(@Valid NewEventForm req)  │
│   └─ Mapeia NewEventForm → parâmetros                       │
│   └─ Chama: createEventService.create(...)                  │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│ [3] CreateEventService (APPLICATION)                        │
│                                                              │
│ @Service                                                    │
│ @Transactional                                              │
│ public Event create(String title, ..., String creatorEmail) │
│                                                              │
│   Passo 1: Validações                                       │
│   ├─ if (eventRepository.findByTitle(title).isPresent())    │
│   │  └─ throw IllegalArgumentException("título existe")    │
│   │                                                          │
│   ├─ if (eventDate.isBefore(now()))                         │
│   │  └─ throw IllegalArgumentException("data no passado")   │
│   │                                                          │
│   ├─ var creator = userRepository.findUserByEmail(email)    │
│   │  └─ or throw IllegalArgumentException("user not found") │
│   │                                                          │
│   └─ var category = categoryRepository.findById(categoryId) │
│      └─ or throw IllegalArgumentException("cat not found")  │
│                                                              │
│   Passo 2: Criar Event (DOMAIN)                             │
│   └─ Event newEvent = new Event(                            │
│        title, description, eventDate, creator,             │
│        imageUrl, category                                   │
│      );                                                      │
│                                                              │
│   Passo 3: Persistir                                        │
│   ├─ Event savedEvent = eventRepository.save(newEvent)      │
│   │  └─ INSERT INTO events (...)                            │
│   │                                                          │
│   └─ Para cada TicketSector:                                │
│      └─ createTicketModelService.create(...)               │
│         └─ INSERT INTO ticket_models (...)                  │
│                                                              │
│   Passo 4: Retornar resultado                               │
│   └─ return savedEvent;                                     │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│ [4] DOMAIN LAYER (Validações de Invariantes)                │
│                                                              │
│ Event Constructor:                                          │
│   this.status = EventStatus.UPCOMING;  (I7)                 │
│   this.active = true;                  (I12)                │
│                                                              │
│ Ao persistir (JPA):                                         │
│   @NotBlank: title ≠ null              (I1)                 │
│   @Size(3,150): length(title)          (I2)                 │
│   @Future: eventDate > now()           (I6)                 │
│   @NotNull: creator ≠ null             (I10)                │
│   @Column(unique): title unique        (I11)                │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│ [5] INFRASTRUCTURE LAYER (PostgreSQL)                        │
│                                                              │
│ INSERT INTO events (                                        │
│   id, title, description, event_date, status,              │
│   image_url, creator_id, category_id, active,              │
│   created_at, updated_at                                    │
│ ) VALUES (                                                  │
│   uuid_generate_v4(), 'Show XYZ', ..., 'UPCOMING', ...,    │
│   now(), now()                                              │
│ );                                                           │
│                                                              │
│ (Constraint violations levantam exceções se invariantes      │
│  forem violados)                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│ [6] RESPONSE (PRESENTATION)                                 │
│                                                              │
│ HTTP 201 CREATED                                            │
│ {                                                            │
│   "id": "uuid-123-456",                                     │
│   "title": "Show XYZ",                                      │
│   "status": "UPCOMING",                                     │
│   "createdAt": "2024-06-03T10:30:00",                       │
│   "message": "Event created successfully"                   │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. MATRIZ: RESPONSABILIDADES POR CAMADA

| O Que Faz | Presentation | Application | Domain | Infrastructure |
|-----------|:-:|:-:|:-:|:-:|
| Recebe Request HTTP | **R** | - | - | - |
| Valida Formato DTO | **A** | - | - | - |
| Mapeia DTO → Domínio | - | **R** | - | - |
| Aplica Regra Negócio | - | - | **R** | - |
| Persistir no BD | - | - | - | **R** |
| Autenticação | - | **C** | - | **E** |
| Transação (@Transactional) | - | **R** | - | - |
| Validações Constraints | - | - | **R** (JPA) | - |
| Retorna Response HTTP | **R** | - | - | - |

*R=Responsible, A=Accountable, C=Consulted, E=Execute*

---

## 7. RESUMO: O QUE ESTÁ IMPLEMENTADO

### ✅ IMPLEMENTADO

```
✓ 4 Bounded Contexts claramente segregados
✓ 4 Agregados (Event, TicketModel, UserTicket, User)
✓ Invariantes protegidas via @NotNull, @Min, @Size, etc
✓ Camada Presentation (Controllers, DTOs)
✓ Camada Application (Services/Use Cases com @Service, @Transactional)
✓ Camada Domain (Entities com regras de negócio)
✓ Camada Infrastructure (Repositories com Spring Data JPA)
✓ Spring Security (JWT, Roles)
✓ Validações em múltiplas camadas
✓ PostgreSQL integrado
```

### ❌ NÃO IMPLEMENTADO

```
✗ Domain Event Publishing/Subscribing
✗ Value Objects explícitos (além de enums)
✗ CQRS
✗ Event Sourcing
✗ Message Queue (RabbitMQ, Kafka)
✗ Repository Interfaces abstratas no Domain
  (usam Spring Data JPA diretamente)
```

