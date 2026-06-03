# Análise DDD & Clean Architecture - Arena.PE (Implementado)

## 1. SUBDOMÍNIOS

### 1.1 Subdomínios Identificados

| Subdomínio | Tipo | Gerador de Receita |
|------------|------|:-:|
| **Event Management** | Core | ✅ SIM |
| **Ticket Sales & Distribution** | Core | ✅ SIM |
| **Event Discovery & Catalog** | Supporting | ❌ NÃO |
| **User & Authentication** | Supporting | ❌ NÃO |

**Explicação:**
- **Event Management**: Criação e gestão de eventos (gera receita ao colocar ingressos à venda)
- **Ticket Sales**: Venda e gerenciamento de modelos de ingresso (principal gerador de receita)
- **Event Discovery**: Busca e listagem de eventos (suporta vendas mas não monetiza)
- **User Auth**: Autenticação e autorização (necessário mas não gera receita)

---

## 2. BOUNDED CONTEXTS

### 2.1 Event Management Context

```
Responsabilidade Principal:
├─ Criar e gerenciar eventos
├─ Atualizar informações do evento
├─ Listar eventos
└─ Deletar eventos

Agregado: EVENT
├─ ID: UUID
├─ title: String (unique, 3-150 chars)
├─ description: String (10-1000 chars)
├─ eventDate: LocalDateTime (futuro)
├─ status: EventStatus (UPCOMING, ONGOING, COMPLETED, CANCELED)
├─ imageUrl: String
├─ creator: User (reference)
├─ category: Category (reference)
├─ active: Boolean
└─ userTickets: List<UserTicket> (composição)

CLIENTE NESTE CONTEXTO: EVENT OWNER (Organizador)
Significado: Pessoa que cria e controla o evento
```

### 2.2 Ticket Sales Context

```
Responsabilidade Principal:
├─ Criar modelos de ingresso
├─ Gerenciar preços por setor
├─ Controlar disponibilidade
└─ Registrar vendas (compra de tickets)

Agregado: TICKET MODEL
├─ ID: UUID
├─ event: Event (reference)
├─ ticketLocation: TicketLocation (PISTA, VIP, CAMAROTE)
├─ price: Double (> 0)
├─ ticketsAvailable: Integer (≥ 1)
├─ ticketsSold: Integer
├─ expired: Boolean
└─ userTickets: List<UserTicket> (composição)

CLIENTE NESTE CONTEXTO: TICKET BUYER (Comprador)
Significado: Pessoa que compra/reserva ingressos (pode ser mesmo user do Event Mgmt, mas papel diferente)
```

### 2.3 Ticket Redemption Context

```
Responsabilidade Principal:
├─ Validar e consumir ingressos
├─ Rastrear status do ingresso
├─ Permitir cancelamento
└─ Controlar presença no evento

Agregado: USER TICKET
├─ ID: UUID
├─ user: User (reference)
├─ event: Event (reference)
├─ ticketModel: TicketModel (reference)
├─ status: TicketStatus (VALIDO, RESGATADO, CANCELADO, EXPIRADO)
├─ createdAt: LocalDateTime
└─ updatedAt: LocalDateTime

CLIENTE NESTE CONTEXTO: EVENT ATTENDEE (Participante)
Significado: Pessoa presente no evento que apresenta seu ingresso para validação
```

### 2.4 User Management Context

```
Responsabilidade Principal:
├─ Registrar usuários
├─ Autenticar usuários
├─ Controlar papéis (roles)
└─ Gerenciar autorização

Agregado: USER
├─ ID: UUID
├─ name: String
├─ email: String (unique, valid)
├─ password: String (hashed)
├─ role: Role (CUSTOMER, ADMIN)
├─ createdEvents: List<Event>
└─ userTickets: List<UserTicket>

CLIENTE NESTE CONTEXTO: SYSTEM USER (Usuário do Sistema)
Significado: Qualquer pessoa interagindo com o sistema (pode ter múltiplos papéis em outros contextos)
```

---

## 3. AGREGADOS COM INVARIANTES

### 3.1 Agregado EVENT

```
┌─────────────────────────────────────────────────┐
│ AGREGADO RAIZ: Event                            │
├─────────────────────────────────────────────────┤
│ Raiz:        Event                              │
│ Entidades:   TicketModel[] (via userTickets)   │
│              UserTicket[] (composição)          │
│ Value Objs:  EventStatus (enum)                │
└─────────────────────────────────────────────────┘

INVARIANTES:
✓ title ≠ null ∧ length(title) ∈ [3, 150]
✓ description ≠ null ∧ length(desc) ∈ [10, 1000]
✓ eventDate > LocalDateTime.now() (quando criado)
✓ status ∈ {UPCOMING, ONGOING, COMPLETED, CANCELED}
✓ creator ≠ null ∧ creator.isValid()
✓ title é UNIQUE na plataforma
✓ active = true ↔ pode vender tickets
✓ imageUrl ≠ null ∧ válido

REGRAS DE NEGÓCIO PROTEGIDAS:
→ Evento só criado por User autenticado (creator)
→ Não pode alterar eventDate após criação
→ Status UPCOMING garante que ingressos podem ser vendidos
→ Status COMPLETED/CANCELED impede novas vendas
→ Se CANCELED, relacionados UserTickets devem ser cancelados
```

**Arquivo**: [back-end/src/main/java/com/ffqts/arenape/domain/models/event/Event.java](back-end/src/main/java/com/ffqts/arenape/domain/models/event/Event.java)

---

### 3.2 Agregado TICKET MODEL

```
┌─────────────────────────────────────────────────┐
│ AGREGADO RAIZ: TicketModel                      │
├─────────────────────────────────────────────────┤
│ Raiz:        TicketModel                        │
│ Entidades:   UserTicket[] (composição)          │
│ Value Objs:  TicketLocation (enum)              │
│              price (Double)                     │
└─────────────────────────────────────────────────┘

INVARIANTES:
✓ price > 0 (sempre deve ser positivo)
✓ ticketsAvailable ≥ 1 (mínimo de ingresso)
✓ ticketsSold ≥ 0
✓ ticketsSold ≤ ticketsAvailable (nunca vende mais)
✓ event ≠ null ∧ event.status = UPCOMING
✓ ticketLocation ∈ {PISTA, VIP, CAMAROTE}
✓ ticketLocation é UNIQUE por evento (um setor = uma linha no BD)
✓ Se expired = true, nenhuma venda nova

REGRAS DE NEGÓCIO PROTEGIDAS:
→ Garante que não há venda de tickets sem disponibilidade
→ ticketsAvailable - ticketsSold = realmente disponível para venda
→ Preço não pode mudar após primeira venda iniciada
→ Cada setor (PISTA/VIP/CAMAROTE) é único por evento
→ TicketModel só criado quando event.status = UPCOMING
→ Quando ticketsSold = ticketsAvailable → SOLD OUT
```

**Arquivo**: [back-end/src/main/java/com/ffqts/arenape/domain/models/ticket/TicketModel.java](back-end/src/main/java/com/ffqts/arenape/domain/models/ticket/TicketModel.java)

---

### 3.3 Agregado USER TICKET

```
┌─────────────────────────────────────────────────┐
│ AGREGADO RAIZ: UserTicket                       │
├─────────────────────────────────────────────────┤
│ Raiz:        UserTicket                         │
│ Entidades:   (nenhuma)                          │
│ Value Objs:  TicketStatus (enum)                │
└─────────────────────────────────────────────────┘

INVARIANTES:
✓ user ≠ null ∧ user.isValid()
✓ event ≠ null ∧ event.isValid()
✓ ticketModel ≠ null ∧ ticketModel.isValid()
✓ status ∈ {VALIDO, RESGATADO, CANCELADO, EXPIRADO}
✓ status.inicial = VALIDO (sempre começa válido)
✓ Transições válidas de status:
  - VALIDO → RESGATADO (apenas no dia do evento)
  - VALIDO → CANCELADO (antes do evento)
  - VALIDO → EXPIRADO (após evento)
  - RESGATADO → sem mudança (terminal)
  - CANCELADO → sem mudança (terminal)
  - EXPIRADO → sem mudança (terminal)
✓ Um UserTicket SÓ resgatado UMA VEZ
✓ Um UserTicket SÓ cancelado UMA VEZ

REGRAS DE NEGÓCIO PROTEGIDAS:
→ Um ingresso (ticket) só é consumido/resgatado uma única vez
→ Apenas o dono (user) ou ADMIN podem cancelar
→ Cancelamento gera devolução de dinheiro (implementado em CancelUserTicketService)
→ Tickets expirados (após evento) não podem ser resgatados
→ Auditoria completa: createdAt e updatedAt rastreiam mudanças
→ Não pode transferir ticket entre usuários
```

**Arquivo**: [back-end/src/main/java/com/ffqts/arenape/domain/models/ticket/UserTicket.java](back-end/src/main/java/com/ffqts/arenape/domain/models/ticket/UserTicket.java)

---

### 3.4 Agregado USER

```
┌─────────────────────────────────────────────────┐
│ AGREGADO RAIZ: User                             │
├─────────────────────────────────────────────────┤
│ Raiz:        User                               │
│ Entidades:   Event[] (eventos criados)          │
│              UserTicket[] (ingressos possuídos)  │
│ Value Objs:  Role (enum)                        │
└─────────────────────────────────────────────────┘

INVARIANTES:
✓ email ≠ null ∧ isValidEmail(email)
✓ email é UNIQUE na plataforma
✓ name ≠ null ∧ length(name) > 0
✓ password ≠ null ∧ isHashed (nunca plain-text)
✓ role ∈ {CUSTOMER, ADMIN}
✓ Um User tem EXATAMENTE UM role
✓ createdAt ≤ updatedAt (sempre)

REGRAS DE NEGÓCIO PROTEGIDAS:
→ Novo usuário criado sempre com role = CUSTOMER
→ Apenas ADMIN pode promover outro para ADMIN
→ ADMIN tem permissões maiores (ex: cancelar ticket de outro)
→ Login necessário para comprar e gerenciar tickets
→ Senha protegida com hash (BCrypt/Spring Security)
→ Email verificado antes de ativar (não implementado mas é considerado)
```

**Arquivo**: [back-end/src/main/java/com/ffqts/arenape/domain/models/user/User.java](back-end/src/main/java/com/ffqts/arenape/domain/models/user/User.java)

---

## 4. ESTRUTURA CLEAN ARCHITECTURE (IMPLEMENTADA)

### 4.1 Camadas Implementadas

```
┌────────────────────────────────────────────────────┐
│         PRESENTATION LAYER                         │
│  (Controllers, DTOs, REST API)                     │
│  - EventController.java                            │
│  - TicketController.java                           │
│  - UserController.java                             │
│  - presentation/dto/ (Request/Response)            │
└────────────────────────────────────────────────────┘
              ↕ HTTP / JSON
┌────────────────────────────────────────────────────┐
│      APPLICATION LAYER                             │
│  (Use Cases, Services, Orchestration)              │
│  - CreateEventService                              │
│  - AssignUserTicketsService                        │
│  - ConsumeUserTicketService                        │
│  - etc...                                           │
└────────────────────────────────────────────────────┘
              ↕ Domain Models
┌────────────────────────────────────────────────────┐
│         DOMAIN LAYER                               │
│  (Business Rules, Entities, Aggregates)            │
│  - Event.java (Entity)                             │
│  - TicketModel.java (Entity)                       │
│  - UserTicket.java (Entity)                        │
│  - domain/services/ (Interfaces)                   │
└────────────────────────────────────────────────────┘
              ↕ Repositories
┌────────────────────────────────────────────────────┐
│    INFRASTRUCTURE LAYER                            │
│  (Repositories, DB, Security, External Services)   │
│  - EventRepository.java (JPA)                      │
│  - TicketModelRepository.java (JPA)                │
│  - UserTicketRepository.java (JPA)                 │
│  - PostgreSQL (Database)                           │
│  - SecurityFilter, JwtTokenProvider                │
└────────────────────────────────────────────────────┘
```

### 4.2 Mapeamento Concreto - O Que Existe

#### PRESENTATION LAYER
```
presentation/
├── controllers/
│   ├── EventController.java
│   │   ├── POST   /api/events → create
│   │   ├── PUT    /api/events/{id} → update
│   │   ├── GET    /api/events → list all
│   │   ├── GET    /api/events/{id} → get one
│   │   └── DELETE /api/events/{id} → delete
│   │
│   ├── TicketController.java
│   │   ├── POST /api/tickets/models → create ticket model
│   │   ├── POST /api/tickets/purchase → buy tickets (assign)
│   │   ├── POST /api/tickets/consume/{id} → redeem ticket
│   │   ├── POST /api/tickets/{id}/cancel → cancel ticket
│   │   └── GET /api/tickets/user/{userId} → list user tickets
│   │
│   └── UserController.java (Auth & Profile)
│
└── dto/
    ├── event/
    │   ├── NewEventForm.java
    │   ├── EventResponseDTO.java
    │   ├── TicketSectorDTO.java
    │   └── ...
    │
    ├── ticket/
    │   ├── NewTicketModelForm.java
    │   ├── UserTicketResponseDTO.java
    │   ├── ConsumeTicketResponseDTO.java
    │   └── ...
    │
    ├── user/
    │   ├── RegisterForm.java
    │   ├── LoginRequest.java
    │   ├── LoginResponse.java
    │   └── ...
    │
    └── statistics/ (Analytics DTOs)
```

#### APPLICATION LAYER
```
application/
├── event/
│   ├── CreateEventService.java
│   │   └─ Implementa: ICreateEvent
│   │   └─ Responsabilidades:
│   │      • Validar dados (title, date, etc)
│   │      • Verificar se title já existe
│   │      • Buscar creator (User) por email
│   │      • Criar Event
│   │      • Salvar Event via repository
│   │      • Criar TicketModels associados
│   │
│   ├── UpdateEventService.java
│   ├── GetEventsService.java
│   ├── GetUserPurchasedEventsService.java
│   └── DeleteEventService.java
│
├── tickets/
│   ├── model/
│   │   ├── CreateTicketModelService.java
│   │   │   └─ Implementa: ICreateTicketModel
│   │   │   └─ Responsabilidades:
│   │   │      • Validar Event existe
│   │   │      • Validar price > 0
│   │   │      • Criar TicketModel
│   │   │      • Salvar via repository
│   │   │
│   │   ├── UpdateTicketModelService.java
│   │   ├── GetTicketModelsService.java
│   │   └── DeactivateTicketModelService.java
│   │
│   └── user/
│       ├── AssignUserTicketsService.java
│       │   └─ Implementa: IAssignUserTicketsService
│       │   └─ Responsabilidades:
│       │      • Validar User existe
│       │      • Validar TicketModel existe
│       │      • Validar quantity > 0
│       │      • Validar disponibilidade (quantity ≤ available)
│       │      • Criar UserTicket(s) para cada ingresso
│       │      • Incrementar ticketsSold
│       │      • Salvar alterações
│       │
│       ├── ConsumeUserTicketService.java
│       │   └─ Implementa: IConsumeUserTicketService
│       │   └─ Responsabilidades:
│       │      • Validar UserTicket existe
│       │      • Validar status = VALIDO
│       │      • Marcar como RESGATADO
│       │      • Salvar mudança de status
│       │
│       ├── CancelUserTicketService.java
│       │   └─ Implementa: ICancelUserTicketService
│       │   └─ Responsabilidades:
│       │      • Validar UserTicket existe
│       │      • Validar permissões (owner ou ADMIN)
│       │      • Marcar como CANCELADO
│       │      • Salvar mudança de status
│       │
│       └── GetUserTicketsService.java
│
├── auth/
│   ├── AuthenticationService.java
│   ├── TokenService.java
│   └── PasswordEncoderService.java
│
├── category/
│   ├── CreateCategoryService.java
│   ├── GetCategoryService.java
│   └── ListCategoriesService.java
│
└── statistics/
    ├── CalculateEventStatisticsService.java
    ├── CalculateTicketSalesService.java
    └── GenerateReportService.java
```

#### DOMAIN LAYER
```
domain/
├── models/
│   ├── BaseEntity.java
│   │   └─ Superclass para todas entidades
│   │   └─ createdAt, updatedAt (@CreationTimestamp, @UpdateTimestamp)
│   │
│   ├── event/
│   │   ├── Event.java (AGREGADO RAIZ)
│   │   ├── EventStatus.java (enum: UPCOMING, ONGOING, COMPLETED, CANCELED)
│   │   ├── Category.java (ENTIDADE)
│   │   └─ @Entity mappings: @Table(name="events"), @Column validações
│   │
│   ├── ticket/
│   │   ├── TicketModel.java (AGREGADO RAIZ)
│   │   ├── UserTicket.java (AGREGADO RAIZ)
│   │   ├── TicketStatus.java (enum: VALIDO, RESGATADO, CANCELADO, EXPIRADO)
│   │   └── TicketLocation.java (enum: PISTA, VIP, CAMAROTE)
│   │   └─ @Entity mappings com validações
│   │
│   └── user/
│       ├── User.java (AGREGADO RAIZ)
│       ├── Role.java (enum: CUSTOMER, ADMIN)
│       └─ Implementa UserDetails (Spring Security)
│
├── services/ (INTERFACES - Contratos)
│   ├── event/
│   │   └── ICreateEvent.java (interface)
│   │
│   ├── tickets/
│   │   ├── model/
│   │   │   └── ICreateTicketModel.java (interface)
│   │   │
│   │   └── user/
│   │       ├── IAssignUserTicketsService.java (interface)
│   │       ├── IConsumeUserTicketService.java (interface)
│   │       └── ICancelUserTicketService.java (interface)
│   │
│   ├── category/
│   │   └── ICategoryService.java (interface)
│   │
│   └── auth/
│       └── IAuthService.java (interface)
│
└── repositories/ (INTERFACES - Abstrações)
    ├── IEventRepository.java (interface abstrata)
    ├── ITicketModelRepository.java (interface abstrata)
    ├── IUserTicketRepository.java (interface abstrata)
    ├── IUserRepository.java (interface abstrata)
    └── ICategoryRepository.java (interface abstrata)
```

#### INFRASTRUCTURE LAYER
```
infrastructure/
├── repositories/ (IMPLEMENTAÇÕES CONCRETAS)
│   ├── EventRepository.java (extends JpaRepository<Event, UUID>)
│   ├── TicketModelRepository.java (extends JpaRepository<TicketModel, UUID>)
│   ├── UserTicketRepository.java (extends JpaRepository<UserTicket, UUID>)
│   ├── UserRepository.java (extends JpaRepository<User, UUID>)
│   └── CategoryRepository.java (extends JpaRepository<Category, Long>)
│   └─ Implementam Spring Data JPA
│   └─ Customizadas com @Query methods
│
├── security/
│   ├── SecurityFilter.java
│   │   └─ Filtra requisições HTTP
│   │   └─ Valida JWT tokens em headers
│   │
│   └── SecurityConfig (configuration do Spring Security)
│       └─ Define qual repository usar para UserDetails
│       └─ Configura password encoder (BCrypt)
│
└── (PostgreSQL database connection via application.properties)
```

### 4.3 Fluxo Real: Comprar Ingresso (Assign Ticket)

```
[1] PRESENTATION LAYER
    ├─ Request HTTP POST /api/tickets/purchase
    │  {
    │    "ticketModelId": "uuid-123",
    │    "quantity": 2,
    │    "userEmail": "user@email.com"
    │  }
    │
    └─ TicketController mapeia para DTO
       └─ Chama: assignUserTicketsService.assign(...)

[2] APPLICATION LAYER
    ├─ AssignUserTicketsService.assign()
    │
    │  Passo 1: Validações básicas
    │  └─ Validar userEmail existe → userRepository.findUserByEmail()
    │  └─ Validar ticketModelId existe → ticketModelRepository.findById()
    │  └─ Validar event existe → eventRepository.findById()
    │
    │  Passo 2: Validações de negócio
    │  └─ Validar event.status = UPCOMING (só vende em UPCOMING)
    │  └─ Validar quantity > 0
    │  └─ Validar disponibilidade:
    │     disponivel = ticketModel.ticketsAvailable - userTicketRepository.countByTicketModel_Id(ticketModelId)
    │     Se quantity > disponível → throw exception
    │
    │  Passo 3: Execução (TRANSACTIONAL)
    │  └─ Loop quantity times:
    │     ├─ Criar UserTicket(user, ticketModel, event)
    │     ├─ userTicketRepository.save(userTicket)
    │     ├─ Incrementar ticketModel.ticketsSold++
    │     └─ ticketModelRepository.save(ticketModel)

[3] DOMAIN LAYER (Validações de Invariantes)
    ├─ Ao criar UserTicket():
    │  └─ status = VALIDO (invariante)
    │
    ├─ Ao criar TicketModel:
    │  └─ price > 0 (verificado em constructor)
    │  └─ ticketsAvailable ≥ 1
    │
    └─ Ao persistir Event:
       └─ title unique (constraint DB)
       └─ eventDate > now()
       └─ creator ≠ null

[4] INFRASTRUCTURE LAYER
    ├─ userRepository.findUserByEmail()
    │  └─ Spring Data JPA executa query no PostgreSQL
    │
    ├─ ticketModelRepository.findById()
    │  └─ Query SELECT FROM ticket_models WHERE id = ?
    │
    ├─ eventRepository.findById()
    │  └─ Query SELECT FROM events WHERE id = ?
    │
    ├─ userTicketRepository.countByTicketModel_Id()
    │  └─ Query COUNT(*) FROM user_tickets WHERE ticket_model_id = ?
    │
    ├─ userTicketRepository.save() [Loop]
    │  └─ INSERT INTO user_tickets (user_id, ticket_model_id, event_id, status, ...)
    │
    └─ ticketModelRepository.save()
       └─ UPDATE ticket_models SET tickets_sold = ? WHERE id = ?

[5] RESPONSE BACK
    └─ Response HTTP 200 OK com UserTicketResponseDTO
       {
         "id": "uuid-456",
         "userId": "uuid-789",
         "eventId": "uuid-123",
         "status": "VALIDO",
         "createdAt": "2024-10-01T10:30:00"
       }
```

---

## 5. MATRIZ DE COMUNICAÇÃO ENTRE CAMADAS

| Camada | Framework | Spring Bean | O Que Faz |
|--------|-----------|-----------|-----------|
| **Presentation** | Spring Web MVC | @RestController | Recebe HTTP, mapeia DTOs |
| **Application** | Spring Core | @Service, @Transactional | Orquestra use cases |
| **Domain** | JPA/Hibernate | @Entity | Define regras de negócio |
| **Infrastructure** | Spring Data JPA | @Repository | Acessa BD (PostgreSQL) |

---

## 6. RESUMO DO QUE ESTÁ IMPLEMENTADO

✅ **Implementado:**
- 4 Bounded Contexts claros
- 4 Agregados bem definidos (Event, TicketModel, UserTicket, User)
- Invariantes protegidas nos constructores/setters
- Camada Presentation com Controllers e DTOs
- Camada Application com Services/Use Cases
- Camada Domain com Entities e Service Interfaces
- Camada Infrastructure com Repositories (Spring Data JPA)
- Validações em múltiplas camadas
- Transações (@Transactional)
- Spring Security com JWT

❌ **NÃO Implementado (Fora do Escopo Atual):**
- Domain Events publicação/subscrição
- Value Objects explícitos (além de enums)
- CQRS
- Event Sourcing
- Repository Interfaces abstratas no Domain (usam Spring Data JPA direto)

