# Teste de Autenticação - Verificação de Token

## Como Testar

### 1. Login e Verificação Inicial

1. **Faça login** no sistema com credenciais válidas
2. **Abra o Console do Navegador** (F12 → Console)
3. **Observe os logs** durante o processo de login:
   ```
   Iniciando login para usuário: admin
   Login bem-sucedido, ID do usuário: 1
   Buscando dados completos do usuário...
   Token adicionado à requisição: /api/users/1
   Dados do usuário obtidos: {id: 1, username: "admin", ...}
   Login concluído com sucesso
   ```

### 2. Teste Manual no Calendário

1. **Acesse o calendário** após o login
2. **Clique no botão "Testar Token"** no canto superior direito
3. **Verifique os logs** no console:
   ```
   Token atual: eyJhbGciOiJIUzUxMiJ9...
   Usuário atual: {id: 1, username: "admin", ...}
   Token adicionado à requisição: /api/auth/test
   Teste de autenticação: API de autenticação funcionando!
   Token adicionado à requisição: /api/users/1
   Dados do usuário obtidos: {id: 1, username: "admin", ...}
   ```

## Estrutura do Token JWT

O token JWT contém as seguintes informações:
```json
{
  "sub": "admin",
  "iat": 1751827711,
  "exp": 1751914111
}
```

## Headers das Requisições

### Requisições Autenticadas
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json
```

### Requisições Públicas (Login/Registro)
```
Content-Type: application/json
```

## Endpoints que Requerem Autenticação

- ✅ `/api/users/*` - Gerenciamento de usuários
- ✅ `/api/events/*` - Gerenciamento de eventos
- ✅ `/api/auth/test` - Teste de autenticação
- ❌ `/api/auth/login` - Login (não requer token)
- ❌ `/api/auth/register` - Registro (não requer token)

## Debug de Problemas

### Se o token não estiver sendo enviado:

1. **Verifique o localStorage**:
   ```javascript
   console.log('Token no localStorage:', localStorage.getItem('token'));
   ```

2. **Verifique o estado do contexto**:
   ```javascript
   const { token, user } = useAuth();
   console.log('Token no contexto:', token);
   console.log('Usuário no contexto:', user);
   ```

3. **Verifique o interceptor do Axios**:
   - Os logs devem mostrar "Token adicionado à requisição" para cada chamada
   - Se não aparecer, o token não está no localStorage

### Se receber erro 401:

1. **Token expirado**: Faça login novamente
2. **Token inválido**: Limpe o localStorage e faça login
3. **Problema no backend**: Verifique se o backend está validando o token corretamente

## Limpeza de Dados

Para limpar todos os dados de autenticação:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

## Logs de Debug Adicionados

### No ApiService (api.ts)
- Log quando token é adicionado à requisição
- Log quando não há token disponível

### No AuthContext
- Log detalhado do processo de login
- Log de erros com status e dados da resposta

### No Calendar
- Botão "Testar Token" para verificação manual
- Logs de token atual e dados do usuário

## Próximos Passos

1. Teste o login e verifique os logs
2. Clique no botão "Testar Token" no calendário
3. Verifique se todas as requisições estão incluindo o header Authorization
4. Teste diferentes endpoints que requerem autenticação 