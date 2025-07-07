# Autenticação JWT - Frontend

## Visão Geral

O sistema utiliza JWT (JSON Web Token) para autenticação. O token é enviado automaticamente em todas as requisições que requerem autenticação através de um interceptor do Axios.

## 🔐 Como Funciona

### **1. Login e Obtenção do Token**

```tsx
// 1. Usuário faz login
const response = await apiService.login({ username, password });

// 2. Token é salvo no localStorage
localStorage.setItem('token', response.token);

// 3. Token é salvo no contexto
setToken(response.token);
```

### **2. Interceptor Automático**

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

### **3. Requisições Autenticadas**

Todas as requisições para rotas protegidas incluem automaticamente:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Rotas que Requerem Autenticação

### **✅ Rotas Protegidas (JWT Obrigatório)**
- `POST /api/events` - Criar evento
- `GET /api/events` - Listar eventos do usuário
- `GET /api/events/all` - Listar todos os eventos
- `GET /api/users` - Listar usuários (ADMIN)
- `GET /api/users/{id}` - Buscar usuário por ID
- `PUT /api/events/{id}` - Atualizar evento
- `DELETE /api/events/{id}` - Deletar evento
- `POST /api/events/{eventId}/members/{userId}` - Adicionar membro
- `DELETE /api/events/{eventId}/members/{userId}` - Remover membro

### **❌ Rotas Públicas (Sem JWT)**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/test` - Teste da API

## 🧪 Como Testar

### **1. Componente de Teste Automático**

Na página de calendário, há um componente `TestAuthButton` que testa automaticamente:

1. **Token no localStorage**
2. **Endpoint de autenticação**
3. **Busca de dados do usuário**
4. **Criação de evento com JWT**

### **2. Console do Navegador**

Logs detalhados são exibidos no console:

```javascript
🔐 Token adicionado à requisição: /api/events
📋 Método: POST
🔑 Token (primeiros 20 chars): eyJhbGciOiJIUzI1NiIs...
✅ Requisição bem-sucedida: /api/events
```

### **3. Teste Manual**

```javascript
// No console do navegador
const token = localStorage.getItem('token');
console.log('Token:', token);

// Testar requisição manual
fetch('http://localhost:8080/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Teste',
    description: 'Teste',
    eventType: 'ACADEMICO',
    date: new Date().toISOString(),
    memberIds: []
  })
});
```

## 🔧 Configuração Técnica

### **1. Interceptor de Requisição**

```tsx
// frontend/src/services/api.ts
this.api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token adicionado à requisição:', config.url);
  }
  return config;
});
```

### **2. Interceptor de Resposta**

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

### **3. Contexto de Autenticação**

```tsx
// frontend/src/contexts/AuthContext.tsx
const [token, setToken] = useState<string | null>(null);

// Token é salvo no contexto e localStorage
const login = async (username: string, password: string) => {
  const response = await apiService.login({ username, password });
  setToken(response.token);
  localStorage.setItem('token', response.token);
};
```

## 🚨 Tratamento de Erros

### **Erro 401 - Token Inválido/Ausente**
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

### **Erro 403 - Permissão Insuficiente**
```javascript
// Resposta do servidor
{
  "status": 403,
  "message": "Permissão insuficiente"
}

// Ação do frontend
// Exibir mensagem de erro para o usuário
```

## 📊 Logs de Debug

### **Logs de Sucesso**
```
🔐 Token adicionado à requisição: /api/events
📋 Método: POST
🔑 Token (primeiros 20 chars): eyJhbGciOiJIUzI1NiIs...
✅ Requisição bem-sucedida: /api/events
🎯 Criando evento com dados: {title: "Teste", ...}
✅ Evento criado com sucesso: {id: 1, title: "Teste", ...}
```

### **Logs de Erro**
```
❌ Erro na requisição: /api/events
📊 Status: 401
📝 Mensagem: Token inválido ou ausente
🚪 Token inválido, redirecionando para login...
```

## 🔍 Troubleshooting

### **Problema: Token não está sendo enviado**

**Sintomas:**
- Erro 401 em todas as requisições
- Console mostra "Nenhum token encontrado"

**Soluções:**
1. Verificar se o login foi bem-sucedido
2. Verificar se o token está no localStorage
3. Verificar se o interceptor está funcionando

```javascript
// Debug no console
console.log('Token no localStorage:', localStorage.getItem('token'));
console.log('Token no contexto:', token);
```

### **Problema: Token expirado**

**Sintomas:**
- Erro 401 após algum tempo
- Redirecionamento automático para login

**Soluções:**
1. Fazer login novamente
2. Verificar se o backend está configurado corretamente
3. Verificar a expiração do token no backend

### **Problema: CORS**

**Sintomas:**
- Erro de CORS no console
- Requisições bloqueadas pelo navegador

**Soluções:**
1. Verificar se o backend está configurado para aceitar requisições do frontend
2. Verificar se o proxy está configurado corretamente

## 📝 Exemplo Completo

### **Fluxo de Criação de Evento**

```tsx
// 1. Usuário clica em "Adicionar Evento"
const handleAddEvent = () => {
  setModalOpen(true);
};

// 2. Usuário preenche o formulário e submete
const handleCreateEvent = (eventData: CreateEventRequest) => {
  createEvent(eventData, {
    onSuccess: () => {
      setModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Evento criado com sucesso!',
        severity: 'success',
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao criar evento',
        severity: 'error',
      });
    },
  });
};

// 3. Hook useEvents chama a API
const createEvent = (eventData: CreateEventRequest) => {
  return apiService.createEvent(eventData); // Token é adicionado automaticamente
};

// 4. Interceptor adiciona o token
config.headers.Authorization = `Bearer ${token}`;

// 5. Requisição é enviada para o backend
POST /api/events
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Palestra sobre React",
  "description": "Palestra introdutória",
  "eventType": "ACADEMICO",
  "date": "2024-01-15T14:00:00.000Z",
  "memberIds": []
}
```

## ✅ Checklist de Verificação

- [ ] Token é salvo após login
- [ ] Token está no localStorage
- [ ] Interceptor adiciona token automaticamente
- [ ] Requisições incluem header Authorization
- [ ] Erro 401 redireciona para login
- [ ] Token é removido ao fazer logout
- [ ] Logs de debug estão funcionando
- [ ] Componente de teste está disponível

---

**Data de Criação**: Janeiro 2024  
**Versão**: 1.0.0  
**Autor**: Sistema de Eventos Acadêmicos 