# Documentação da API - Calendário de Eventos

## Visão Geral

Esta documentação descreve todas as rotas da API do calendário de eventos, incluindo autenticação, gerenciamento de usuários, eventos, comentários e utilitários.

O sistema é um calendário compartilhado de uso geral: qualquer pessoa pode criar uma conta, criar eventos, convidar outros usuários como participantes, organizar os eventos com tags livres e uma cor, e trocar comentários. Cada usuário enxerga apenas os eventos dos quais é criador ou participante.

## Base URL

```
http://localhost:8080/api
```

## Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. A maioria das rotas requer um token válido no header `Authorization: Bearer <token>`.

Não há papéis de usuário nem fluxo de aprovação: ao se registrar, o usuário já pode fazer login imediatamente.

---

## 1. Autenticação (`/api/auth`)

### 1.1 Login
**POST** `/api/auth/login`

Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "token": "jwt_token_here",
  "id": 1,
  "username": "string",
  "message": null
}
```

**Resposta de Erro (400):**
```json
{
  "message": "Credenciais inválidas"
}
```

### 1.2 Registro
**POST** `/api/auth/register`

Registra um novo usuário. O usuário já pode fazer login logo em seguida.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Usuário registrado com sucesso. Você já pode fazer login."
}
```

**Resposta de Erro (400):**
```json
{
  "message": "Mensagem de erro específica"
}
```

### 1.3 Teste da API
**GET** `/api/auth/test`

Testa se a API de autenticação está funcionando.

**Resposta (200):**
```
"API de autenticação funcionando!"
```

---

## 2. Usuários (`/api/users`)

### 2.1 Buscar Usuário por ID
**GET** `/api/users/{id}`

Busca os dados de um usuário. Permitido apenas para o próprio usuário autenticado.

**Parâmetros:**
- `id` (path): ID do usuário

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "phone": "string"
}
```

**Resposta de Erro (404):** Usuário não encontrado

### 2.2 Atualizar Usuário
**PUT** `/api/users/{id}`

Atualiza os dados do próprio usuário (email, telefone e senha).

**Parâmetros:**
- `id` (path): ID do usuário

**Body:**
```json
{
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "phone": "string"
}
```

**Resposta de Erro (400):** Erro ao atualizar usuário

### 2.3 Resumo de Usuários
**GET** `/api/users/summary`

Lista todos os usuários em formato resumido. Usado para selecionar participantes ao criar ou editar um evento.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string"
  }
]
```

---

## 3. Eventos (`/api/events`)

Um usuário só pode visualizar, comentar ou gerenciar membros de um evento se for o criador ou um participante dele. Apenas o criador pode editar ou excluir o evento.

### 3.1 Criar Evento
**POST** `/api/events`

Cria um novo evento. O usuário autenticado se torna o organizador. As `tags` são livres (texto) e a `color` define a cor do evento no calendário e nos detalhes.

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "tags": ["reunião", "trabalho"],
  "color": "#1976d2",
  "date": "2026-01-01T10:00:00",
  "memberIds": [1, 2, 3]
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "tags": ["reunião", "trabalho"],
  "color": "#1976d2",
  "date": "2026-01-01T10:00:00",
  "organizer": {
    "id": 1,
    "username": "string"
  },
  "members": [],
  "comments": []
}
```

**Resposta de Erro (400):** Erro ao criar evento

### 3.2 Listar Eventos do Usuário
**GET** `/api/events`

Lista os eventos em que o usuário autenticado é criador ou participante.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "tags": ["reunião"],
    "color": "#1976d2",
    "date": "2026-01-01T10:00:00",
    "organizer": {
      "id": 1,
      "username": "string"
    },
    "members": [],
    "comments": []
  }
]
```

**Resposta de Erro (400):** Erro ao buscar eventos

### 3.3 Buscar Evento por ID
**GET** `/api/events/{id}`

Busca um evento específico. Disponível apenas para o criador ou participantes.

**Parâmetros:**
- `id` (path): ID do evento

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "tags": ["reunião"],
  "color": "#1976d2",
  "date": "2026-01-01T10:00:00",
  "organizer": {
    "id": 1,
    "username": "string"
  },
  "members": [],
  "comments": []
}
```

**Resposta de Erro (404):** Evento não encontrado ou sem permissão

### 3.4 Listar Membros do Evento
**GET** `/api/events/{id}/members`

Lista os participantes de um evento.

**Parâmetros:**
- `id` (path): ID do evento

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "string"
    }
  }
]
```

**Resposta de Erro (404):** Evento não encontrado

### 3.5 Atualizar Evento
**PUT** `/api/events/{id}`

Atualiza os dados de um evento. Apenas o criador pode editar.

**Parâmetros:**
- `id` (path): ID do evento

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "tags": ["reunião", "importante"],
  "color": "#d32f2f",
  "date": "2026-01-01T10:00:00"
}
```

**Resposta de Sucesso (200):** Evento atualizado (mesmo formato de [3.3](#33-buscar-evento-por-id))

**Resposta de Erro (400):** Erro ao atualizar evento

### 3.6 Excluir Evento
**DELETE** `/api/events/{id}`

Remove um evento. Apenas o criador pode excluir.

**Parâmetros:**
- `id` (path): ID do evento

**Resposta de Sucesso (200):** Sem conteúdo

**Resposta de Erro (400):** Erro ao excluir evento

### 3.7 Adicionar Membro ao Evento
**POST** `/api/events/{eventId}/members/{userId}`

Adiciona um usuário como participante de um evento.

**Parâmetros:**
- `eventId` (path): ID do evento
- `userId` (path): ID do usuário

**Resposta de Sucesso (200):** Evento atualizado (mesmo formato de [3.3](#33-buscar-evento-por-id))

**Resposta de Erro (400):** Erro ao adicionar membro

### 3.8 Remover Membro do Evento
**DELETE** `/api/events/{eventId}/members/{userId}`

Remove um participante de um evento.

**Parâmetros:**
- `eventId` (path): ID do evento
- `userId` (path): ID do usuário

**Resposta de Sucesso (200):** Sem conteúdo

**Resposta de Erro (400):** Erro ao remover membro

---

## 4. Comentários (`/api/events/{id}/comments`)

Comentários ficam vinculados a um evento. Qualquer participante (ou o criador) pode listar e adicionar comentários. Apenas o autor pode excluir o próprio comentário.

### 4.1 Listar Comentários
**GET** `/api/events/{id}/comments`

Lista os comentários de um evento, em ordem cronológica.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "content": "Confirmado presença!",
    "author": {
      "id": 2,
      "username": "string"
    },
    "createdAt": "2026-01-01T12:00:00"
  }
]
```

### 4.2 Adicionar Comentário
**POST** `/api/events/{id}/comments`

Adiciona um comentário ao evento.

**Body:**
```json
{
  "content": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "content": "string",
  "author": {
    "id": 2,
    "username": "string"
  },
  "createdAt": "2026-01-01T12:00:00"
}
```

### 4.3 Excluir Comentário
**DELETE** `/api/events/{id}/comments/{commentId}`

Remove um comentário. Apenas o autor pode excluir.

**Parâmetros:**
- `id` (path): ID do evento
- `commentId` (path): ID do comentário

**Resposta de Sucesso (200):** Sem conteúdo

**Resposta de Erro (400):** Erro ao excluir comentário

---

## 5. Utilitários (`/api/util`)

### 5.1 Gerar Hash de Senha
**POST** `/api/util/hash`

Gera um hash BCrypt para uma senha fornecida.

**Body:**
```json
{
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "hash": "bcrypt_hash_here"
}
```

---

## Códigos de Status HTTP

- **200 OK:** Requisição bem-sucedida
- **400 Bad Request:** Dados inválidos ou erro na requisição
- **401 Unauthorized:** Token inválido ou ausente
- **403 Forbidden:** Permissão insuficiente
- **404 Not Found:** Recurso não encontrado
- **500 Internal Server Error:** Erro interno do servidor

## Modelo de Dados

### Usuário
- `id`, `username`, `email`, `phone`

### Evento
- `id`, `title`, `description`
- `tags`: lista de textos livres
- `color`: cor em hexadecimal (ex.: `#1976d2`)
- `date`: data e hora do evento
- `organizer`: usuário criador
- `members`: participantes
- `comments`: comentários

### Comentário
- `id`, `content`, `author`, `createdAt`

## Regras de Visibilidade

- Um usuário só vê os eventos em que é criador ou participante.
- Apenas o criador pode editar ou excluir o evento.
- Qualquer participante pode comentar; apenas o autor exclui o próprio comentário.

## CORS

A API está configurada para aceitar requisições de qualquer origem (`*`).
