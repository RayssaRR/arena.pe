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
- [Screencast](https://www.youtube.com/watch?v=cgpgLJQdCh0)

### Entrega 2

- [Screencast](https://www.youtube.com/watch?v=yutaZgf71wg&feature=youtu.be)

## Contribuidores

- Emanoel Henrick Alves da Silva - [emanoelhenrick](https://github.com/emanoelhenrick)
- Felipe Lopes Vasconcelos - [FelipeLV12](https://github.com/FelipeLV12)
- Jennifer Zeferino Cruz de Lima - [injuje](https://github.com/injuje)
- José Leandro Ventura Rocha da Silva - [jenniferzeferino](https://github.com/jenniferzeferino)
- Raiele Leite da Silva - [RaieleLeite](https://github.com/RaieleLeite)
- Rayssa Santana Ribeiro - [RayssaRR](https://github.com/RayssaRR)
