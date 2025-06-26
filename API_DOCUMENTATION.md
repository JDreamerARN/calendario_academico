# Documentação da API - Sistema de Eventos Acadêmicos

## Visão Geral

Esta documentação descreve todas as rotas da API do sistema de eventos acadêmicos, incluindo autenticação, gerenciamento de usuários, eventos e utilitários.

## Base URL

```
http://localhost:8080/api
```

## Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. A maioria das rotas requer um token válido no header `Authorization: Bearer <token>`.

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
  "username": "string",
  "userType": "ALUNO|PROFESSOR|ADMINISTRADOR"
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

Registra um novo usuário no sistema.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "registrationNumber": "string",
  "userType": "ALUNO|PROFESSOR|ADMINISTRADOR"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Usuário registrado com sucesso. Aguarde aprovação do administrador."
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

## 2. Gerenciamento de Usuários (`/api/users`)

### 2.1 Listar Todos os Usuários
**GET** `/api/users`

Lista todos os usuários do sistema.

**Permissão:** ADMINISTRADOR

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string",
    "phone": "string",
    "registrationNumber": "string",
    "userType": "ALUNO|PROFESSOR|ADMINISTRADOR",
    "approved": true,
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### 2.2 Buscar Usuário por ID
**GET** `/api/users/{id}`

Busca um usuário específico por ID.

**Permissão:** ADMINISTRADOR ou próprio usuário

**Parâmetros:**
- `id` (path): ID do usuário

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "phone": "string",
  "registrationNumber": "string",
  "userType": "ALUNO|PROFESSOR|ADMINISTRADOR",
  "approved": true,
  "createdAt": "2024-01-01T00:00:00"
}
```

**Resposta de Erro (404):** Usuário não encontrado

### 2.3 Buscar Usuários por Tipo
**GET** `/api/users/type/{userType}`

Lista usuários por tipo específico.

**Permissão:** ADMINISTRADOR

**Parâmetros:**
- `userType` (path): ALUNO, PROFESSOR ou ADMINISTRADOR

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string",
    "phone": "string",
    "registrationNumber": "string",
    "userType": "ALUNO",
    "approved": true,
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### 2.4 Listar Usuários Pendentes
**GET** `/api/users/pending`

Lista usuários que aguardam aprovação.

**Permissão:** ADMINISTRADOR

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string",
    "phone": "string",
    "registrationNumber": "string",
    "userType": "ALUNO",
    "approved": false,
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### 2.5 Aprovar Usuário
**PUT** `/api/users/{id}/approve`

Aprova um usuário pendente.

**Permissão:** ADMINISTRADOR

**Parâmetros:**
- `id` (path): ID do usuário

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "phone": "string",
  "registrationNumber": "string",
  "userType": "ALUNO",
  "approved": true,
  "createdAt": "2024-01-01T00:00:00"
}
```

**Resposta de Erro (400):** Erro ao aprovar usuário

### 2.6 Atualizar Usuário
**PUT** `/api/users/{id}`

Atualiza dados de um usuário.

**Permissão:** ADMINISTRADOR ou próprio usuário

**Parâmetros:**
- `id` (path): ID do usuário

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "phone": "string",
  "registrationNumber": "string",
  "userType": "ALUNO|PROFESSOR|ADMINISTRADOR"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "phone": "string",
  "registrationNumber": "string",
  "userType": "ALUNO",
  "approved": true,
  "createdAt": "2024-01-01T00:00:00"
}
```

**Resposta de Erro (400):** Erro ao atualizar usuário

### 2.7 Deletar Usuário
**DELETE** `/api/users/{id}`

Remove um usuário do sistema.

**Permissão:** ADMINISTRADOR

**Parâmetros:**
- `id` (path): ID do usuário

**Resposta de Sucesso (200):** Sem conteúdo

**Resposta de Erro (400):** Erro ao deletar usuário

---

## 3. Gerenciamento de Eventos (`/api/events`)

### 3.1 Criar Evento
**POST** `/api/events`

Cria um novo evento.

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "eventType": "ACADEMICO|FESTA",
  "date": "2024-01-01T10:00:00",
  "memberIds": [1, 2, 3]
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "eventType": "ACADEMICO",
  "date": "2024-01-01T10:00:00",
  "organizer": {
    "id": 1,
    "username": "string"
  },
  "members": []
}
```

**Resposta de Erro (400):** Erro ao criar evento

### 3.2 Listar Eventos do Usuário
**GET** `/api/events`

Lista eventos relacionados ao usuário autenticado.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "eventType": "ACADEMICO",
    "date": "2024-01-01T10:00:00",
    "organizer": {
      "id": 1,
      "username": "string"
    },
    "members": []
  }
]
```

**Resposta de Erro (400):** Erro ao buscar eventos

### 3.3 Listar Todos os Eventos
**GET** `/api/events/all`

Lista todos os eventos do sistema.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "eventType": "ACADEMICO",
    "date": "2024-01-01T10:00:00",
    "organizer": {
      "id": 1,
      "username": "string"
    },
    "members": []
  }
]
```

### 3.4 Buscar Evento por ID
**GET** `/api/events/{id}`

Busca um evento específico por ID.

**Parâmetros:**
- `id` (path): ID do evento

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "eventType": "ACADEMICO",
  "date": "2024-01-01T10:00:00",
  "organizer": {
    "id": 1,
    "username": "string"
  },
  "members": []
}
```

**Resposta de Erro (404):** Evento não encontrado

### 3.5 Buscar Eventos por Tipo
**GET** `/api/events/type/{eventType}`

Lista eventos por tipo específico.

**Parâmetros:**
- `eventType` (path): ACADEMICO ou FESTA

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "eventType": "ACADEMICO",
    "date": "2024-01-01T10:00:00",
    "organizer": {
      "id": 1,
      "username": "string"
    },
    "members": []
  }
]
```

### 3.6 Listar Eventos Acadêmicos
**GET** `/api/events/academic`

Lista apenas eventos acadêmicos.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "eventType": "ACADEMICO",
    "date": "2024-01-01T10:00:00",
    "organizer": {
      "id": 1,
      "username": "string"
    },
    "members": []
  }
]
```

### 3.7 Listar Eventos de Festa
**GET** `/api/events/party`

Lista apenas eventos de festa.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "eventType": "FESTA",
    "date": "2024-01-01T10:00:00",
    "organizer": {
      "id": 1,
      "username": "string"
    },
    "members": []
  }
]
```

### 3.8 Listar Membros do Evento
**GET** `/api/events/{id}/members`

Lista todos os membros de um evento específico.

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
    },
    "event": {
      "id": 1,
      "title": "string"
    },
    "joinedAt": "2024-01-01T00:00:00"
  }
]
```

**Resposta de Erro (404):** Evento não encontrado

### 3.9 Atualizar Evento
**PUT** `/api/events/{id}`

Atualiza dados de um evento.

**Parâmetros:**
- `id` (path): ID do evento

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "eventType": "ACADEMICO|FESTA",
  "date": "2024-01-01T10:00:00"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "eventType": "ACADEMICO",
  "date": "2024-01-01T10:00:00",
  "organizer": {
    "id": 1,
    "username": "string"
  },
  "members": []
}
```

**Resposta de Erro (400):** Erro ao atualizar evento

### 3.10 Deletar Evento
**DELETE** `/api/events/{id}`

Remove um evento do sistema.

**Parâmetros:**
- `id` (path): ID do evento

**Resposta de Sucesso (200):** Sem conteúdo

**Resposta de Erro (400):** Erro ao deletar evento

### 3.11 Adicionar Membro ao Evento
**POST** `/api/events/{eventId}/members/{userId}`

Adiciona um usuário como membro de um evento.

**Parâmetros:**
- `eventId` (path): ID do evento
- `userId` (path): ID do usuário

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "eventType": "ACADEMICO",
  "date": "2024-01-01T10:00:00",
  "organizer": {
    "id": 1,
    "username": "string"
  },
  "members": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "username": "string"
      },
      "joinedAt": "2024-01-01T00:00:00"
    }
  ]
}
```

**Resposta de Erro (400):** Erro ao adicionar membro

### 3.12 Remover Membro do Evento
**DELETE** `/api/events/{eventId}/members/{userId}`

Remove um usuário como membro de um evento.

**Parâmetros:**
- `eventId` (path): ID do evento
- `userId` (path): ID do usuário

**Resposta de Sucesso (200):** Sem conteúdo

**Resposta de Erro (400):** Erro ao remover membro

---

## 4. Utilitários (`/api/util`)

### 4.1 Gerar Hash de Senha
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
- **201 Created:** Recurso criado com sucesso
- **400 Bad Request:** Dados inválidos ou erro na requisição
- **401 Unauthorized:** Token inválido ou ausente
- **403 Forbidden:** Permissão insuficiente
- **404 Not Found:** Recurso não encontrado
- **500 Internal Server Error:** Erro interno do servidor

## Tipos de Usuário

- **ALUNO:** Estudante do sistema
- **PROFESSOR:** Professor do sistema
- **ADMINISTRADOR:** Administrador com privilégios especiais

## Tipos de Evento

- **ACADEMICO:** Eventos acadêmicos (palestras, seminários, etc.)
- **FESTA:** Eventos sociais e festivos

## Autenticação

Para rotas protegidas, inclua o token JWT no header:
```
Authorization: Bearer <seu_token_jwt>
```

## CORS

A API está configurada para aceitar requisições de qualquer origem (`*`). 