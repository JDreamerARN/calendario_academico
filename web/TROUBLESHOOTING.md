# Guia de Solução de Problemas - Frontend

## 🚨 Problemas Comuns e Soluções

### 1. Erro ao executar `npm start`

**Problema:** `npm error code ENOENT - Could not read package.json`

**Solução:**
```bash
# Certifique-se de estar no diretório correto
cd frontend

# Verifique se o package.json existe
ls -la package.json

# Se não existir, reinstale as dependências
npm install
```

### 2. Erros de TypeScript com Material-UI Grid

**Problema:** `Property 'item' does not exist on type 'GridBaseProps'`

**Solução:**
- Substitua os componentes `Grid` por `Box` com CSS Grid
- Use `sx={{ display: 'grid', gridTemplateColumns: '...' }}`

### 3. Erro de CORS ao conectar com o backend

**Problema:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Soluções:**
1. **Verifique se o backend está rodando:**
   ```bash
   curl http://localhost:8080/api/auth/test
   ```

2. **Use o proxy configurado:**
   - O arquivo `setupProxy.js` já está configurado
   - Reinicie o servidor de desenvolvimento após mudanças

3. **Configure o backend para aceitar CORS:**
   ```java
   @CrossOrigin(origins = "*")
   ```

### 4. Erro de dependências incompatíveis

**Problema:** `ERESOLVE unable to resolve dependency tree`

**Solução:**
```bash
# Use a flag legacy-peer-deps
npm install --legacy-peer-deps

# Ou force a instalação
npm install --force
```

### 5. Erro de porta já em uso

**Problema:** `Something is already running on port 3000`

**Solução:**
```bash
# Encontre o processo usando a porta
lsof -i :3000

# Mate o processo
kill -9 <PID>

# Ou use uma porta diferente
PORT=3001 npm start
```

### 6. Erro de módulo não encontrado

**Problema:** `Module not found: Can't resolve '...'`

**Solução:**
```bash
# Limpe o cache do npm
npm cache clean --force

# Remova node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### 7. Erro de autenticação

**Problema:** `401 Unauthorized` ou `Credenciais inválidas`

**Soluções:**
1. **Verifique se o backend está rodando**
2. **Teste a API diretamente:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin"}'
   ```

3. **Verifique o token no localStorage:**
   - Abra DevTools (F12)
   - Vá para Application > Local Storage
   - Verifique se o token está salvo

### 8. Erro de build

**Problema:** `npm run build` falha

**Solução:**
```bash
# Limpe o cache
npm run build -- --reset-cache

# Ou use
rm -rf build
npm run build
```

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar testes
npm test

# Verificar linting
npm run lint

# Corrigir linting automaticamente
npm run lint:fix
```

### Produção
```bash
# Build de produção
npm run build

# Servir build localmente
npx serve -s build
```

### Debug
```bash
# Verificar processos na porta 3000
lsof -i :3000

# Verificar processos na porta 8080
lsof -i :8080

# Logs do React
npm start 2>&1 | tee react.log
```

## 📱 Testando Responsividade

### Desktop
- Abra http://localhost:3000
- Use DevTools para testar diferentes resoluções

### Mobile
- Use DevTools > Toggle device toolbar
- Teste em diferentes dispositivos

### Tablet
- Resolução: 768px - 1024px
- Verifique se o menu lateral funciona

## 🐛 Debugging

### Console do Navegador
1. Abra DevTools (F12)
2. Vá para Console
3. Verifique erros em vermelho

### Network Tab
1. Abra DevTools (F12)
2. Vá para Network
3. Verifique requisições para a API

### React DevTools
1. Instale a extensão React DevTools
2. Inspecione componentes e estado

## 📞 Suporte

Se os problemas persistirem:

1. **Verifique os logs:**
   ```bash
   npm start 2>&1 | tee debug.log
   ```

2. **Teste a API separadamente:**
   ```bash
   curl http://localhost:8080/api/auth/test
   ```

3. **Verifique a versão do Node.js:**
   ```bash
   node --version
   # Deve ser 18 ou superior
   ```

4. **Limpe tudo e reinstale:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   npm start
   ``` 