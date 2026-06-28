# Autenticação JWT - Frontend

## Visão Geral

O sistema utiliza JWT (JSON Web Token) para autenticação. O token é enviado automaticamente em todas as requisições que requerem autenticação, através de um interceptor do Axios.

Não há papéis de usuário nem aprovação: ao se registrar, o usuário já pode fazer login imediatamente.

## 🔐 Como Funciona

### 1. Login e Obtenção do Token

```tsx
// 1. Usuário faz login
const response = await apiService.login({ username, password });

// 2. Token é salvo no localStorage
localStorage.setItem('token', response.token);

// 3. Token é salvo no contexto
setToken(response.token);
```

### 2. Interceptor Automático

```tsx
// Interceptor adiciona o token em TODAS as requisições
this.api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Requisições Autenticadas

Todas as requisições para rotas protegidas incluem automaticamente:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Rotas e Autenticação

### ✅ Rotas Protegidas (JWT Obrigatório)
- `POST /api/events` - Criar evento
- `GET /api/events` - Listar eventos do usuário
- `GET /api/events/{id}` - Buscar evento
- `PUT /api/events/{id}` - Atualizar evento
- `DELETE /api/events/{id}` - Excluir evento
- `POST /api/events/{eventId}/members/{userId}` - Adicionar participante
- `DELETE /api/events/{eventId}/members/{userId}` - Remover participante
- `GET /api/events/{id}/comments` - Listar comentários
- `POST /api/events/{id}/comments` - Adicionar comentário
- `DELETE /api/events/{id}/comments/{commentId}` - Excluir comentário
- `GET /api/users/{id}` - Buscar próprio usuário
- `PUT /api/users/{id}` - Atualizar próprio usuário
- `GET /api/users/summary` - Resumo de usuários

### ❌ Rotas Públicas (Sem JWT)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/test` - Teste da API

## 🔧 Configuração Técnica

### 1. Interceptor de Requisição

```tsx
// web/src/services/api.ts
this.api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Interceptor de Resposta

```tsx
// Tratamento de erros 401 (token inválido)
this.api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Contexto de Autenticação

```tsx
// web/src/contexts/AuthContext.tsx
const [token, setToken] = useState<string | null>(null);

const login = async (username: string, password: string) => {
  const response = await apiService.login({ username, password });
  setToken(response.token);
  localStorage.setItem('token', response.token);

  // Busca os dados completos do usuário pelo id retornado
  const userData = await apiService.getUserById(response.id);
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
};
```

## 🚨 Tratamento de Erros

### Erro 401 - Token Inválido/Ausente
```javascript
// Resposta do servidor
{
  "status": 401,
  "message": "Token inválido ou ausente"
}

// Ação do frontend
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

### Erro 403 - Permissão Insuficiente
Ocorre, por exemplo, ao tentar acessar um evento do qual o usuário não participa, ou editar/excluir um evento que não criou.

## 🔍 Troubleshooting

### Problema: Token não está sendo enviado

**Sintomas:**
- Erro 401 em todas as requisições

**Soluções:**
1. Verificar se o login foi bem-sucedido
2. Verificar se o token está no localStorage
3. Verificar se o interceptor está funcionando

```javascript
console.log('Token no localStorage:', localStorage.getItem('token'));
```

### Problema: Token expirado

**Sintomas:**
- Erro 401 após algum tempo
- Redirecionamento automático para login

**Soluções:**
1. Fazer login novamente
2. Verificar a expiração do token no backend (`jwt.expiration`)

### Problema: CORS

**Sintomas:**
- Erro de CORS no console

**Soluções:**
1. Verificar se o backend está aceitando requisições do frontend
2. Verificar se o proxy (`setupProxy.js`) está configurado corretamente

## 📝 Exemplo: Criação de Evento

```tsx
// 1. Usuário preenche o formulário e submete
const handleCreateEvent = (eventData: CreateEventRequest) => {
  createEvent(eventData, {
    onSuccess: () => { /* feedback de sucesso */ },
    onError: (error) => { /* feedback de erro */ },
  });
};

// 2. O interceptor adiciona o token automaticamente
// 3. Requisição enviada ao backend:
// POST /api/events
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// Content-Type: application/json
//
// {
//   "title": "Reunião",
//   "description": "Alinhamento",
//   "tags": ["reunião"],
//   "color": "#1976d2",
//   "date": "2026-01-15T14:00:00.000Z",
//   "memberIds": []
// }
```

## ✅ Checklist de Verificação

- [ ] Token é salvo após login
- [ ] Token está no localStorage
- [ ] Interceptor adiciona token automaticamente
- [ ] Requisições incluem header Authorization
- [ ] Erro 401 redireciona para login
- [ ] Token é removido ao fazer logout
