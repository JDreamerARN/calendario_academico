# Teste de Autenticação - Verificação de Token

## Como Testar

### 1. Login e Verificação Inicial

1. **Faça login** no sistema com um usuário cadastrado
2. **Abra o Console do Navegador** (F12 → Console)
3. **Observe os logs** durante o processo de login:
   ```
   Iniciando login para usuário: maria
   Login bem-sucedido, ID do usuário: 1
   Buscando dados completos do usuário...
   Dados do usuário obtidos: {id: 1, username: "maria", ...}
   Login concluído com sucesso
   ```

### 2. Verificação Manual do Token

No console do navegador:

```javascript
// Token salvo no login
const token = localStorage.getItem('token');
console.log('Token:', token);

// Testar endpoint público da API
fetch('http://localhost:8080/api/auth/test')
  .then(r => r.text())
  .then(console.log); // "API de autenticação funcionando!"
```

## Estrutura do Token JWT

O token JWT contém as seguintes informações:
```json
{
  "sub": "maria",
  "userId": 1,
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

- ✅ `/api/users/*` - Dados do próprio usuário e resumo de usuários
- ✅ `/api/events/*` - Eventos, participantes e comentários
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
   - O header `Authorization` deve estar presente em cada requisição protegida
   - Se não aparecer, o token não está no localStorage

### Se receber erro 401:

1. **Token expirado**: faça login novamente
2. **Token inválido**: limpe o localStorage e faça login
3. **Problema no backend**: verifique se o backend está validando o token corretamente

### Se receber erro 403:

- O usuário não tem permissão para o recurso. Exemplos:
  - Tentar acessar um evento do qual não participa
  - Tentar editar/excluir um evento que não criou
  - Tentar excluir um comentário de outro usuário

## Limpeza de Dados

Para limpar todos os dados de autenticação:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

## Próximos Passos

1. Teste o login e verifique os logs
2. Verifique se as requisições incluem o header `Authorization`
3. Teste os endpoints de eventos e comentários
