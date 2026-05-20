# Arena.PE

Aplicação Full Stack para gerenciamento, divulgação e análise de eventos realizados na Arena Pernambuco, conectando cidadãos, organizadores e administradores por meio de uma plataforma web moderna.

## Sobre o Projeto

O Arena.PE é uma aplicação web que tem como objetivo aumentar a utilização da Arena Pernambuco, facilitando a divulgação de eventos, a participação da população e a gestão administrativa do espaço.

A plataforma permite que cidadãos descubram eventos, reservem ingressos e agendem visitas, enquanto organizadores e administradores podem cadastrar eventos, acompanhar estatísticas e gerenciar o uso da infraestrutura.

## Tecnologias Utilizadas
### Backend

- Java 25
- Spring Boot
- Spring Data JPA
- Hibernate
- API REST
- Maven

### Frontend

- React 18+
- TypeScript
- Tailwind

### Banco de Dados

- MySQL 

## Arquitetura

O backend segue o padrão de arquitetura em camadas:

- Controller
- Service
- Repository
- Model

### Fluxo interno da aplicação:

Controller → Service → Repository → Database

A comunicação entre frontend e backend ocorre por meio de requisições HTTP utilizando JSON.

## Funcionalidades
### Autenticação

- Cadastro de usuários
- Controle de perfis de acesso
- Gerenciamento de usuários pelo administrador

### Eventos

- Cadastro de eventos
- Edição de eventos
- Cancelamento de eventos
- Visualização pública da programação
- Filtros por categoria, data e status
- Ordenação por data ou popularidade

###  Ingressos

- Reserva simulada de ingressos
- Controle de capacidade dos eventos
- Visualização e cancelamento de reservas

## Entregas
### Entrega 1

- [Histórias de Usuário](https://docs.google.com/document/d/1xkyBUIlEBqiuUwNKGcrFDna4Z5a3j3zyPY98hnlMEkU/edit?tab=t.0#heading=h.o4dna26bryia)
- [Screencast 1](https://www.youtube.com/watch?v=cgpgLJQdCh0)

### Entrega 2

- [Screencast 2](https://www.youtube.com/watch?v=yutaZgf71wg&feature=youtu.be)
- **Issue/bug tracker:**
<img width="1209" height="289" alt="Issue_Bug_Tracker" src="https://github.com/user-attachments/assets/c00119b9-3564-4f37-9d31-0d42770ea220" />

### Entrega 3

- [Screencast 3](https://www.youtube.com/watch?v=HychS5vl9x0)
- **Issue/bug tracker:**
<img width="1073" height="200" alt="Captura de tela 2026-05-17 231143" src="https://github.com/user-attachments/assets/b1ecade4-d27e-492c-9ca2-a3fc38d9a14a" />

### Entrega 4

- [Screencast 4]()
- **Issue/bug tracker:**
<img width="1072" height="274" alt="Captura de tela 2026-05-17 231203" src="https://github.com/user-attachments/assets/d7ac0f48-f7e1-47bf-81f5-ee64d25c09bc" />

## Como Clonar e Executar o Projeto:

### Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

| Ferramenta | Versão mínima | Link para instalação |
|------------|---------------|----------------------|
| Git | Qualquer recente | https://git-scm.com/downloads |
| Docker | 20.x ou superior | https://docs.docker.com/get-docker/ |
| Docker Compose | v2.x (já incluso no Docker Desktop) | https://docs.docker.com/compose/install/ |

> **Dica:** Para verificar se as ferramentas estão instaladas corretamente, execute no terminal:
> ```bash
> git --version
> docker --version
> docker compose version
> ```

---

### 1. Clonar o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/RayssaRR/arena.pe.git
```

Em seguida, entre na pasta do projeto:

```bash
cd arena.pe
```

A estrutura de pastas será:

```
arena.pe/
├── back-end/          # API Java Spring Boot
├── front-end/         # Interface React + TypeScript
├── docker-compose.yml # Orquestração dos containers
└── README.md
```

---

### 2. Subir os Containers com Docker Compose

Com o terminal na raiz do projeto (pasta `arena.pe`), execute:

```bash
docker compose up
```

O Docker irá baixar as imagens necessárias e iniciar os três serviços na seguinte ordem:

1. **MySQL** (`arena_mysql`) — banco de dados na porta `3306`
2. **Back-end** (`arena_backend`) — API Spring Boot na porta `8080`
3. **Front-end** (`arena_frontend`) — aplicação React na porta `3000`

> **Atenção:** Na primeira execução, o processo pode demorar alguns minutos, pois o Docker precisa baixar as imagens e o Maven/NPM precisam baixar as dependências do projeto.

### Executar em segundo plano (modo detached)

Se preferir liberar o terminal após iniciar, use a flag `-d`:

```bash
docker compose up -d
```

---

### 3. Acessar a Aplicação

Após os containers subirem, acesse:

| Serviço | Endereço |
|---------|----------|
| **Front-end (interface web)** | http://localhost:3000 |
| **Back-end (API REST)** | http://localhost:8080 |
| **Banco de dados MySQL** | `localhost:3306` |

---

### 4. Verificar o Status dos Containers

Para checar se todos os serviços estão rodando corretamente:

```bash
docker compose ps
```

Você verá uma saída parecida com:

```
NAME              IMAGE                          STATUS
arena_mysql       mysql:8.4                      Up (healthy)
arena_backend     maven:3.9-eclipse-temurin-25   Up
arena_frontend    node:22-alpine                 Up
```

Para acompanhar os logs em tempo real:

```bash
docker compose logs -f
```

Para ver os logs de um serviço específico:

```bash
docker compose logs -f back-end
docker compose logs -f front-end
docker compose logs -f mysql
```

---

### 5. Parar os Containers

Para interromper a execução (mantendo os dados do banco):

```bash
docker compose down
```

Para parar **e remover todos os dados** (volumes incluídos):

```bash
docker compose down -v
```

> O comando com `-v` apaga o banco de dados e todos os uploads armazenados. Use com cautela.

---

### 6. Informações do Banco de Dados

O banco MySQL é configurado automaticamente pelo Docker Compose com as seguintes credenciais:

| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Porta | `3306` |
| Banco | `arena` |
| Usuário | `arena` |
| Senha | `arena123` |
| Senha root | `root` |

---

### 7. Solução de Problemas Comuns

**Porta já em uso:**
Se alguma das portas `3306`, `8080` ou `3000` já estiver ocupada, pare o serviço local que a usa ou edite o `docker-compose.yml` para mapear para portas diferentes.

**Back-end não conecta ao banco:**
O back-end aguarda o MySQL estar saudável (`healthcheck`) antes de iniciar. Se o banco demorar para subir, o Spring Boot pode tentar reconectar automaticamente. Aguarde alguns instantes ou reinicie com `docker compose restart back-end`.

**Permissão negada no Docker (Linux):**
Adicione seu usuário ao grupo `docker`:
```bash
sudo usermod -aG docker $USER
```
Depois, reinicie a sessão do terminal.

---

### Usuário ADMIN

O sistema possui um usuário do tipo administrador padrão com as seguintes credenciais:

| Email | Senha |
|-------|-------|
| admin@arena.pe | `admin123` |

---

### Tecnologias dos Containers

| Serviço | Imagem Docker |
|---------|--------------|
| Banco de dados | `mysql:8.4` |
| Back-end | `maven:3.9-eclipse-temurin-25` |
| Front-end | `node:22-alpine` |

## Contribuidores

- Emanoel Henrick Alves da Silva - [emanoelhenrick](https://github.com/emanoelhenrick)
- Felipe Lopes Vasconcelos - [FelipeLV12](https://github.com/FelipeLV12)
- Jennifer Zeferino Cruz de Lima - [jenniferzeferino](https://github.com/jenniferzeferino)
- José Leandro Ventura Rocha da Silva - [injuje](https://github.com/injuje)
- Raiele Leite da Silva - [RaieleLeite](https://github.com/RaieleLeite)
- Rayssa Santana Ribeiro - [RayssaRR](https://github.com/RayssaRR)
